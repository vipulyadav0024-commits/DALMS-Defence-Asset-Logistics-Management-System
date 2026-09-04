import Asset from "../assets/asset.model.js";
import Employee from "../employees/employee.model.js";
import Inventory from "../inventory/inventory.model.js";
import Maintenance from "../maintenance/maintenance.model.js";

export const getReportsService = async () => {
    const [
        totalAssets,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        retiredAssets,
        lostAssets,
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalInventory,
        assignedInventory,
        returnedInventory,
        totalMaintenance,
        pendingMaintenance,
        inProgressMaintenance,
        completedMaintenance,
    ] = await Promise.all([
        Asset.countDocuments(),

        Asset.countDocuments({
            status: "Available",
        }),

        Asset.countDocuments({
            status: "Assigned",
        }),

        Asset.countDocuments({
            status: "Under Maintenance",
        }),

        Asset.countDocuments({
            status: "Retired",
        }),

        Asset.countDocuments({
            status: "Lost",
        }),

        Employee.countDocuments(),

        Employee.countDocuments({
            status: "Active",
        }),

        Employee.countDocuments({
            status: "Inactive",
        }),

        Inventory.countDocuments(),

        Inventory.countDocuments({
            status: "Assigned",
        }),

        Inventory.countDocuments({
            status: "Returned",
        }),

        Maintenance.countDocuments(),

        Maintenance.countDocuments({
            status: "Pending",
        }),

        Maintenance.countDocuments({
            status: "In Progress",
        }),

        Maintenance.countDocuments({
            status: "Completed",
        }),
    ]);

    return {
        assets: {
            total: totalAssets,
            available: availableAssets,
            assigned: assignedAssets,
            underMaintenance: maintenanceAssets,
            retired: retiredAssets,
            lost: lostAssets,
        },

        employees: {
            total: totalEmployees,
            active: activeEmployees,
            inactive: inactiveEmployees,
        },

        inventory: {
            total: totalInventory,
            assigned: assignedInventory,
            returned: returnedInventory,
        },

        maintenance: {
            total: totalMaintenance,
            pending: pendingMaintenance,
            inProgress: inProgressMaintenance,
            completed: completedMaintenance,
        },
    };
};