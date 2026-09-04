import { useEffect, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    // =========================
    // FETCH REPORTS
    // =========================

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReports(response.data.data);
        } catch (error) {
            console.error("Reports fetch error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // =========================
    // SEARCH
    // =========================

    const normalizedSearch = searchTerm
        .trim()
        .toLowerCase();

    const showAssets =
        !normalizedSearch ||
        "assets".includes(normalizedSearch) ||
        "asset".includes(normalizedSearch);

    const showEmployees =
        !normalizedSearch ||
        "employees".includes(normalizedSearch) ||
        "employee".includes(normalizedSearch);

    const showInventory =
        !normalizedSearch ||
        "inventory".includes(normalizedSearch);

    const showMaintenance =
        !normalizedSearch ||
        "maintenance".includes(normalizedSearch);

    // =========================
    // EXPORT EXCEL / CSV
    // =========================

    const handleExportExcel = () => {
        if (!reports) {
            alert("Report data is not available.");
            return;
        }

        const rows = [
            [
                "DALMS - Reports & Analytics",
                "",
            ],
            [
                "Generated On",
                new Date().toLocaleString("en-IN"),
            ],
            [],
            [
                "Category",
                "Metric",
                "Value",
            ],

            // Assets
            [
                "Assets",
                "Total Assets",
                reports.assets.total,
            ],
            [
                "Assets",
                "Available",
                reports.assets.available,
            ],
            [
                "Assets",
                "Assigned",
                reports.assets.assigned,
            ],
            [
                "Assets",
                "Under Maintenance",
                reports.assets.underMaintenance,
            ],
            [
                "Assets",
                "Retired",
                reports.assets.retired,
            ],
            [
                "Assets",
                "Lost",
                reports.assets.lost,
            ],

            // Employees
            [
                "Employees",
                "Total Employees",
                reports.employees.total,
            ],
            [
                "Employees",
                "Active",
                reports.employees.active,
            ],
            [
                "Employees",
                "Inactive",
                reports.employees.inactive,
            ],

            // Inventory
            [
                "Inventory",
                "Total Assignments",
                reports.inventory.total,
            ],
            [
                "Inventory",
                "Currently Assigned",
                reports.inventory.assigned,
            ],
            [
                "Inventory",
                "Returned",
                reports.inventory.returned,
            ],

            // Maintenance
            [
                "Maintenance",
                "Total Maintenance",
                reports.maintenance.total,
            ],
            [
                "Maintenance",
                "Pending",
                reports.maintenance.pending,
            ],
            [
                "Maintenance",
                "In Progress",
                reports.maintenance.inProgress,
            ],
            [
                "Maintenance",
                "Completed",
                reports.maintenance.completed,
            ],
        ];

        const csvContent = rows
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(
                            value ?? ""
                        ).replace(/"/g, '""');

                        return `"${text}"`;
                    })
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            ["\ufeff" + csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "DALMS_Reports.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================
    // EXPORT PDF
    // =========================

    const handleExportPDF = () => {
        if (!reports) {
            alert("Report data is not available.");
            return;
        }

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // =========================
        // HEADER
        // =========================

        doc.setFontSize(20);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "DALMS - Reports & Analytics",
            14,
            18
        );

        doc.setFontSize(10);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            `Generated on: ${new Date().toLocaleString(
                "en-IN"
            )}`,
            14,
            25
        );

        // =========================
        // ASSET TABLE
        // =========================

        autoTable(doc, {
            startY: 34,

            head: [
                [
                    "Asset Metric",
                    "Value",
                ],
            ],

            body: [
                [
                    "Total Assets",
                    reports.assets.total,
                ],
                [
                    "Available",
                    reports.assets.available,
                ],
                [
                    "Assigned",
                    reports.assets.assigned,
                ],
                [
                    "Under Maintenance",
                    reports.assets.underMaintenance,
                ],
                [
                    "Retired",
                    reports.assets.retired,
                ],
                [
                    "Lost",
                    reports.assets.lost,
                ],
            ],

            theme: "grid",

            headStyles: {
                fontStyle: "bold",
            },

            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
        });

        // =========================
        // EMPLOYEE TABLE
        // =========================

        let nextY =
            doc.lastAutoTable.finalY + 10;

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Employee Summary",
            14,
            nextY
        );

        autoTable(doc, {
            startY: nextY + 4,

            head: [
                [
                    "Employee Metric",
                    "Value",
                ],
            ],

            body: [
                [
                    "Total Employees",
                    reports.employees.total,
                ],
                [
                    "Active",
                    reports.employees.active,
                ],
                [
                    "Inactive",
                    reports.employees.inactive,
                ],
            ],

            theme: "grid",

            headStyles: {
                fontStyle: "bold",
            },

            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
        });

        // =========================
        // INVENTORY TABLE
        // =========================

        nextY =
            doc.lastAutoTable.finalY + 10;

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Inventory Summary",
            14,
            nextY
        );

        autoTable(doc, {
            startY: nextY + 4,

            head: [
                [
                    "Inventory Metric",
                    "Value",
                ],
            ],

            body: [
                [
                    "Total Assignments",
                    reports.inventory.total,
                ],
                [
                    "Currently Assigned",
                    reports.inventory.assigned,
                ],
                [
                    "Returned",
                    reports.inventory.returned,
                ],
            ],

            theme: "grid",

            headStyles: {
                fontStyle: "bold",
            },

            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
        });

        // =========================
        // MAINTENANCE TABLE
        // =========================

        nextY =
            doc.lastAutoTable.finalY + 10;

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Maintenance Summary",
            14,
            nextY
        );

        autoTable(doc, {
            startY: nextY + 4,

            head: [
                [
                    "Maintenance Metric",
                    "Value",
                ],
            ],

            body: [
                [
                    "Total Maintenance",
                    reports.maintenance.total,
                ],
                [
                    "Pending",
                    reports.maintenance.pending,
                ],
                [
                    "In Progress",
                    reports.maintenance.inProgress,
                ],
                [
                    "Completed",
                    reports.maintenance.completed,
                ],
            ],

            theme: "grid",

            headStyles: {
                fontStyle: "bold",
            },

            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
        });

        // =========================
        // FOOTER
        // =========================

        const pageCount =
            doc.internal.getNumberOfPages();

        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {
            doc.setPage(page);

            doc.setFontSize(8);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `DALMS | Reports & Analytics | Page ${page} of ${pageCount}`,
                14,
                287
            );
        }

        // =========================
        // DOWNLOAD
        // =========================

        doc.save(
            "DALMS_Reports_Analytics.pdf"
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Loading reports...</p>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="dashboard-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>
                    <h2>
                        Reports & Analytics
                    </h2>

                    <p>
                        Overview of assets,
                        employees, inventory
                        and maintenance.
                    </p>
                </div>

                <div className="page-header-actions">

                    {/* EXPORT EXCEL */}

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportExcel
                        }
                    >
                        📊 Export Excel
                    </button>

                    {/* EXPORT PDF */}

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportPDF
                        }
                    >
                        📄 Export PDF
                    </button>

                </div>

            </div>

            {/* =========================
                SEARCH
            ========================= */}

            <div className="table-card">

                <div
                    className="search-container"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >

                    <span
                        style={{
                            fontSize: "18px",
                        }}
                    >
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        style={{
                            flex: 1,
                        }}
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                setSearchTerm("")
                            }
                        >
                            Clear
                        </button>
                    )}

                </div>

            </div>

            {/* =========================
                ASSETS
            ========================= */}

            {showAssets && (
                <>
                    <div className="report-section">

                        <h3>
                            Asset Summary
                        </h3>

                        <div className="report-grid">

                            <div className="report-card">
                                <span>
                                    Total Assets
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .total
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Available
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .available
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Assigned
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .assigned
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Under Maintenance
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .underMaintenance
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Retired
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .retired
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Lost
                                </span>

                                <strong>
                                    {
                                        reports
                                            .assets
                                            .lost
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="report-section">

                        <h3>
                            Asset Analytics
                        </h3>

                        <div className="analytics-list">

                            <div className="analytics-row">

                                <div className="analytics-label">
                                    <span>
                                        Available
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .assets
                                                .available
                                        }
                                    </strong>
                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill available-fill"
                                        style={{
                                            width: `${
                                                reports.assets.total
                                                    ? (reports.assets.available /
                                                          reports.assets.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">
                                    <span>
                                        Assigned
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .assets
                                                .assigned
                                        }
                                    </strong>
                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill assigned-fill"
                                        style={{
                                            width: `${
                                                reports.assets.total
                                                    ? (reports.assets.assigned /
                                                          reports.assets.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">
                                    <span>
                                        Under Maintenance
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .assets
                                                .underMaintenance
                                        }
                                    </strong>
                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill maintenance-fill"
                                        style={{
                                            width: `${
                                                reports.assets.total
                                                    ? (reports.assets.underMaintenance /
                                                          reports.assets.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">
                                    <span>
                                        Retired
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .assets
                                                .retired
                                        }
                                    </strong>
                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill retired-fill"
                                        style={{
                                            width: `${
                                                reports.assets.total
                                                    ? (reports.assets.retired /
                                                          reports.assets.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">
                                    <span>
                                        Lost
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .assets
                                                .lost
                                        }
                                    </strong>
                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill lost-fill"
                                        style={{
                                            width: `${
                                                reports.assets.total
                                                    ? (reports.assets.lost /
                                                          reports.assets.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

            {/* =========================
                EMPLOYEES
            ========================= */}

            {showEmployees && (
                <>
                    <div className="report-section">

                        <h3>
                            Employee Summary
                        </h3>

                        <div className="report-grid">

                            <div className="report-card">
                                <span>
                                    Total Employees
                                </span>

                                <strong>
                                    {
                                        reports
                                            .employees
                                            .total
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Active
                                </span>

                                <strong>
                                    {
                                        reports
                                            .employees
                                            .active
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Inactive
                                </span>

                                <strong>
                                    {
                                        reports
                                            .employees
                                            .inactive
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="report-section">

                        <h3>
                            Employee Analytics
                        </h3>

                        <div className="analytics-list">

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Active
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .employees
                                                .active
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill active-fill"
                                        style={{
                                            width: `${
                                                reports.employees.total
                                                    ? (reports.employees.active /
                                                          reports.employees.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Inactive
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .employees
                                                .inactive
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill inactive-fill"
                                        style={{
                                            width: `${
                                                reports.employees.total
                                                    ? (reports.employees.inactive /
                                                          reports.employees.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

            {/* =========================
                INVENTORY
            ========================= */}

            {showInventory && (
                <>
                    <div className="report-section">

                        <h3>
                            Inventory Summary
                        </h3>

                        <div className="report-grid">

                            <div className="report-card">
                                <span>
                                    Total Assignments
                                </span>

                                <strong>
                                    {
                                        reports
                                            .inventory
                                            .total
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Currently Assigned
                                </span>

                                <strong>
                                    {
                                        reports
                                            .inventory
                                            .assigned
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Returned
                                </span>

                                <strong>
                                    {
                                        reports
                                            .inventory
                                            .returned
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="report-section">

                        <h3>
                            Inventory Analytics
                        </h3>

                        <div className="analytics-list">

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Currently Assigned
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .inventory
                                                .assigned
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill assigned-fill"
                                        style={{
                                            width: `${
                                                reports.inventory.total
                                                    ? (reports.inventory.assigned /
                                                          reports.inventory.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Returned
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .inventory
                                                .returned
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill returned-fill"
                                        style={{
                                            width: `${
                                                reports.inventory.total
                                                    ? (reports.inventory.returned /
                                                          reports.inventory.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

            {/* =========================
                MAINTENANCE
            ========================= */}

            {showMaintenance && (
                <>
                    <div className="report-section">

                        <h3>
                            Maintenance Summary
                        </h3>

                        <div className="report-grid">

                            <div className="report-card">
                                <span>
                                    Total Maintenance
                                </span>

                                <strong>
                                    {
                                        reports
                                            .maintenance
                                            .total
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {
                                        reports
                                            .maintenance
                                            .pending
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    In Progress
                                </span>

                                <strong>
                                    {
                                        reports
                                            .maintenance
                                            .inProgress
                                    }
                                </strong>
                            </div>

                            <div className="report-card">
                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {
                                        reports
                                            .maintenance
                                            .completed
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="report-section">

                        <h3>
                            Maintenance Analytics
                        </h3>

                        <div className="analytics-list">

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Pending
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .maintenance
                                                .pending
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill pending-fill"
                                        style={{
                                            width: `${
                                                reports.maintenance.total
                                                    ? (reports.maintenance.pending /
                                                          reports.maintenance.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        In Progress
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .maintenance
                                                .inProgress
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill progress-fill"
                                        style={{
                                            width: `${
                                                reports.maintenance.total
                                                    ? (reports.maintenance.inProgress /
                                                          reports.maintenance.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="analytics-row">

                                <div className="analytics-label">

                                    <span>
                                        Completed
                                    </span>

                                    <strong>
                                        {
                                            reports
                                                .maintenance
                                                .completed
                                        }
                                    </strong>

                                </div>

                                <div className="analytics-bar">

                                    <div
                                        className="analytics-fill completed-fill"
                                        style={{
                                            width: `${
                                                reports.maintenance.total
                                                    ? (reports.maintenance.completed /
                                                          reports.maintenance.total) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

            {/* =========================
                NO SEARCH RESULTS
            ========================= */}

            {!showAssets &&
                !showEmployees &&
                !showInventory &&
                !showMaintenance && (
                    <div className="empty-state">

                        <h3>
                            No Reports Found
                        </h3>

                        <p>
                            No report section matches
                            "{searchTerm}".
                        </p>

                    </div>
                )}

        </div>
    );
};

export default Reports;      