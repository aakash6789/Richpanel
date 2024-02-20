import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user= await User.findById(userId);
        const accessTokenPr=user.generateAccessToken();
        const refreshTokenPr=user.generateRefreshToken();
        let refreshToken;
        await refreshTokenPr.then((token)=>{refreshToken=token})
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessTokenPr,refreshTokenPr};
    } catch (error) {
        throw new ApiError(500,"Something went wrong with token generation");
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {email,username, password}=req.body;
    console.log(req.body);
   if([email,username,password].some((field)=> {return field?.trim()===""})){
    throw new ApiError({statusCode:400,message:"All fields are required"})
   }
   const existedUser= await User.findOne({$or:[{username},{email}]});
   if(existedUser){
         throw new ApiError(409,"User already exists!!");
   }

  const user=await User.create({
    email,
    password,
    username:username.toLowerCase(),
    refreshToken:""
   });
   const createdUser=await User.findById(user._id).select("-password -refreshToken");
   if(!createdUser){
    throw new ApiError(500,"Something went wrong");
   }
   return res.status(201).json(
    new ApiResponse(200,createdUser,"User added sucessfully")
   )
   
});

const loginUser=asyncHandler(async(req,res)=>{
   const {username,email,password}=req.body;
   if(!username && !email){
    throw new ApiError(400, "Any one of email or username is required");
   }
   const user=await User.findOne({$or:[{username},{email}]});
   if(!user){
    throw new ApiError(404, "User does not exist, try creating an account first");
   }
    const isPassValid=await user.isPasswordCorrect(password);
        if(isPassValid){
           const {accessTokenPr,refreshTokenPr}=await generateAccessAndRefreshToken(user._id);
           let accessToken;
           let refreshToken;
           await accessTokenPr.then((token)=>{
            accessToken=token;
           }).catch(error => {
            console.error('accessToken promise Error:', error);
        });
           await refreshTokenPr.then((token)=>{
            refreshToken=token;
           }).catch(error => {
            console.error('refreshToken promise Error:', error);
        });
           const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
           const options={
            httpOnly:true,
            secure:true
           }
            return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options ).json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"Logged in successfully"));
        }
        throw new ApiError(401, "Incorrect password");
});

const logOutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $set:{refreshToken:undefined}
  })
  const options={
    httpOnly:true,
    secure:true
   }
   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"Logged out successfully"));
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incRefreshToken=req.cookies.refreshToken||req.body.refreshToken;
    if(!incRefreshToken){
        throw new ApiError(401,"Unauthorized req Refresh token does not exist")
    }
   const decodedToken= await jwt.verify(incRefreshToken,process.env.REFRESH_TOKEN_SECRET);
   const user=await User.findById(decodedToken?._id);
   if(!user){
    throw new ApiError(401,"Invalid refresh token");
}
if(!user.refreshToken){
    throw new ApiError(401,"User Refresh token does not exist");
}
if(incRefreshToken!==user.refreshToken){
    throw new ApiError(401,"Refresh token is invalid or expired");
}
const {refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id);
const options={
    httpOnly:true,
    secure:true
}

return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken},"AcessToken rengerenated sucessfully"))
})

const updatePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassowrd}=req.body;

    const user=await user.findById(req.user?._id);
    if(!user){
        throw new ApiError(404,"User does not exist");
    }
    const isPasscorrect=await user.isPasscorrect(oldPassword);
    if(!isPasscorrect){
        throw new ApiError(400,"Password does not match");
    }
    user.password=newPassowrd;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"));
})

const getCurrUser=asyncHandler(async(req,res)=>{
    if(!req.user){
        throw new ApiError(401,"User is not logged in, bad request")
    }
    return res.status(200).json(200,req.user,"User details fetched successfully")
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {username,email}=req.body;
    if(!username && !email){
        throw new ApiError(400,"All fields are required");
    }
    const user=User.findByIdAndUpdate(req.user?._id,{$set:{username,email}},{new:true}).select("-password");

    return res.status(200).json(new ApiResponse(200,user,"User details updated successfully"))
})

export {registerUser,logOutUser,loginUser,refreshAccessToken,updatePassword,getCurrUser,updateAccountDetails};