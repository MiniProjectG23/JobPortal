import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import './Application.css';
import { TbConePlus } from "react-icons/tb";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For form validation

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);


  // Handle file change
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setResume(null); // Reset the file if it's invalid
    } else {
      setError("");
      setResume(uploadedFile);
    }
  };

  // Handle form submission
  const handleApplication = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError("Please upload a valid resume.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    console.log("Sending form data:", formData);

    try {
      console.log("About to send post request");

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true, 
        }
      );
      resetForm(); // Clear form on success
      toast.success(data.message);
      
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    
  };

  // Clear form data
  const resetForm = () => {
    setName("");
    setEmail("");
    setCoverLetter("");
    setPhone("");
    setAddress("");
    setResume(null);
    setError("");
  };

  // Redirect if not authorized or user is an employer
  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  return (
    <section className="application-applicationform">
      {loading && (
        <div className="loader-applicationform">
          <div className="spinner-applicationform"></div>
        </div>
      )}
      <div className="container-applicationform">
        <h3 className="heading-applicationform">Application Form</h3>
        <form onSubmit={handleApplication} className="form-applicationform" encType="multipart/form-data">

          <label className="label-applicationform">Your Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-applicationform"
            required
          />

          <label className="label-applicationform">Your Email</label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-applicationform"
            required
          />

          <label className="label-applicationform">Your Phone Number</label>
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-applicationform"
            required
          />

          <label className="label-applicationform">Your Address</label>
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-applicationform"
            required
          />

          <label className="label-applicationform">Cover Letter</label>
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="textarea-applicationform"
            required
          />

          <div className="file-input-applicationform">
            <label
              htmlFor="resume-upload"
              className="file-label-applicationform"
            >
              Select Resume
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-hidden"
            />
            {/* Show selected file name if resume is selected */}
            {resume && (
              <p className="file-name-applicationform">
                Selected File: {resume.name}
              </p>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
          <div className="button-group-applicationform">
            <button
              type="button"
              onClick={resetForm}
              className="clear-button-applicationform"
            >
              Clear
            </button>
            <button type="submit" className="submit-button-applicationform">
              {loading ? "Sending..." : "Send Application"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Application;
