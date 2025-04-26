import Router from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  applicationStatus, 
} from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/post", verifyJWT, postApplication);
router.get("/employer/getall", verifyJWT, employerGetAllApplications);
router.get("/jobseeker/getall", verifyJWT, jobseekerGetAllApplications);
router.delete("/delete/:id", verifyJWT, jobseekerDeleteApplication);
router.patch("/status/:id", verifyJWT, applicationStatus); 

export default router;
