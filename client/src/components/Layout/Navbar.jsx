import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiX } from "react-icons/fi";
import logo from "./bg-logo-main.png";
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthorized(false);
      sessionStorage.removeItem("greetingShown");
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  return (
    <nav className="topnav">
      <div className="nav-container">
        {/* Logo (Left) */}
        <Link to="/" className="logo">
          <img src={logo} alt="JobDekho" />
        </Link>

      
        <ul className={showMenu ? "nav-links show" : "nav-links"}>
          <li>
            <Link to="/" onClick={() => setShowMenu(false)}>HOME</Link>
          </li>
          <li>
            <Link to="/job/getall" onClick={() => setShowMenu(false)}>ALL JOBS</Link>
          </li>
          <li>
            <Link to="/applications/me" onClick={() => setShowMenu(false)}>
              {user?.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}
            </Link>
          </li>
          {user?.role === "Employer" && (
            <>
              <li>
                <Link to="/job/post" onClick={() => setShowMenu(false)}>POST NEW JOB</Link>
              </li>
              <li>
                <Link to="/job/me" onClick={() => setShowMenu(false)}>VIEW YOUR JOBS</Link>
              </li>
              
            </>
          )}
          
          <li>
            <Link to="/" onClick={() => setShowMenu(false)}>Mock Interview</Link>
          </li>

          <li>
            <Link to="/resume" onClick={() => setShowMenu(false)}>Resume ATS</Link>
          </li>
        </ul>
      </div>
        {/* Logout Button (Right) */}
        {isAuthorized && (
          <div className="logout-container">
            <button className="logoutButton" onClick={handleLogout}>LOGOUT</button>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
