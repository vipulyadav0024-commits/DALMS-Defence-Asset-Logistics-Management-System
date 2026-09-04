import Employee from "./employee.model.js";

export const createEmployeeService = async(employeeData) =>{
    const existingEmployee = await Employee.findOne({
        $or: [
            {employeeId: employeeData.employeeId},
            {email:employeeData.email}
        ]
    });
    if (existingEmployee){
        throw new Error("Employee already exists.");

    }
    const employee = await Employee.create(employeeData);
    return employee;
};
export const getAllEmployeesService = async () =>{
    const employees = await Employee.find().sort({ createdAt: -1});
    return employees;
};
export const getEmployeeByIdService = async(id) =>{
    const employee = await Employee.findById(id);
    if(!employee){
        throw new Error("Employee not found."); 
    }
    return employee;
}
export const updateEmployeeService= async(id, employeeData) =>{
    const employee = await Employee.findByIdAndUpdate(
        id,
        employeeData,
        {
            new: true,
            runValidators:true,
        }
    );
    if(!employee){
        throw new Error("Employee not Found.");
    }
    return employee;
};
export const deleteEmployeeService =async(id) => {
    const employee = await Employee.findByIdAndDelete(id);
    if(!employee){
        throw new Error("Employee not found.");

    }
    return employee;
};
