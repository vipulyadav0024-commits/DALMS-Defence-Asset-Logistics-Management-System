import Maintenance from "./maintenance.model.js";


export const createMaintenanceService = async (maintenanceData) =>{
    const maintenance = await Maintenance.create(maintenanceData);
    return maintenance;
};
export const getAllMaintenanceService = async() =>{
    const maintenanceRecords = await Maintenance.find()
      .populate("assetId")
      .sort({ createdAt: -1 });
    return maintenanceRecords;  
    
};
export const getMaintenanceByIdService = async(id) =>{
    const maintenace = await Maintenance.findById(id)
     .populate("assetId");
    if(!maintenace){
        throw new Error("Maintenance record not found.");

    } 
    return maintenace;

};

export const updateMaintenanceService = async (id, maintenanceData) => {
  const maintenance = await Maintenance.findByIdAndUpdate(
    id,
    maintenanceData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!maintenance) {
    throw new Error("Maintenance record not found.");
  }

  return maintenance;
};

export const deleteMaintenanceService = async (id) => {
  const maintenance = await Maintenance.findByIdAndDelete(id);

  if (!maintenance) {
    throw new Error("Maintenance record not found.");
  }

  return maintenance;
};