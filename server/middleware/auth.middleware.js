import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";

export const authenticateUser = async(req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader){
            return res.status(401).json({
                success: false,
                message: "Access token is required.",
            });
        }
        if (!authHeader .startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }
        req.user = user;
        next(); 
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    if (req.user.role !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required.",
        });
    }

    next();
};