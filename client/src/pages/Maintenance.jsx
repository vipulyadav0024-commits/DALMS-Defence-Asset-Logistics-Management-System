import { useEffect, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Maintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [assets, setAssets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // =========================
    // SEARCH
    // =========================

    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        assetId: "",
        issue: "",
        description: "",
        reportedDate: "",
        status: "Pending",
        resolvedDate: "",
    });

    // =========================
    // FETCH MAINTENANCE
    // =========================

    const fetchMaintenance = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/maintenance",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMaintenanceRecords(response.data.data || []);
        } catch (error) {
            console.error("Maintenance fetch error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load maintenance records."
            );
        }
    };

    // =========================
    // FETCH ASSETS
    // =========================

    const fetchAssets = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/assets",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAssets(response.data.data || []);
        } catch (error) {
            console.error("Assets fetch error:", error);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchMaintenance(),
                fetchAssets(),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            assetId: "",
            issue: "",
            description: "",
            reportedDate: "",
            status: "Pending",
            resolvedDate: "",
        });

        setEditingId(null);
    };

    // =========================
    // CREATE MAINTENANCE
    // =========================

    const handleCreateMaintenance = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/maintenance",
                {
                    assetId: formData.assetId,
                    issue: formData.issue,
                    description: formData.description,
                    reportedDate: formData.reportedDate,
                    status: formData.status,
                    resolvedDate:
                        formData.resolvedDate || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            resetForm();
            setShowForm(false);

            await fetchMaintenance();
        } catch (error) {
            console.error(
                "Create Maintenance Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to create maintenance record."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (maintenance) => {
        setEditingId(maintenance._id);

        setFormData({
            assetId: maintenance.assetId?._id || "",
            issue: maintenance.issue || "",
            description: maintenance.description || "",

            reportedDate: maintenance.reportedDate
                ? maintenance.reportedDate.split("T")[0]
                : "",

            status: maintenance.status || "Pending",

            resolvedDate: maintenance.resolvedDate
                ? maintenance.resolvedDate.split("T")[0]
                : "",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // UPDATE
    // =========================

    const handleUpdateMaintenance = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/maintenance/${editingId}`,
                {
                    assetId: formData.assetId,
                    issue: formData.issue,
                    description: formData.description,
                    reportedDate: formData.reportedDate,
                    status: formData.status,
                    resolvedDate:
                        formData.resolvedDate || undefined,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            resetForm();
            setShowForm(false);

            await fetchMaintenance();
        } catch (error) {
            console.error(
                "Update Maintenance Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to update maintenance record."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this maintenance record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/maintenance/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchMaintenance();
        } catch (error) {
            console.error(
                "Delete Maintenance Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to delete maintenance record."
            );
        }
    };

    // =========================
    // FILTER / SEARCH
    // =========================

    const filteredMaintenance = maintenanceRecords.filter(
        (maintenance) => {
            const search = searchTerm
                .toLowerCase()
                .trim();

            if (!search) {
                return true;
            }

            const assetId =
                maintenance.assetId?.assetId || "";

            const assetName =
                maintenance.assetId?.assetName || "";

            const issue =
                maintenance.issue || "";

            const description =
                maintenance.description || "";

            const status =
                maintenance.status || "";

            const reportedDate =
                maintenance.reportedDate
                    ? new Date(
                          maintenance.reportedDate
                      ).toLocaleDateString("en-IN")
                    : "";

            const resolvedDate =
                maintenance.resolvedDate
                    ? new Date(
                          maintenance.resolvedDate
                      ).toLocaleDateString("en-IN")
                    : "";

            return (
                assetId
                    .toLowerCase()
                    .includes(search) ||
                assetName
                    .toLowerCase()
                    .includes(search) ||
                issue
                    .toLowerCase()
                    .includes(search) ||
                description
                    .toLowerCase()
                    .includes(search) ||
                status
                    .toLowerCase()
                    .includes(search) ||
                reportedDate
                    .toLowerCase()
                    .includes(search) ||
                resolvedDate
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // =========================
    // EXPORT EXCEL / CSV
    // =========================

    const handleExportExcel = () => {
        if (
            !filteredMaintenance ||
            filteredMaintenance.length === 0
        ) {
            alert("No maintenance records available to export.");
            return;
        }

        const headers = [
            "Asset ID",
            "Asset Name",
            "Issue",
            "Description",
            "Reported Date",
            "Status",
            "Resolved Date",
        ];

        const rows = filteredMaintenance.map(
            (maintenance) => [
                maintenance.assetId?.assetId || "",

                maintenance.assetId?.assetName || "",

                maintenance.issue || "",

                maintenance.description || "",

                maintenance.reportedDate
                    ? new Date(
                          maintenance.reportedDate
                      ).toLocaleDateString("en-IN")
                    : "",

                maintenance.status || "",

                maintenance.resolvedDate
                    ? new Date(
                          maintenance.resolvedDate
                      ).toLocaleDateString("en-IN")
                    : "",
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(value).replace(
                            /"/g,
                            '""'
                        );

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
            "DALMS_Maintenance.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================
    // EXPORT PDF
    // =========================

    const handleExportPDF = () => {
        if (
            !filteredMaintenance ||
            filteredMaintenance.length === 0
        ) {
            alert("No maintenance records available to export.");
            return;
        }

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // =========================
        // PDF HEADER
        // =========================

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");

        doc.text(
            "DALMS - Maintenance Report",
            14,
            18
        );

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        doc.text(
            `Generated on: ${new Date().toLocaleString(
                "en-IN"
            )}`,
            14,
            25
        );

        doc.text(
            `Total Records: ${filteredMaintenance.length}`,
            14,
            31
        );

        // =========================
        // TABLE DATA
        // =========================

        const tableData =
            filteredMaintenance.map(
                (maintenance) => [
                    maintenance.assetId?.assetId ||
                        "-",

                    maintenance.assetId?.assetName ||
                        "-",

                    maintenance.issue ||
                        "-",

                    maintenance.description ||
                        "-",

                    maintenance.reportedDate
                        ? new Date(
                              maintenance.reportedDate
                          ).toLocaleDateString(
                              "en-IN"
                          )
                        : "-",

                    maintenance.status ||
                        "-",

                    maintenance.resolvedDate
                        ? new Date(
                              maintenance.resolvedDate
                          ).toLocaleDateString(
                              "en-IN"
                          )
                        : "-",
                ]
            );

        // =========================
        // CREATE TABLE
        // =========================

        autoTable(doc, {
            startY: 38,

            head: [
                [
                    "Asset ID",
                    "Asset Name",
                    "Issue",
                    "Description",
                    "Reported Date",
                    "Status",
                    "Resolved Date",
                ],
            ],

            body: tableData,

            theme: "grid",

            styles: {
                fontSize: 8,
                cellPadding: 3,
                valign: "middle",
            },

            headStyles: {
                fontSize: 8,
                fontStyle: "bold",
            },

            alternateRowStyles: {
                fillColor: [248, 250, 252],
            },

            margin: {
                left: 10,
                right: 10,
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
                `DALMS | Page ${page} of ${pageCount}`,
                14,
                202
            );
        }

        // =========================
        // DOWNLOAD PDF
        // =========================

        doc.save(
            "DALMS_Maintenance_Report.pdf"
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Loading maintenance...</p>
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
                    <h2>Maintenance</h2>

                    <p>
                        Track repairs, servicing and
                        maintenance history.
                    </p>
                </div>

                <div className="page-header-actions">


                    {/* ADD MAINTENANCE */}

                    <button
                        className="primary-button"
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            }

                            setShowForm(
                                !showForm
                            );
                        }}
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add Maintenance"}
                    </button>

                </div>
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <div className="table-card">

                    <h3>
                        {editingId
                            ? "Edit Maintenance"
                            : "Add Maintenance"}
                    </h3>

                    <form
                        onSubmit={
                            editingId
                                ? handleUpdateMaintenance
                                : handleCreateMaintenance
                        }
                    >

                        <div className="asset-form-grid">

                            {/* Asset */}

                            <div className="form-field">

                                <label htmlFor="assetId">
                                    Asset
                                </label>

                                <select
                                    id="assetId"
                                    name="assetId"
                                    value={
                                        formData.assetId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Asset
                                    </option>

                                    {assets.map(
                                        (asset) => (
                                            <option
                                                key={
                                                    asset._id
                                                }
                                                value={
                                                    asset._id
                                                }
                                            >
                                                {
                                                    asset.assetId
                                                }{" "}
                                                -{" "}
                                                {
                                                    asset.assetName
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                            {/* Issue */}

                            <div className="form-field">

                                <label htmlFor="issue">
                                    Issue
                                </label>

                                <input
                                    id="issue"
                                    type="text"
                                    name="issue"
                                    placeholder="Enter maintenance issue"
                                    value={
                                        formData.issue
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Description */}

                            <div className="form-field">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    placeholder="Describe the issue or required work"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* Reported Date */}

                            <div className="form-field">

                                <label htmlFor="reportedDate">
                                    Reported Date
                                </label>

                                <input
                                    id="reportedDate"
                                    type="date"
                                    name="reportedDate"
                                    value={
                                        formData.reportedDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <small>
                                    Date when the
                                    maintenance issue
                                    was reported.
                                </small>

                            </div>

                            {/* Status */}

                            <div className="form-field">

                                <label htmlFor="status">
                                    Maintenance Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>
                                </select>

                            </div>

                            {/* Resolved Date */}

                            <div className="form-field">

                                <label htmlFor="resolvedDate">
                                    Resolved Date
                                </label>

                                <input
                                    id="resolvedDate"
                                    type="date"
                                    name="resolvedDate"
                                    value={
                                        formData.resolvedDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <small>
                                    Date when the
                                    maintenance issue
                                    was resolved.
                                    Leave empty if
                                    still pending.
                                </small>

                            </div>

                        </div>

                        {/* FORM BUTTONS */}

                        <div className="maintenance-form-actions">

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Maintenance"
                                    : "Save Maintenance"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(
                                            false
                                        );
                                    }}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>
            )}

            {/* =========================
                SEARCH + EXPORT
            ========================= */}

            <div className="table-card">

                <div className="table-toolbar">

                    <div className="search-box">

                        <span className="search-icon">
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Search maintenance records..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <div className="table-toolbar-actions">

                        <button
                            className="secondary-button"
                            onClick={
                                handleExportExcel
                            }
                        >
                            📊 Excel
                        </button>

                        <button
                            className="secondary-button"
                            onClick={
                                handleExportPDF
                            }
                        >
                            📄 PDF
                        </button>

                    </div>

                </div>

                {/* SEARCH RESULT COUNT */}

                {searchTerm && (
                    <div className="search-result-info">
                        Showing{" "}
                        <strong>
                            {filteredMaintenance.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {maintenanceRecords.length}
                        </strong>{" "}
                        maintenance records
                    </div>
                )}

                {/* =========================
                    MAINTENANCE TABLE
                ========================= */}

                {filteredMaintenance.length > 0 ? (

                    <div className="maintenance-table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>
                                    <th>Asset</th>
                                    <th>Issue</th>
                                    <th>Description</th>
                                    <th>Reported Date</th>
                                    <th>Status</th>
                                    <th>Resolved Date</th>
                                    <th className="actions-column">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredMaintenance.map(
                                    (maintenance) => (

                                        <tr
                                            key={
                                                maintenance._id
                                            }
                                        >

                                            <td>
                                                {
                                                    maintenance
                                                        .assetId
                                                        ?.assetId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    maintenance.issue
                                                }
                                            </td>

                                            <td className="description-cell">
                                                {
                                                    maintenance.description ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {maintenance.reportedDate
                                                    ? new Date(
                                                          maintenance.reportedDate
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        maintenance.status ===
                                                        "Pending"
                                                            ? "status-pending"
                                                            : maintenance.status ===
                                                              "In Progress"
                                                            ? "status-progress"
                                                            : maintenance.status ===
                                                              "Completed"
                                                            ? "status-completed"
                                                            : ""
                                                    }`}
                                                >
                                                    {
                                                        maintenance.status
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {maintenance.resolvedDate
                                                    ? new Date(
                                                          maintenance.resolvedDate
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : "-"}
                                            </td>

                                            <td className="actions-cell">

                                                <div className="maintenance-actions">

                                                    <button
                                                        type="button"
                                                        className="maintenance-edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                maintenance
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="maintenance-delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                maintenance._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="empty-state">

                        <h3>
                            {searchTerm
                                ? "No Matching Records"
                                : "No Maintenance Records"}
                        </h3>

                        <p>
                            {searchTerm
                                ? "No maintenance records match your search."
                                : "There are currently no maintenance records."}
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Maintenance;