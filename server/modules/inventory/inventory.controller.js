import {
     createInventoryService,
     getAllInventoryService,
     returnInventoryService,
    } from "./inventory.service.js";

export const createInventory = async(req,res,next) =>{
    try{
        const inventory = await createInventoryService(req.body);

        return res.status(201).json({
            success: true,
            message: "Inventory created successfully.",
            data: inventory,
        });
    }catch(error){
        next(error);
    }
};

// import { createInventoryService, getAllInventoryService } from "./inventory.service.js";

export const getAllInventory = async (req, res, next) => {
    try {
        const inventory = await getAllInventoryService();

        return res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};
export const returnInventory = async (req, res, next) => {
    try {
        const inventory = await returnInventoryService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Asset returned successfully.",
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};