// require("dotenv").config({path: "/.env"});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import app from "./app.js";
dotenv.config({path: "./.env"});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error("Error connecting to the database", err);
    process.exit(1);
});
