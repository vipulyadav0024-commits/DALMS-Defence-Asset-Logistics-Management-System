import Asset from "../assets/asset.model.js";
import Employee from "../employees/employee.model.js";
import Inventory from "../inventory/inventory.model.js";
import Maintenance from "../maintenance/maintenance.model.js";

export const getDashboardStatsService = async () => {
    // =========================
    // BASIC COUNTS
    // =========================

    const totalAssets = await Asset.countDocuments();

    const totalEmployees =
        await Employee.countDocuments();

    const totalInventory =
        await Inventory.countDocuments();

    const totalMaintenance =
        await Maintenance.countDocuments();


    // =========================
    // ASSET STATUS COUNTS
    // =========================

    const availableAssets =
        await Asset.countDocuments({
            status: "Available",
        });

    const assignedAssets =
        await Asset.countDocuments({
            status: "Assigned",
        });

    const maintenanceAssets =
        await Asset.countDocuments({
            status: "Under Maintenance",
        });

    const retiredAssets =
        await Asset.countDocuments({
            status: "Retired",
        });

    const lostAssets =
        await Asset.countDocuments({
            status: "Lost",
        });


    // =========================
    // MAINTENANCE COUNTS
    // =========================

    const pendingMaintenance =
        await Maintenance.countDocuments({
            status: "Pending",
        });

    const completedMaintenance =
        await Maintenance.countDocuments({
            status: "Completed",
        });


    // =========================
    // RECENT MAINTENANCE
    // =========================

    const recentMaintenance =
        await Maintenance.find()
            .populate("assetId")
            .sort({ createdAt: -1 })
            .limit(5);


    // =========================
    // RECENT INVENTORY
    // =========================

    const recentInventory =
        await Inventory.find()
            .populate("assetId")
            .populate("employeeId")
            .sort({ createdAt: -1 })
            .limit(5);


    // =========================
    // RETURN DASHBOARD DATA
    // =========================

    return {
        totalAssets,
        totalEmployees,
        totalInventory,
        totalMaintenance,

        // Asset status
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        retiredAssets,
        lostAssets,

        // Maintenance status
        pendingMaintenance,
        completedMaintenance,

        // Recent records
        recentMaintenance,
        recentInventory,
    };
};