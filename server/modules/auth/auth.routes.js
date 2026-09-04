import express from "express";
import {
    registerAdmin,
    loginUser,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register-admin",registerAdmin);
router.post("/login",loginUser);
export default router;