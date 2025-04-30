import React, { useState } from "react";
import { FaFilePdf, FaCloudUploadAlt } from "react-icons/fa";
import "./ResumeUpload.css";
import res_img from "./res.jpg";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [mode, setMode] = useState("summary");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFile(null);
            setFileName("");
            alert("Only PDF files are allowed!");
        }
    };

    const handleUpload = async () => {
        if (!file || !jobDesc) {
            alert("Please select a PDF and enter Job Description.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // ✅ Fixed: backend expects "file"
        formData.append("job_desc", jobDesc);
        formData.append("mode", mode);

        try {
            setLoading(true);
            setError("");
            setResult("");

            const response = await fetch("http://localhost:8000/analyze_resume/", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data.result || "No response received.");
        } catch (err) {
            console.error(err);
            setError("An error occurred while uploading the resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-page">
            <div className="hero-section">
                <img src={res_img} alt="Hero" className="hero-image" />
                <h1>Find Your Dream Job Today!</h1>
            </div>

            <div className="resume-upload-container">
                <div className="upload-box">
                    <FaCloudUploadAlt className="upload-icon" />
                    <h2>Upload Your Resume</h2>

                    <label htmlFor="file-upload" className="custom-file-upload">
                        Choose PDF File
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    {fileName && (
                        <div className="file-preview">
                            <FaFilePdf className="file-icon" />
                            <p>{fileName}</p>
                        </div>
                    )}

                    <textarea
                        placeholder="Enter Job Description..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        rows={4}
                        style={{ width: "100%", marginTop: "10px", padding: "10px" }}
                    />

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        style={{ marginTop: "10px" }}
                    >
                        <option value="summary">Summary</option>
                        <option value="match">Match</option>
                    </select>

                    <button className="sub-button" onClick={handleUpload} disabled={!fileName || loading}>
                        {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div style={{
                            marginTop: "20px",
                            background: "#f3f3f3",
                            padding: "10px",
                            borderRadius: "10px",
                            maxHeight: "400px",
                            overflowY: "auto"
                        }}>
                            <h3 className="result">Result:</h3>
                            <div dangerouslySetInnerHTML={{ __html: result }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeUpload;
