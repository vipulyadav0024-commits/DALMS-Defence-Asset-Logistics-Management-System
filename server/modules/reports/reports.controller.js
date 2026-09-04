import { getReportsService } from "./reports.service.js";

export const getReports = async (req, res, next) => {
    try {
        const reports = await getReportsService();

        return res.status(200).json({
            success: true,
            message: "Reports fetched successfully.",
            data: reports,
        });
    } catch (error) {
        console.error("Get Reports Error:", error.message);
        next(error);
    }
};