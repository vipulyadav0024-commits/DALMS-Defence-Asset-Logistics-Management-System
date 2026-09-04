import express from "express";
import { createEmployee,
        getAllEmployees,
        getEmployeeById,
        updateEmployee,
        deleteEmployee,
 } from"./employee.controller.js";
import { validateCreateEmployee} from "./employee.validator.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    authorizeRoles("Admin"),
    validateCreateEmployee,
    createEmployee
);
router.get(
    "/",
    authenticateUser,
    getAllEmployees
);
router.get(
    "/:id",
    authenticateUser,
    getEmployeeById
);
router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    updateEmployee
);
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    deleteEmployee
);
export default router;