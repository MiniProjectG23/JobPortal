import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import "./Home.css";
import {Link} from "react-router-dom" 
const HowItWorks = () => {
  return (
    <div className="howitworks-section">
      <div className="overlay"></div>
      <div className="container-howitworks">
        <h3 className="how-it-work-title">How JobRage Works</h3>
        <div className="banner-howitworks">
          <div className="card-howitworks">
            <div className="content-howitworks">
              <div className="icon-howitworks"><FaUserPlus /></div>
              <div className="text-howitworks">
                <p>Create Account</p>
                <p>Sign up to create your profile and access job opportunities or post job listings.</p>
              </div>
              <Link to="/login">
  <button className="how-it-work">Get Started</button>
</Link>
            </div>
          </div>
          <div className="card-howitworks">
            <div className="content-howitworks">
              <div className="icon-howitworks"><MdFindInPage /></div>
              <div className="text-howitworks">
                <p>Find a Job/Post a Job</p>
                <p>Explore job openings that match your skills or find the right candidates for your vacancies.</p>
              </div>
              <Link to={"/job/getall"}>
              <button className="how-it-work">Explore Now</button>
              </Link>
            </div>
          </div>
          <div className="card-howitworks">
            <div className="content-howitworks">
              <div className="icon-howitworks"><IoMdSend /></div>
              <div className="text-howitworks">
                <p>Apply For Job/Recruit Suitable Candidates</p>
                <p>Apply to jobs that interest you or recruit the best talent for your organization.</p>
              </div>
              <Link to={"/job/getall"}>
              <button className="how-it-work">Apply Now</button>
              </Link>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
