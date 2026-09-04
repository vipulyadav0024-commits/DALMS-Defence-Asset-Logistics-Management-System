import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import{ createAsset,
       getAllAssets,
       getAssetById,
       updateAsset,
       deleteAsset
 } from "./asset.controller.js";
import { validateCreateAsset } from "./asset.validator.js";
const router = express.Router();

router.post(
    "/",
    authenticateUser,
    authorizeRoles("Admin"),
    validateCreateAsset,
     createAsset
    );
router.get(
    "/",
    authenticateUser,
    getAllAssets
);
router.get(
    "/:id",
    authenticateUser,
    getAssetById
);
router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    updateAsset
);
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("Admin"),
    deleteAsset
);
export default router;

