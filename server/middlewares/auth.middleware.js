import {asynchandler} from  "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, _, next) => {
    console.log("In auth middleware")
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Token received:", token);

        if (!token) {
            throw new ApiError("Unauthorized access", 401);
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError("Invalid Access Token", 401);
        }
        
        req.user = user;
        console.log("Decoded token:", decodedToken);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError("Token has expired", 401);
        }
        console.error("Error verifying token:", error);
        throw new ApiError("Invalid Access Token", 401);
    }
});

