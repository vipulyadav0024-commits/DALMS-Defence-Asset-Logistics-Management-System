import mongoose from "mongoose";
const assetSchema = new mongoose.Schema(
    {
        assetId:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        assetName: {
            type: String,
            required: true,
            trim: true,
        },
        category:{
            type: String,
            required: true,
            trim: true,
        },
        manufacturer:{
            type: String,
            required: true,
            trim: true,
        },
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        purchaseDate: {
            type: Date,
            required: true,
        },
        purchaseCost: {
            type: Number,
            required: true,
        },
        warrantyExpiry: {
            type: Date,
        },
        department:{
            type: String,
            required: true,
            trim: true,
        },
        assignedTo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
        status:{
            type: String,
            enum: [
                "Available",
                "Assigned",
                "Under Maintenance",
                "Retired",
                "Lost",
            ],
            default: "Available",
        },
        building: {
            type: String,
            trim: true,
        },
        floor:{
            type: String,
            trim : true,
        },
        description: {
            type: String,
            trim: true,
        },
        qrCode:{
            type: String,
            default: "",
        },
        assetImage:{
            type: String,
            default: "",

        },
    }, 
        {
            timestamps: true,
        }    

        
        
    
);
const Asset = mongoose.model("Asset",assetSchema);
export default Asset;