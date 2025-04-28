import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Job } from "../models/job.model.js";

// Get all active jobs
export const getAllJobs = asynchandler(async (req, res) => {
  const jobs = await Job.find({ expired: false });
  console.log(jobs);
  return res.status(200).json(new ApiResponse(jobs, 200, "Jobs fetched successfully"));
});

// Post a new job
export const postJob = asynchandler(async (req, res) => {
    console.log("Request body:", req.body);
    
  const { role, _id: userId } = req.user;

  if (role === "Job Seeker") {
    throw new ApiError("Job Seeker not allowed to access this resource.", 400);
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    throw new ApiError("Please provide full job details.", 400);
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    throw new ApiError("Please either provide fixed salary or ranged salary.", 400);
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    throw new ApiError("Cannot enter fixed and ranged salary together.", 400);
  }

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy: userId,
  });

  return res.status(201).json(new ApiResponse(job, 201, "Job posted successfully"));
});

// Get all jobs posted by current user
export const getMyJobs = asynchandler(async (req, res) => {
  const { role, _id: userId } = req.user;

  if (role === "Job Seeker") {
    throw new ApiError("Job Seeker not allowed to access this resource.", 400);
  }

  const myJobs = await Job.find({ postedBy: userId });
  // console.log(myJobs);
  return res.status(200).json(new ApiResponse(myJobs, 200, "My Jobs fetched successfully"));
});

// Update job
export const updateJob = asynchandler(async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;

  if (role === "Job Seeker") {
    throw new ApiError("Job Seeker not allowed to access this resource.", 400);
  }

  let job = await Job.findById(id);
  if (!job) {
    throw new ApiError("OOPS! Job not found.", 404);
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(job, 200, "Job updated successfully"));
});

// Delete job
export const deleteJob = asynchandler(async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;

  if (role === "Job Seeker") {
    throw new ApiError("Job Seeker not allowed to access this resource.", 400);
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError("OOPS! Job not found.", 404);
  }

  await job.deleteOne();

  return res.status(200).json(new ApiResponse(null, 200, "Job deleted successfully"));
});

// Get single job
export const getSingleJob = asynchandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError("Job not found.", 404);
  }

  return res.status(200).json(new ApiResponse(job, 200, "Job fetched successfully"));
});
