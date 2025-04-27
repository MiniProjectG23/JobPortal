import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [resumeName, setResumeName] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const url =
          user && user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const res = await axios.get(url, { withCredentials: true });
        // console.log(res.data.data);
        setApplications(res.data.data || []);
      } catch (error) {
        // Safe error handling
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete application.";
      toast.error(errorMessage);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/v1/application/status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id
            ? { ...application, accepted: status }
            : application
        )
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update application status.";
      toast.error(errorMessage);
    }
  };

  const openModal = (imageUrl, name) => {
    setResumeImageUrl(imageUrl);
    setResumeName(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      <h1 className="heading-myapplication">
        {user && user.role === "Job Seeker"
          ? "My Applications"
          : "Applications From Job Seekers"}
      </h1>
      <div className="container-myapplication">
        {applications.length <= 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element, index) => {
            return user && user.role === "Job Seeker" ? (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
                index={index}
              />
            ) : (
              <EmployerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                updateApplicationStatus={updateApplicationStatus}
                openModal={openModal}
                index={index}
              />
            );
          })
        )}
      </div>
      {modalOpen && (
        <ResumeModal
          imageUrl={resumeImageUrl}
          name={resumeName}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal, index }) => {
  return (
    <div
      className={`job_seeker_card-myapplication ${
        element.accepted === 1 ? "accepted" : ""
      } ${element.accepted === 0 ? "rejected" : ""}`}
    >
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume-img">
        <FontAwesomeIcon
          icon={faFilePdf}
          style={{ color: "#74148f", fontSize: "50px", cursor: "pointer" }}
          onClick={() => window.open(element.resume.url, "_blank")}
        />
      </div>
    </div>
  );
};

const EmployerCard = ({
  element,
  deleteApplication,
  updateApplicationStatus,
  openModal,
  index,
}) => {
  const handleGmailClick = (email) => {
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div
      className={`job_seeker_card-myapplication ${
        element.accepted === 1 ? "accepted" : ""
      } ${element.accepted === 0 ? "rejected" : ""}`}
    >
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume-img">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url, element.name)}
        />
        <p className="resume-name">{element.name.split(" ")[0]}'s Resume</p>
      </div>
      <div className="btn_area">
        {element.accepted === 1 ? (
          <>
            <button className="accepted-btn">Accepted</button>
            <button
              className="gmail-btn"
              onClick={() => handleGmailClick(element.email)}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                alt="Gmail"
              />
              Redirect To Gmail
            </button>
          </>
        ) : element.accepted === 0 ? (
          <button className="rejected-btn">Rejected</button>
        ) : (
          <>
            <button
              className="accept-btn"
              onClick={() => updateApplicationStatus(element._id, 1)}
            >
              Accept Application
            </button>
            <button
              className="reject-btn"
              onClick={() => updateApplicationStatus(element._id, 0)}
            >
              Reject Application
            </button>
          </>
        )}
      </div>
    </div>
  );
};
