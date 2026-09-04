import {
     registerAdmin as registerAdminService,
     loginUser as loginUserService,
    } from"./auth.service.js";

export const registerAdmin = async(req,res) =>{
    try{
        const admin = await registerAdminService(req.body);
        res.status(201).json({
            success: true,
            message: "Admin registered successfully.",
            data: admin,
        });
    }catch(error){
        console.error("Register Admin Error:", error.message);

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const loginUser = async(req,res) =>{
    try{
        const { email,password}= req.body;

        const result = await loginUserService(email,password);
        res.status(200).json({
            success: true,
            message:"Login successful.",
            data: result,
        });
    }catch(error){
        console.error("Login Error:",error.message);
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};