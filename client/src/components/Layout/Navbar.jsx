import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "./bg-logo-main.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/user/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully.");
  
      // Clear user-related data
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthorized");
  
      setIsAuthorized(false);
      setUser(null); // Clear user from context
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  

  return (
    <nav className="topnav">
      <div className="nav-container">
        {/* Left: Logo */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src={logo} alt="JobDekho" />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/job/getall">ALL JOBS</Link></li>
          <li><Link to="/applications/me">{user?.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}</Link></li>

          {/* Conditional Links for Employer */}
          {user?.role === "Employer" && (
            <>
              <li><Link to="/job/post">POST NEW JOB</Link></li>
              <li><Link to="/job/me">VIEW YOUR JOBS</Link></li>
            </>
          )}
          <li><Link to="/">Mock Interview</Link></li>
          <li><Link to="/resume">Resume ATS</Link></li>
        </ul>

        {/* Right: Logout */}
        {isAuthorized && user && (
  <div className="nav-right">
      <div className="welcome-message">
      <span className="greeting">Welcome,</span>
      <span className="user-name">{user.name}</span>
    </div>
    <button className="logoutButton" onClick={handleLogout}>LOGOUT</button>
  </div>
)}

      </div>
    </nav>
  );
};

export default Navbar;
