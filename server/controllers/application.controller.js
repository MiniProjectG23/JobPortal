import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

// Submit a new application
export const postApplication = asynchandler(async (req, res) => {
  const { role, _id: userId } = req.user;

  if (role === "Employer") {
    throw new ApiError("Employer not allowed to access this resource.", 400);
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError("Resume file is required.", 400);
  }

  const { resume } = req.files;
  const allowedFormats = ["application/pdf"];

  if (!allowedFormats.includes(resume.mimetype)) {
    throw new ApiError("Invalid file type. Only PDF files are allowed.", 400);
  }

  const resumeFilePath = resume.tempFilePath;
  if (!resumeFilePath) {
    throw new ApiError("Please upload resume", 400);
  }

  const uploadedResume = await uploadOnCloudinary(resumeFilePath, "raw");

  if (!uploadedResume) {
    throw new ApiError("Error uploading resume", 500);
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!jobId) {
    throw new ApiError("Job ID is required", 404);
  }

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    throw new ApiError("Job not found", 404);
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID: { user: userId, role: "Job Seeker" },
    employerID: { user: jobDetails.postedBy, role: "Employer" },
    resume: {
      public_id: uploadedResume.public_id,
      url: uploadedResume.secure_url,
    },
  });

  return res.status(201).json(new ApiResponse(application, 201, "Application submitted"));
});
// Employer gets all received applications
export const employerGetAllApplications = asynchandler(async (req, res) => {
  const { role, _id } = req.user;

  if (role === "Job Seeker") {
    throw new ApiError("Job Seeker not allowed to access this resource.", 400);
  }

  const applications = await Application.find({ "employerID.user": _id });

  return res.status(200).json(new ApiResponse(applications, 200, "Applications fetched"));
});

// Job Seeker gets all submitted applications
export const jobseekerGetAllApplications = asynchandler(async (req, res) => {
  const { role, _id } = req.user;

  if (role === "Employer") {
    throw new ApiError("Employer not allowed to access this resource.", 400);
  }

  const applications = await Application.find({ "applicantID.user": _id });

  return res.status(200).json(new ApiResponse(applications, 200, "Applications fetched"));
});

// Job Seeker deletes an application
export const jobseekerDeleteApplication = asynchandler(async (req, res) => {
  const { role } = req.user;

  if (role === "Employer") {
    throw new ApiError("Employer not allowed to access this resource.", 400);
  }

  const { id } = req.params;

  const application = await Application.findById(id);
  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  await application.deleteOne();

  return res.status(200).json(new ApiResponse(null, 200, "Application deleted"));
});

// Update application status (accept/reject)
export const applicationStatus = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (![0, 1].includes(status)) {
    throw new ApiError("Invalid status value. Must be 0 or 1.", 400);
  }

  const application = await Application.findById(id);

  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  application.accepted = status;
  await application.save();

  return res.status(200).json(new ApiResponse(application, 200, "Application status updated"));
});
