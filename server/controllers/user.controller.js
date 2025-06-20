import {asynchandler} from "../utils/asynchandler.js"; 
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessandRefreshToken=  async(userId)=>{
    try{
      const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
         user.refreshToken=refreshToken
         await user.save({validateBeforeSave:false})
            return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError("Error generating access tokens", 500)

    }
}

  const registerUser=asynchandler(async(req,res)=>{
  
        
        const { name, email, phone, password, role } = req.body;
        if (!name || !email || !phone || !password || !role) {
            throw new ApiError("Please provide all fields", 400);
        }
        const isEmail = await User.findOne({ email });
        if (isEmail) {
            throw new ApiError("Email already exists", 400);
        }
        const user = await User.create({
          name,
          email,
          phone,
          password,
          role
        });
        
      const createdUser= await User.findById(user._id).select("-password -refreshToken")
      if(!createdUser){
          throw new ApiError("Error creating user", 500)
      }
      return res.status(201).json(
          new ApiResponse(createdUser,201,"User registered successfully")
      )
  })

  const loginUser = asynchandler(async (req, res) => {
  
    const { email, password, role } = req.body;
  
   
    if (!email) {
      throw new ApiError("Please provide email", 400);
    }
  
    if (!password) {
      throw new ApiError("Please provide password", 400);
    }
    if (!role) {
      throw new ApiError("Please provide role", 400);
    }
  

    const user = await User.findOne({
      $or: [{ email }],
    });
  
    if (!user) {
      throw new ApiError("User does not exist", 404);
    }

    // console.log(user);

    const validPass = await user.isPasswordCorrect(password);
    if (!validPass) {
      throw new ApiError("Password is incorrect", 401);
    }
  
    if (user.role !== role) {
      throw new ApiError(`User does not have the expected role: ${role}`, 403);
    }
  
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
  
    const loggedInUser= await  User.findByIdAndUpdate(user._id).select("-password -refreshToken")
    const options = {
      httpOnly: true,
      secure: true, 
    };
  
   console.log(loggedInUser);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse({
        user: loggedInUser,
        accessToken,
        refreshToken,
      }, 200, "User logged in successfully"));
  });

  const logoutUser= asynchandler(async (req, res) => {
    User.findByIdAndUpdate(
     req.user._id, {
           $set:{
             refreshToken: undefined
           }
    },
    {
     new:true
  }
 )
 const options={
     httpOnly:true,
     secure:true,
   }
   return res.status(200)
   .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(new ApiResponse(null, 200, "User logged out successfully"))
 })

const changeCurrentPassword= asynchandler(async (req, res) => {
   const {oldPassword, newPassword}=req.body
   const user=await User.findById(req.user?._id)
   const checkPassword= await user.isPasswordCorrect(oldPassword)
   if(!checkPassword){
       throw new ApiError("Old password is incorrect", 401)
   }
   user.password=newPassword
   await user.save({validateBeforeSave:false}) 
   return res.status(200)
   .json(new ApiResponse({}, 200, "Password changed successfully"))
})

const getCurrentUser= asynchandler(async (req, res) => {
  // console.log("IN getCurrentUser");
  // console.log(req.user);
   return res.status(200)
   .json(new ApiResponse(req.user, 200, "User fetched successfully"))
})

const resumeUpload= asynchandler(async (req, res) => {
    const resumeFilePath= req.files?.resume[0]?.path;
    if(!resumeFilePath){
      throw new ApiError("Please upload resume", 400)
  }

 const yourResume= await uploadOnCloudinary(resumeFilePath);
    if(!yourResume){
        throw new ApiError("Error uploading resume", 500)
    }

    return res.status(200).json(new ApiResponse({ message: "Resume uploaded successfully",data : yourResume.url }, 200, "Resume uploaded successfully"));
  });

const updateUserProfile = asynchandler(async(req,res)=>{
   
  const user = await User.findById(req.user?._id);
  if(!user){
    throw new ApiError("User not found", 404);
  }

  console.log("Files:", req.files);
  console.log("Body:", req.body);

  //profile pic upload
  const profilePicPath = req.files?.profilePic?.[0]?.path;
  if(profilePicPath){
    const uploadProfilePic = await uploadOnCloudinary(profilePicPath);
    if(!uploadProfilePic){
      throw new ApiError("Error uploading profile picture", 500);
    }
    user.profilePic = uploadProfilePic.url;
  }

  // resume Upload
  const resumeFilePath = req.files?.resume?.[0]?.path;
  if(resumeFilePath){
    const uploadResume = await uploadOnCloudinary(resumeFilePath);
    if(!uploadResume){
      throw new ApiError("Resume Upload Failed" , 500);
    }
    user.resume = uploadResume.url;
  }

  const {name , phone} = req.body;
  if(name) user.name = name;
  if(phone) user.phone = phone;

  await user.save({validateBeforeSave:false});

  return res.status(200).json(
       new ApiResponse(user,200,"User Profile updated successfully")
  );
});

const getUserDashboard = asynchandler(async(req,res)=>{
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  if(!user){
    throw new ApiError("User not found", 404);
  }
  return res.status(200).json(new ApiResponse(user,200,"User Dashboard"));
});

export {resumeUpload,registerUser,loginUser,logoutUser,changeCurrentPassword,getCurrentUser,updateUserProfile,getUserDashboard}