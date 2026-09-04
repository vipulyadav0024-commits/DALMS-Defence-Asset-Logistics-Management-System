import { 
    createAsset as createAssetService,
    getAllAssetsService,
    getAssetByIdService,
    updateAssetService,
    deleteAssetService
    } from"./asset.service.js";
    export const createAsset = async (req, res) => {
    console.log("ASSET REQUEST BODY:", req.body);

    try {
        const asset = await createAssetService(req.body);

        console.log("ASSET CREATED:", asset);

        res.status(201).json({
            success: true,
            message: "Asset created successfully.",
            data: asset,
        });
    } catch (error) {
        console.error("Create Asset Error:", error.message);

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const getAllAssets = async (req, res) =>{
    try{
        const assets = await getAllAssetsService();
        res.status(200).json({
            success: true,
            count: assets.length,
            data: assets,
        });

    }catch(error){
        console.error("Get Assets Error:",error.message);
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};
export const getAssetById = async (req, res) =>{
    try{
        const{id} = req.params;
        const assets = await getAssetByIdService(id);
        res.status(200).json({
            success: true,
        
            data: assets,
        });

    }catch(error){
        console.error("Get Asset By Id Error:",error.message);
        res.status(404).json({
            success:false,
            message: error.message,
        });
    }
};
export const updateAsset = async(req,res) =>{
    try{
        const { id } = req.params;
        const updatedAsset = await updateAssetService(id, req.body);
        res.status(200).json({
            success:true,
            message: "Asset updated successfully.",
            data: updatedAsset,
        });

    }catch(error){
        console.error("Update Asset Error:", error.message);
        res.status(404).json({
            success:false,
            message: error.message
        });
    }
};
export const deleteAsset = async (req,res) =>{
    try{
        const{id} = req.params;
        await deleteAssetService(id);
        res.status(200).json({
            success: true,
            message: "Asset deleted successfully."
        });

    }catch (error){
        console.error("Delete Asset Error:", error.message);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


