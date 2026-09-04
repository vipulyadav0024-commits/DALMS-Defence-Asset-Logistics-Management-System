import {
     createEmployeeService,
     getAllEmployeesService,
     getEmployeeByIdService,
     updateEmployeeService,
     deleteEmployeeService,
     } from "./employee.service.js";

export const createEmployee = async (req,res) => {
    try{
        const employee = await createEmployeeService(req.body);
        res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employee,
        });
    }catch(error) {
        console.error("Create Employee Error:",error.message);
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
};
export const getAllEmployees = async(req,res) =>{
    try{
        const employees = await getAllEmployeesService();
        res.status(200).json({
            success: true,
            message: "Employees fteched successfully.",
            data: employees,
        });

    }catch(error){
        console.error("Get All Employees Error:", error.message);
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
export const getEmployeeById = async(req,res) => {
    try{
        const { id } =req.params;
        const employee = await getEmployeeByIdService(id);
        res.status(200).json({
            success: true,
            message: "Employee fetched successfully.",
            data: employee,
        });

    }catch(error){
        console.error("Get Employee By Id Error:", error.message);
        res.status(404).json({
            success:false,
            message: error.message,
        });
    }
};
export const updateEmployee = async(req,res,next)=>{
    try{
        const employee = await updateEmployeeService(
            req.params.id,
            req.body
        );
        return res.status(200).json({
            success:true,
            message:"Employee updated successfully.",
            data: employee,
        });
    } catch(error){
        next(error);
    }
};
export const deleteEmployee = async(req,res,next) => {
    try{
        await deleteEmployeeService(req.params.id);
        return res.status(200).json({
            success:true,
            message:"Employee deleted successfully.",
        });

    }catch(error){
        next(error);
    }
};