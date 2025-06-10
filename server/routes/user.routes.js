import { Router } from "express";
import { resumeUpload,registerUser,loginUser,logoutUser,getCurrentUser,updateUserProfile,getUserDashboard} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logoutUser)
router.get("/getuser", verifyJWT, getCurrentUser);
router.route("/resume").post(
    upload.fields([
        { name: "resume", 
        }
    ]),
    resumeUpload);

router.route("/dashboard/update").put(verifyJWT,upload.fields([
    {name: "profilePic",maxCount: 1},
    {name: "resume", maxCount: 1}
]),updateUserProfile);

router.route("/dashboard").get(verifyJWT,getUserDashboard);
export default router;