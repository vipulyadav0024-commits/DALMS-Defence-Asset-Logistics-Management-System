export const validateCreateAsset = (req,res,next)=>{
    const{
        assetName,
        category,
        manufacturer,
        serialNumber,
        purchaseDate,
        purchaseCost,
        department,
    } = req.body;

    if(
        !assetName ||
        !category ||
        !manufacturer ||
        !serialNumber ||
        !purchaseDate ||
        purchaseCost === undefined ||
        !department
        
    ){
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields.",
        });
    }
    if (purchaseCost < 0){
        return res.status(400).json({
            success: false,
            message: "Purchase cost cannot be negative.",
        });
    }  
    next();
};