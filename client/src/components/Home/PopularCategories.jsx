import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import './Home.css';

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Graphics & Design",
      subTitle: "305 Open Positions",
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Mobile App Development",
      subTitle: "500 Open Positions",
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Frontend Web Development",
      subTitle: "200 Open Positions",
      icon: <MdOutlineWebhook />,
    },
    {
      id: 4,
      title: "MERN STACK Development",
      subTitle: "1000+ Open Postions",
      icon: <FaReact />,
    },
  
    
  ];
  return (
    <div className="categories-popularCategories">
      <h3 className="pop-text">POPULAR CATEGORIES</h3>
      <div className="banner-popularCategories">
        {categories.map((element) => {
          return (
            <div className="card-popularCategories" key={element.id}>
              <div className="content-popularCategories">
                <div className="icon-popularCategories">{element.icon}</div>
                <div className="text-popularCategories">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                  <button className="popular-categories">Open Positions</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
