import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"  
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResonse } from "../utils/ApiResponse.js";

const registerUser =asyncHandler(async (req, res)=>{
    const {fullname, email,username,password}=req.body
    console.log("password", password)

    //validation
    // if(fullname===""){
    //     throw new ApiError(400,"Fullname is required")
    // }
    if(
        [fullname, username ,email ,password].some((field)=>
        field?.trim()==="")){
            throw new ApiError(400,"All fields is required")
        }

        //check if user already exit or not

     const existedUser= await User.findOne({
      $or:[{username},{email}]
           })

if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
}

//check if image exist
const avatarLocalPath=req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
}
// upload to cloudinary
const avatar =await uploadOnCloudinary(avatarLocalPath);
const coverImage= await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400, "Failed to upload Avatar");
}

//create user object
const user=await User.create({
    fullname:fullname,
    email:email,
    username:username.toLowerCase(),
    password:password,
    avatar:avatar.url,
    coverImage:coverImage.url || ""
})

//removing password and refresh token and checking if user object is created or not
const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}

//now return the response

return res.status(201).json(
    new ApiResonse(200,createdUser, "User registered Successfully")
)



}) 


export {registerUser}