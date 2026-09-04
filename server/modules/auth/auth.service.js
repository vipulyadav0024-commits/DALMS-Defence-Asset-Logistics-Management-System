import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";


export const registerAdmin = async (userData) => {
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
  } = userData;

  // Check if the email is already registered
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error("A user with this email already exists.");
  }

  // Check if the employee ID is already registered
  const existingEmployee = await User.findOne({ employeeId });

  if (existingEmployee) {
    throw new Error("A user with this employee ID already exists.");
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new Admin user
  const newAdmin = await User.create({
    employeeId,
    fullName,
    email,
    password: hashedPassword,
    role: "Admin",
    department,
    designation,
    joiningDate,
    mobile,
    officeLocation,
  });

  // Convert Mongoose document to a plain object
  const adminData = newAdmin.toObject();

  // Never send the password back in the response
  delete adminData.password;

  return adminData;
};
export const loginUser = async (email, password)=>{
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail});

    if(!user){
        throw new Error("Invalid email or password.");
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new Error("Invalid email or password.");

    }
    const token = jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
    const userData = user.toObject();
    delete userData.password;
    return {
        user: userData,
        token,
    };
};
export const seedDemoAdmin = async () => {
    try {
        const demoEmail = "demo@dalms.in";

        const existingDemo = await User.findOne({
            email: demoEmail,
        });

        if (existingDemo) {
            console.log("Demo Admin account already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("demo", 10);

        await User.create({
            employeeId: "DEMO001",
            fullName: "DALMS Demo Administrator",
            email: demoEmail,
            password: hashedPassword,
            role: "Admin",
            department: "Administration",
            designation: "Demo Administrator",
            joiningDate: new Date(),
            mobile: "9999999999",
            officeLocation: "DALMS Demo Environment",
            status: "Active",
        });

        console.log("Demo Admin account created successfully.");
    } catch (error) {
        console.error(
            "Demo Admin creation failed:",
            error.message
        );
    }
};