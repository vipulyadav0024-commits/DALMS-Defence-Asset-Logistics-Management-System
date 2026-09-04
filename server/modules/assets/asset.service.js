import Asset from "./asset.model.js";

/*
========================================
Generate Asset ID
========================================
*/

const generateAssetId = async () => {
    const currentYear = new Date().getFullYear();

    const latestAsset = await Asset.findOne({
        assetId: new RegExp(`^DALMS-AST-${currentYear}-`),
    }).sort({ createdAt: -1 });

    if (!latestAsset) {
        return `DALMS-AST-${currentYear}-000001`;
    }

    const lastNumber = parseInt(
        latestAsset.assetId.split("-").pop(),
        10
    );

    const nextNumber = (lastNumber + 1)
        .toString()
        .padStart(6, "0");

    return `DALMS-AST-${currentYear}-${nextNumber}`;
};


/*
========================================
Create Asset
========================================

Every newly created asset will ALWAYS
start as:

status     = Available
assignedTo = null
*/

export const createAsset = async (assetData) => {

    const existingAsset = await Asset.findOne({
        serialNumber: assetData.serialNumber,
    });

    if (existingAsset) {
        throw new Error(
            "An asset with this serial number already exists."
        );
    }

    const assetId = await generateAssetId();

    const newAsset = await Asset.create({
        ...assetData,

        assetId,

        // New assets are always available
        status: "Available",

        // New assets are not assigned to anyone
        assignedTo: null,
    });

    return newAsset;
};


/*
========================================
Get All Assets
========================================
*/

export const getAllAssetsService = async () => {
    const assets = await Asset.find()
        .populate(
            "assignedTo",
            "employeeId firstName lastName email department designation"
        )
        .sort({ createdAt: -1 });

    return assets;
};

/*
========================================
Get Asset By ID
========================================
*/

export const getAssetByIdService = async (id) => {

    const asset = await Asset.findById(id)
        .populate("assignedTo", "fullName email employeeId");

    if (!asset) {
        throw new Error("Asset not found.");
    }

    return asset;
};


/*
========================================
Update Asset
========================================

This prevents invalid combinations such as:

Available + assignedTo
Assigned + assignedTo null
*/

export const updateAssetService = async (
    id,
    updateData
) => {

    const asset = await Asset.findById(id);

    if (!asset) {
        throw new Error("Asset not found.");
    }


    /*
    If asset is being changed to Available,
    remove the assigned employee.
    */

    if (updateData.status === "Available") {
        updateData.assignedTo = null;
    }


    /*
    If asset is changed to Under Maintenance,
    it should not remain assigned.
    */

    if (updateData.status === "Under Maintenance") {
        updateData.assignedTo = null;
    }


    /*
    Retired and Lost assets should also
    not remain assigned.
    */

    if (
        updateData.status === "Retired" ||
        updateData.status === "Lost"
    ) {
        updateData.assignedTo = null;
    }


    /*
    If someone tries to mark an asset as
    Assigned without providing an employee,
    reject the update.
    */

    if (
        updateData.status === "Assigned" &&
        !updateData.assignedTo &&
        !asset.assignedTo
    ) {
        throw new Error(
            "An employee must be assigned before setting the asset status to Assigned."
        );
    }


    const updatedAsset = await Asset.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    ).populate(
        "assignedTo",
        "fullName email employeeId"
    );

    return updatedAsset;
};


/*
========================================
Assign Asset
========================================

Asset becomes:

status     = Assigned
assignedTo = employee/user ID
*/

export const assignAssetService = async (
    assetId,
    employeeId
) => {

    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new Error("Asset not found.");
    }


    /*
    Asset cannot be assigned if it is already
    assigned.
    */

    if (asset.status === "Assigned") {
        throw new Error(
            "This asset is already assigned."
        );
    }


    /*
    Asset cannot be assigned if it is under
    maintenance, retired or lost.
    */

    if (
        asset.status === "Under Maintenance" ||
        asset.status === "Retired" ||
        asset.status === "Lost"
    ) {
        throw new Error(
            `This asset cannot be assigned because its status is ${asset.status}.`
        );
    }


    /*
    Assign asset
    */

    asset.assignedTo = employeeId;
    asset.status = "Assigned";

    await asset.save();

    return await Asset.findById(asset._id)
        .populate(
            "assignedTo",
            "fullName email employeeId"
        );
};


/*
========================================
Return Asset
========================================

Asset becomes:

status     = Available
assignedTo = null
*/

export const returnAssetService = async (
    assetId
) => {

    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new Error("Asset not found.");
    }


    /*
    Asset must currently be assigned
    before it can be returned.
    */

    if (asset.status !== "Assigned") {
        throw new Error(
            "This asset is not currently assigned."
        );
    }


    /*
    Return asset
    */

    asset.assignedTo = null;
    asset.status = "Available";

    await asset.save();

    return asset;
};


/*
========================================
Delete Asset
========================================
*/

export const deleteAssetService = async (
    id
) => {

    const asset = await Asset.findByIdAndDelete(id);

    if (!asset) {
        throw new Error("Asset not found.");
    }

    return asset;
};