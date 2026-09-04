import {
    getAllAdmins,
    createAdmin,
} from "./admin.service.js";


// GET /api/admins
export const getAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();

        res.status(200).json({
            success: true,
            message: "Admins fetched successfully.",
            data: admins,
        });
    } catch (error) {
        console.error(
            "Get Admins Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// POST /api/admins
export const addAdmin = async (req, res) => {
    console.log(
        "REQ.BODY RECEIVED:",
        req.body
    );

    try {
        const admin = await createAdmin(
            req.body,
            req.user._id
        );

        res.status(201).json({
            success: true,
            message: "Admin created successfully.",
            data: admin,
        });
    } catch (error) {
        console.error(
            "Add Admin Error:",
            error.message
        );

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};