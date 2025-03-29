import React from "react";
import Slider from "react-slick";
import { FaMicrosoft, FaApple, FaGoogle, FaFacebook, FaAmazon, FaLinkedin } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

const PopularCompanies = () => {
  const companies = [
    { id: 1, title: "Microsoft", location: "Bangalore, India", openPositions: 10, icon: <FaMicrosoft /> },
    { id: 2, title: "Google", location: "Hyderabad, India", openPositions: 15, icon: <FaGoogle /> },
    { id: 3, title: "Facebook", location: "Mumbai, India", openPositions: 8, icon: <FaFacebook /> },
    { id: 4, title: "Amazon", location: "Chennai, India", openPositions: 20, icon: <FaAmazon /> },
    { id: 5, title: "Apple", location: "Pune, India", openPositions: 5, icon: <FaApple /> },
    { id: 6, title: "LinkedIn", location: "Delhi, India", openPositions: 12, icon: <FaLinkedin /> },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true, // Ensures the slider stays in the center
    centerPadding: "0px", // Prevents unwanted extra spacing
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="companies-popularCompanies">
      <div className="container-popularCompanies">
        <h3 className="top-com">TOP COMPANIES</h3>
        <Slider {...settings} className="slider-popularCompanies">
          {companies.map((element) => (
            <div className="card-popularCompanies" key={element.id}>
              <div className="content-popularCompanies">
                <div className="icon-popularCategories">{element.icon}</div>
                <div className="text-popularCompanies">
                  <p className="company-title">{element.title}</p>
                  <p className="company-location">{element.location}</p>
                </div>
              </div>
              <button className="popular-categories">Open Positions {element.openPositions}</button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularCompanies;
