import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes.js";
import assetRoutes from "./modules/assets/asset.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import maintenanceRoutes from "./modules/maintenance/maintenance.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import adminRoutes from "./modules/admins/admin.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dalms-defence-asset-logistics-manag.vercel.app",
    ],
    credentials: true,
  })
);

// middleware
app.use(express.json());

// routes
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;