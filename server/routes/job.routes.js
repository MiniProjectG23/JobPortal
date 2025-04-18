import { Router } from "express";
import {
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
} from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/post").post(verifyJWT, postJob);

router.route("/getall").get(getAllJobs);

router.route("/getmyjobs").get(verifyJWT, getMyJobs);

router.route("/update/:id").put(verifyJWT, updateJob);

router.route("/delete/:id").delete(verifyJWT, deleteJob);

router.route("/:id").get(verifyJWT, getSingleJob); 

export default router;
