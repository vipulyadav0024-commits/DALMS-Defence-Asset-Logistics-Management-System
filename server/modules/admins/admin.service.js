import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import { createNotification } from "../notifications/notification.service.js";


// Get all Admins
export const getAllAdmins = async () => {
    const admins = await User.find({ role: "Admin" })
        .select("-password")
        .sort({ createdAt: -1 });

    return admins;
};


// Create Admin
export const createAdmin = async (
    adminData,
    createdByUserId
) => {
    console.log(
        "ADMIN DATA RECEIVED:",
        adminData
    );

    const {
        employeeId,
        fullName,
        email,
        password,
        department,
        designation,
        joiningDate,
        mobile,
        officeLocation,
    } = adminData;


    // Normalize email
    const normalizedEmail = email
        .trim()
        .toLowerCase();


    // Check duplicate email
    const existingEmail = await User.findOne({
        email: normalizedEmail,
    });

    if (existingEmail) {
        throw new Error(
            "A user with this email already exists."
        );
    }


    // Check duplicate employee ID
    const existingEmployee = await User.findOne({
        employeeId,
    });

    if (existingEmployee) {
        throw new Error(
            "A user with this employee ID already exists."
        );
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );


    // Create Admin
    const admin = await User.create({
        employeeId,
        fullName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "Admin",
        department,
        designation,
        joiningDate,
        mobile,
        officeLocation,
        status: "Active",
    });


    // Remove password from response
    const adminDataResponse = admin.toObject();

    delete adminDataResponse.password;


    // Create notification for the Admin
    // who performed the Add Admin action
    await createNotification({
        title: "New Administrator Added",
        message: `${admin.fullName} has been added as a new administrator.`,
        type: "success",
        userId: createdByUserId,
    });


    return adminDataResponse;
};