import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Chatbot from "./components/Chatbot/Chatbot";
import Details from "./components/Details/Details"; // Import the Details component
import ResumeUpload from "./components/ResumeATS/ResumeUpload";
import { Navigate } from "react-router-dom";
const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  
    if (user && isAuthorized) {
      setUser(user);
      setIsAuthorized(true);
    }
  }, [setUser, setIsAuthorized]);
  
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthorized ? <Home /> : <Navigate to="/login" />} />

          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/resume" element={<ResumeUpload />} />
        </Routes>
        <Footer />
        <Toaster />
        {isAuthorized && <Chatbot />}
        <Details />
      </BrowserRouter>
    </>
  );
};

export default App;
