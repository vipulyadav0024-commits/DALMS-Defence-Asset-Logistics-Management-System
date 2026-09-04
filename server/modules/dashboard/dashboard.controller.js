import { getDashboardStatsService } from "./dashboard.service.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await getDashboardStatsService();

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully.",
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};