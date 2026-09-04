import { 
    createMaintenanceService,
    getAllMaintenanceService,
    getMaintenanceByIdService,
    updateMaintenanceService,
    deleteMaintenanceService,
 } from "./maintenance.service.js";



export const createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await createMaintenanceService(req.body);

    return res.status(201).json({
      success: true,
      message: "Maintenance record created successfully.",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMaintenance = async (req, res, next) => {
  try {
    const maintenanceRecords = await getAllMaintenanceService();

    return res.status(200).json({
      success: true,
      message: "Maintenance records fetched successfully.",
      data: maintenanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceById = async(req,res,next) =>{
    try{
        const maintenance = await getMaintenanceByIdService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Maintenance record fetched successfully.",
            data:maintenance,
        });

    }catch(error){
        next(error);
    }
};

export const updateMaintenance = async (req,res,next) =>{
    try{
        const maintenance = await updateMaintenanceService(
            req.params.id,
            req.body
        );
        return res.status(200).json({
            success:true,
            message: "Maintenance record updated successfully.",
            data: maintenance,
        });

    }catch(error){
        next(error);
    }
};
export const deleteMaintenance = async(req,res,next) =>{
    try{
        await deleteMaintenanceService(req.params.id);
        return res.status(200).json({
            success:true,
            message:"Maintenance record deleted successfully.",

        });

    }catch(error){
        next(error);
    }
};