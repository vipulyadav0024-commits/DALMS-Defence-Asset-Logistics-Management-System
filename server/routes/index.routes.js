import express from "express";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js"
//import employeeRoutes from"../modules/employees/employee.routes.js";

const router = express.Router();
router.get("/",(req,res) =>{
    res.send("Sentinel backend is running successfully!");
});
router.use("/dashboard", dashboardRoutes);


// router.use("/employees",employeeRoutes);


export default router;