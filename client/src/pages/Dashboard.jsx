import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
    Laptop,
    Users,
    Package,
    Wrench,
    CheckCircle,
    Clock,
    Activity,
    AlertTriangle,
    Plus,
    UserPlus,
    PackagePlus,
    ShieldCheck,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const isAdmin = user?.role === "Admin";

    // =========================================
    // ASSET CHART DATA
    // =========================================

    const assetChartData = stats
        ? [
              {
                  name: "Available",
                  value: stats.availableAssets || 0,
              },
              {
                  name: "Assigned",
                  value: stats.assignedAssets || 0,
              },
              {
                  name: "Under Maintenance",
                  value: stats.maintenanceAssets || 0,
              },
              {
                  name: "Retired",
                  value: stats.retiredAssets || 0,
              },
              {
                  name: "Lost",
                  value: stats.lostAssets || 0,
              },
          ]
        : [];

    const assetChartColors = {
        Available: "#22c55e",
        Assigned: "#3b82f6",
        "Under Maintenance": "#f59e0b",
        Retired: "#6b7280",
        Lost: "#ef4444",
    };

    // =========================================
    // MAINTENANCE CHART DATA
    // =========================================

    const maintenanceChartData = stats
        ? [
              {
                  name: "Pending",
                  value: stats.pendingMaintenance || 0,
              },
              {
                  name: "Completed",
                  value: stats.completedMaintenance || 0,
              },
          ]
        : [];

    const maintenanceChartColors = {
        Pending: "#f59e0b",
        Completed: "#22c55e",
    };

    // =========================================
    // FETCH DASHBOARD STATISTICS
    // =========================================

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStats(response.data.data);
        } catch (error) {
            console.error(
                "Dashboard stats error:",
                error
            );

            setError(
                "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Activity size={24} />

                <p>
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <div className="dashboard-error">
                <AlertTriangle size={24} />

                <p>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="dashboard-page-header">

                <div>
                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Overview of your assets,
                        employees, inventory and
                        maintenance activities.
                    </p>
                </div>

                <div className="dashboard-live-status">
                    <span></span>
                    System Operational
                </div>

            </div>


            {stats && (
                <>

                    {/* =================================
                        MAIN STATISTICS
                    ================================== */}

                    <div className="stats-grid">

                        {/* Total Assets */}

                        <Link
                            to="/assets"
                            className="stat-card"
                        >

                            <div className="stat-card-top">

                                <div>
                                    <span>
                                        Total Assets
                                    </span>

                                    <h3>
                                        {stats.totalAssets}
                                    </h3>
                                </div>

                                <div className="stat-icon">
                                    <Laptop size={22} />
                                </div>

                            </div>

                            <p className="stat-description">
                                Assets registered
                                in DALMS
                            </p>

                        </Link>


                        {/* Total Employees */}

                        <Link
                            to="/employees"
                            className="stat-card"
                        >

                            <div className="stat-card-top">

                                <div>
                                    <span>
                                        Total Employees
                                    </span>

                                    <h3>
                                        {stats.totalEmployees}
                                    </h3>
                                </div>

                                <div className="stat-icon">
                                    <Users size={22} />
                                </div>

                            </div>

                            <p className="stat-description">
                                Registered personnel
                            </p>

                        </Link>


                        {/* Total Inventory */}

                        <Link
                            to="/inventory"
                            className="stat-card"
                        >

                            <div className="stat-card-top">

                                <div>
                                    <span>
                                        Total Inventory
                                    </span>

                                    <h3>
                                        {stats.totalInventory}
                                    </h3>
                                </div>

                                <div className="stat-icon">
                                    <Package size={22} />
                                </div>

                            </div>

                            <p className="stat-description">
                                Inventory records
                            </p>

                        </Link>


                        {/* Total Maintenance */}

                        <Link
                            to="/maintenance"
                            className="stat-card"
                        >

                            <div className="stat-card-top">

                                <div>
                                    <span>
                                        Maintenance
                                    </span>

                                    <h3>
                                        {stats.totalMaintenance}
                                    </h3>
                                </div>

                                <div className="stat-icon">
                                    <Wrench size={22} />
                                </div>

                            </div>

                            <p className="stat-description">
                                Total maintenance
                                records
                            </p>

                        </Link>

                    </div>


                    {/* =================================
                        ASSET & MAINTENANCE OVERVIEW
                    ================================== */}

                    <div className="dashboard-overview-grid">

                        {/* Asset Overview */}

                        <div className="dashboard-panel">

                            <div className="dashboard-panel-header">

                                <div>
                                    <h3>
                                        Asset Overview
                                    </h3>

                                    <p>
                                        Current asset
                                        availability
                                    </p>
                                </div>

                                {/* CLICKABLE ASSET ICON */}

                                <Link
                                    to="/assets"
                                    title="Open Assets"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Laptop size={22} />
                                </Link>

                            </div>


                            <div className="overview-stat-grid">

                                {/* Assigned Assets */}

                                <Link
                                    to="/assets"
                                    className="overview-stat"
                                >

                                    <div className="overview-stat-icon assigned">
                                        <Laptop size={18} />
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                stats.assignedAssets
                                            }
                                        </strong>

                                        <span>
                                            Assigned Assets
                                        </span>
                                    </div>

                                </Link>


                                {/* Available Assets */}

                                <Link
                                    to="/assets"
                                    className="overview-stat"
                                >

                                    <div className="overview-stat-icon available">
                                        <CheckCircle
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                stats.availableAssets
                                            }
                                        </strong>

                                        <span>
                                            Available Assets
                                        </span>
                                    </div>

                                </Link>

                            </div>

                        </div>


                        {/* Maintenance Overview */}

                        <div className="dashboard-panel">

                            <div className="dashboard-panel-header">

                                <div>
                                    <h3>
                                        Maintenance Overview
                                    </h3>

                                    <p>
                                        Current maintenance
                                        status
                                    </p>
                                </div>

                                {/* CLICKABLE MAINTENANCE ICON */}

                                <Link
                                    to="/maintenance"
                                    title="Open Maintenance"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Wrench size={22} />
                                </Link>

                            </div>


                            <div className="overview-stat-grid">

                                {/* Pending */}

                                <Link
                                    to="/maintenance"
                                    className="overview-stat"
                                >

                                    <div className="overview-stat-icon pending">
                                        <Clock size={18} />
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                stats.pendingMaintenance
                                            }
                                        </strong>

                                        <span>
                                            Pending
                                        </span>
                                    </div>

                                </Link>


                                {/* Completed */}

                                <Link
                                    to="/maintenance"
                                    className="overview-stat"
                                >

                                    <div className="overview-stat-icon completed">
                                        <CheckCircle
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                stats.completedMaintenance
                                            }
                                        </strong>

                                        <span>
                                            Completed
                                        </span>
                                    </div>

                                </Link>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        QUICK ACTIONS
                    ================================== */}

                    <div className="quick-actions-section">

                        <div className="quick-actions-header">

                            <div>
                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Quickly access common
                                    DALMS operations.
                                </p>
                            </div>

                            <Plus size={20} />

                        </div>


                        <div className="quick-actions-grid">

                            {/* Add Asset */}

                            <Link
                                to="/assets"
                                className="quick-action-card"
                            >

                                <div className="quick-action-icon">
                                    <Laptop size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Add Asset
                                    </strong>

                                    <span>
                                        Register a new asset
                                    </span>
                                </div>

                            </Link>


                            {/* Add Employee */}

                            <Link
                                to="/employees"
                                className="quick-action-card"
                            >

                                <div className="quick-action-icon">
                                    <UserPlus size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Add Employee
                                    </strong>

                                    <span>
                                        Register an employee
                                    </span>
                                </div>

                            </Link>


                            {/* Add Inventory */}

                            <Link
                                to="/inventory"
                                className="quick-action-card"
                            >

                                <div className="quick-action-icon">
                                    <PackagePlus size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Add Inventory
                                    </strong>

                                    <span>
                                        Add inventory items
                                    </span>
                                </div>

                            </Link>


                            {/* Maintenance */}

                            <Link
                                to="/maintenance"
                                className="quick-action-card"
                            >

                                <div className="quick-action-icon">
                                    <Wrench size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Maintenance
                                    </strong>

                                    <span>
                                        Manage maintenance
                                    </span>
                                </div>

                            </Link>


                            {/* Admin Management */}

                            {isAdmin && (
                                <Link
                                    to="/admin-management"
                                    className="quick-action-card"
                                >

                                    <div className="quick-action-icon">
                                        <ShieldCheck
                                            size={21}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            Admin Management
                                        </strong>

                                        <span>
                                            Manage administrators
                                        </span>
                                    </div>

                                </Link>
                            )}

                        </div>

                    </div>


                    {/* =================================
                        ANALYTICS CHARTS
                    ================================== */}

                    <div className="dashboard-charts-grid">

                        {/* Asset Status Chart */}

                        <div className="dashboard-chart-panel">

                            <div className="dashboard-chart-header">

                                <div>
                                    <h3>
                                        Asset Status
                                    </h3>

                                    <p>
                                        Current asset
                                        distribution
                                    </p>
                                </div>

                                {/* CLICKABLE ASSET ICON */}

                                <Link
                                    to="/assets"
                                    title="Open Assets"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Laptop size={20} />
                                </Link>

                            </div>


                            <div className="dashboard-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={260}
                                >

                                    <PieChart>

                                        <Pie
                                            data={assetChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            innerRadius={50}
                                            paddingAngle={3}
                                            label
                                        >

                                            {assetChartData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={`asset-cell-${index}`}
                                                        fill={
                                                            assetChartColors[
                                                                entry.name
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        {/* Maintenance Status Chart */}

                        <div className="dashboard-chart-panel">

                            <div className="dashboard-chart-header">

                                <div>
                                    <h3>
                                        Maintenance Status
                                    </h3>

                                    <p>
                                        Current maintenance
                                        distribution
                                    </p>
                                </div>

                                {/* CLICKABLE MAINTENANCE ICON */}

                                <Link
                                    to="/maintenance"
                                    title="Open Maintenance"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Wrench size={20} />
                                </Link>

                            </div>


                            <div className="dashboard-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={260}
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                maintenanceChartData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={85}
                                            innerRadius={50}
                                            paddingAngle={3}
                                            label
                                        >

                                            {maintenanceChartData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={`maintenance-cell-${index}`}
                                                        fill={
                                                            maintenanceChartColors[
                                                                entry.name
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        RECENT ACTIVITY
                    ================================== */}

                    <div className="dashboard-section-grid">

                        {/* Recent Maintenance */}

                        <div className="recent-section">

                            <div className="recent-section-header">

                                <div>
                                    <h2>
                                        Recent Maintenance
                                    </h2>

                                    <p>
                                        Latest maintenance
                                        activities
                                    </p>
                                </div>

                                {/* CLICKABLE MAINTENANCE ICON */}

                                <Link
                                    to="/maintenance"
                                    title="Open Maintenance"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Wrench size={20} />
                                </Link>

                            </div>


                            {stats.recentMaintenance &&
                            stats.recentMaintenance.length >
                                0 ? (

                                <div className="recent-list">

                                    {stats.recentMaintenance.map(
                                        (
                                            maintenance
                                        ) => (

                                            <div
                                                className="recent-item"
                                                key={
                                                    maintenance._id
                                                }
                                            >

                                                <div className="recent-item-main">

                                                    <strong>
                                                        {
                                                            maintenance.maintenanceType ||
                                                            "Maintenance"
                                                        }
                                                    </strong>

                                                    <p>
                                                        {
                                                            maintenance.description ||
                                                            "No description"
                                                        }
                                                    </p>

                                                </div>


                                                <span
                                                    className={`status-badge ${
                                                        maintenance.status ===
                                                        "Completed"
                                                            ? "status-completed"
                                                            : maintenance.status ===
                                                              "In Progress"
                                                            ? "status-progress"
                                                            : "status-pending"
                                                    }`}
                                                >
                                                    {
                                                        maintenance.status ||
                                                        "Pending"
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="empty-state">

                                    <Wrench
                                        size={28}
                                    />

                                    <p>
                                        No recent
                                        maintenance
                                        records.
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* Recent Inventory */}

                        <div className="recent-section">

                            <div className="recent-section-header">

                                <div>
                                    <h2>
                                        Recent Inventory
                                    </h2>

                                    <p>
                                        Latest inventory
                                        updates
                                    </p>
                                </div>

                                {/* CLICKABLE INVENTORY ICON */}

                                <Link
                                    to="/inventory"
                                    title="Open Inventory"
                                    style={{
                                        color: "inherit",
                                        textDecoration:
                                            "none",
                                        cursor: "pointer",
                                        display: "flex",
                                    }}
                                >
                                    <Package size={20} />
                                </Link>

                            </div>


                            {stats.recentInventory &&
                            stats.recentInventory.length >
                                0 ? (

                                <div className="recent-list">

                                    {stats.recentInventory.map(
                                        (
                                            inventory
                                        ) => (

                                            <div
                                                className="recent-item"
                                                key={
                                                    inventory._id
                                                }
                                            >

                                                <div className="recent-item-main">

                                                    <strong>
                                                        {
                                                            inventory.itemName ||
                                                            "Inventory Item"
                                                        }
                                                    </strong>

                                                    <p>
                                                        Quantity:{" "}
                                                        {
                                                            inventory.quantity ??
                                                            0
                                                        }
                                                    </p>

                                                </div>


                                                <span className="status-badge">
                                                    {
                                                        inventory.status ||
                                                        "Available"
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="empty-state">

                                    <Package
                                        size={28}
                                    />

                                    <p>
                                        No recent
                                        inventory
                                        records.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </>

            )}

        </div>
    );
};

export default Dashboard;