import { Router } from "express";
import { registerUser,loginUser,logoutUser,getCurrentUser} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logoutUser)
router.get("/getuser", verifyJWT, getCurrentUser);

export default router;