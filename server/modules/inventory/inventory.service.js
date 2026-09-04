import Inventory from "./inventory.model.js";
import Asset from "../assets/asset.model.js";

export const createInventoryService = async (inventoryData) => {
    const inventory = await Inventory.create(inventoryData);

    if (inventory.status === "Assigned") {
        await Asset.findByIdAndUpdate(
            inventory.assetId,
            {
                status: "Assigned",
                assignedTo: inventory.employeeId,
            },
            {
                new: true,
            }
        );
    }

    if (inventory.status === "Returned") {
        await Asset.findByIdAndUpdate(
            inventory.assetId,
            {
                status: "Available",
                assignedTo: null,
            },
            {
                new: true,
            }
        );
    }

    return inventory;
};

export const getAllInventoryService = async() =>{
    const inventory = await Inventory.find()
     .populate("assetId")
     .populate("employeeId");
    return inventory; 
};
export const returnInventoryService = async (id) => {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
        throw new Error("Inventory record not found.");
    }

    if (inventory.status === "Returned") {
        throw new Error("This asset has already been returned.");
    }

    inventory.status = "Returned";
    inventory.returnDate = new Date();

    await inventory.save();

    await Asset.findByIdAndUpdate(
        inventory.assetId,
        {
            status: "Available",
            assignedTo: null,
        },
        {
            new: true,
        }
    );

    return inventory;
};