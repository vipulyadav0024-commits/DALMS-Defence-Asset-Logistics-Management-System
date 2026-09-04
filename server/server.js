
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";
import { seedDemoAdmin } from "./modules/auth/auth.service.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Create demo Admin if it doesn't already exist
        await seedDemoAdmin();

        // Start server
        app.listen(PORT, () => {
            console.log(
                `server is running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();

