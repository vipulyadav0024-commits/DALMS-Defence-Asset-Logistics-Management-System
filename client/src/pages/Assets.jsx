import { useEffect, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingAssetId, setEditingAssetId] = useState(null);

    const [formData, setFormData] = useState({
        assetName: "",
        category: "",
        manufacturer: "",
        serialNumber: "",
        purchaseDate: "",
        purchaseCost: "",
        warrantyExpiry: "",
        department: "",
        building: "",
        floor: "",
        description: "",
        status: "Available",
        assignedTo: "",
    });

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

            setError(
                error.response?.data?.message ||
                "Unable to load assets."
            );
        }
    };

    // =========================
    // FETCH EMPLOYEES
    // =========================

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmployees(response.data.data || []);
        } catch (error) {
            console.error("Employees fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load employees."
            );
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                fetchAssets(),
                fetchEmployees(),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // =========================
    // HANDLE FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => {
            const updatedData = {
                ...previous,
                [name]: value,
            };

            if (
                name === "status" &&
                value !== "Assigned"
            ) {
                updatedData.assignedTo = "";
            }

            return updatedData;
        });
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            assetName: "",
            category: "",
            manufacturer: "",
            serialNumber: "",
            purchaseDate: "",
            purchaseCost: "",
            warrantyExpiry: "",
            department: "",
            building: "",
            floor: "",
            description: "",
            status: "Available",
            assignedTo: "",
        });

        setEditingAssetId(null);
    };

    // =========================
    // CREATE / UPDATE ASSET
    // =========================

    const handleSaveAsset = async (e) => {
        e.preventDefault();

        setError("");

        if (
            formData.status === "Assigned" &&
            !formData.assignedTo
        ) {
            setError(
                "Please select an employee before assigning the asset."
            );

            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const assetData = {
                assetName: formData.assetName,
                category: formData.category,
                manufacturer: formData.manufacturer,
                serialNumber: formData.serialNumber,

                purchaseDate: formData.purchaseDate,

                purchaseCost: Number(
                    formData.purchaseCost
                ),

                warrantyExpiry:
                    formData.warrantyExpiry || undefined,

                department: formData.department,
                building: formData.building,
                floor: formData.floor,
                description: formData.description,

                status: formData.status,

                assignedTo:
                    formData.status === "Assigned"
                        ? formData.assignedTo
                        : null,
            };

            // =========================
            // UPDATE
            // =========================

            if (editingAssetId) {
                await axios.put(
                    `http://localhost:5000/api/assets/${editingAssetId}`,
                    assetData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // =========================
            // CREATE
            // =========================

            else {
                await axios.post(
                    "http://localhost:5000/api/assets",
                    assetData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            resetForm();
            setShowForm(false);

            await fetchAssets();
        } catch (error) {
            console.error(
                "Save Asset Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to save asset."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // EDIT ASSET
    // =========================

    const handleEditAsset = (asset) => {
        setEditingAssetId(asset._id);

        setFormData({
            assetName: asset.assetName || "",

            category: asset.category || "",

            manufacturer:
                asset.manufacturer || "",

            serialNumber:
                asset.serialNumber || "",

            purchaseDate: asset.purchaseDate
                ? asset.purchaseDate.split("T")[0]
                : "",

            purchaseCost:
                asset.purchaseCost ?? "",

            warrantyExpiry:
                asset.warrantyExpiry
                    ? asset.warrantyExpiry.split("T")[0]
                    : "",

            department:
                asset.department || "",

            building:
                asset.building || "",

            floor:
                asset.floor || "",

            description:
                asset.description || "",

            status:
                asset.status || "Available",

            assignedTo:
                asset.assignedTo?._id ||
                asset.assignedTo ||
                "",
        });

        setShowForm(true);
    };

    // =========================
    // DELETE ASSET
    // =========================

    const handleDeleteAsset = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this asset?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/assets/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchAssets();
        } catch (error) {
            console.error(
                "Delete Asset Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete asset."
            );
        }
    };

    // =========================
    // EXPORT ASSETS TO EXCEL
    // =========================

    const handleExportExcel = () => {
        if (!assets || assets.length === 0) {
            alert("No assets available to export.");
            return;
        }

        const headers = [
            "Asset ID",
            "Asset Name",
            "Category",
            "Manufacturer",
            "Serial Number",
            "Status",
            "Assigned To",
            "Department",
            "Building",
            "Floor",
            "Purchase Date",
            "Purchase Cost",
            "Warranty Expiry",
            "Description",
        ];

        const rows = assets.map((asset) => [
            asset.assetId || "",

            asset.assetName || "",

            asset.category || "",

            asset.manufacturer || "",

            asset.serialNumber || "",

            asset.status || "",

            asset.assignedTo
                ? asset.assignedTo.firstName
                    ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName || ""
                    }`
                    : "Assigned"
                : "",

            asset.department || "",

            asset.building || "",

            asset.floor || "",

            asset.purchaseDate
                ? new Date(
                    asset.purchaseDate
                ).toLocaleDateString("en-IN")
                : "",

            asset.purchaseCost ?? "",

            asset.warrantyExpiry
                ? new Date(
                    asset.warrantyExpiry
                ).toLocaleDateString("en-IN")
                : "",

            asset.description || "",
        ]);

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(value)
                            .replace(/"/g, '""');

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
            "DALMS_Assets.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================
    // EXPORT ASSETS TO PDF
    // =========================

    const handleExportPDF = () => {
        if (!assets || assets.length === 0) {
            alert("No assets available to export.");
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
            "DALMS - Asset Management Report",
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
            `Total Assets: ${assets.length}`,
            14,
            31
        );

        // =========================
        // TABLE DATA
        // =========================

        const tableData = assets.map(
            (asset) => [
                asset.assetId || "-",

                asset.assetName || "-",

                asset.category || "-",

                asset.manufacturer || "-",

                asset.status || "-",

                asset.assignedTo
                    ? asset.assignedTo.firstName
                        ? `${asset.assignedTo.firstName} ${asset.assignedTo
                            .lastName || ""
                        }`
                        : "Assigned"
                    : "-",

                asset.department || "-",

                asset.purchaseCost !==
                    undefined &&
                    asset.purchaseCost !== null
                    ? `₹${Number(
                        asset.purchaseCost
                    ).toLocaleString("en-IN")}`
                    : "-",
            ]
        );

        // =========================
        // CREATE PDF TABLE
        // =========================

        autoTable(doc, {
            startY: 38,

            head: [
                [
                    "Asset ID",
                    "Asset Name",
                    "Category",
                    "Manufacturer",
                    "Status",
                    "Assigned To",
                    "Department",
                    "Purchase Cost",
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
                fillColor: [
                    248,
                    250,
                    252,
                ],
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
            "DALMS_Assets_Report.pdf"
        );
    };
    // =========================
    // SEARCH & FILTER LOGIC
    // =========================

    const filteredAssets = assets.filter((asset) => {
        const search = searchTerm.toLowerCase().trim();

        const assignedEmployee = asset.assignedTo
            ? asset.assignedTo.firstName
                ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName || ""
                }`
                : "Assigned"
            : "";

        const matchesSearch =
            !search ||
            (asset.assetId || "")
                .toLowerCase()
                .includes(search) ||
            (asset.assetName || "")
                .toLowerCase()
                .includes(search) ||
            (asset.category || "")
                .toLowerCase()
                .includes(search) ||
            (asset.manufacturer || "")
                .toLowerCase()
                .includes(search) ||
            (asset.serialNumber || "")
                .toLowerCase()
                .includes(search) ||
            assignedEmployee
                .toLowerCase()
                .includes(search) ||
            (asset.department || "")
                .toLowerCase()
                .includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            asset.status === statusFilter;

        const matchesCategory =
            categoryFilter === "All" ||
            asset.category === categoryFilter;

        const matchesDepartment =
            departmentFilter === "All" ||
            asset.department === departmentFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory &&
            matchesDepartment
        );
    });

    // =========================
    // FILTER OPTIONS
    // =========================

    const categories = [
        ...new Set(
            assets
                .map((asset) => asset.category)
                .filter(Boolean)
        ),
    ];

    const departments = [
        ...new Set(
            assets
                .map((asset) => asset.department)
                .filter(Boolean)
        ),
    ];

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return <h2>Loading assets...</h2>;
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>
                    <h2>Assets</h2>

                    <p>
                        Manage and monitor all
                        organizational assets.
                    </p>
                </div>

                {/* ================= HEADER ACTIONS ================= */}

                <div className="page-header-actions">

                    {/* EXCEL BUTTON */}

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportExcel
                        }
                    >
                        📊 Export Excel
                    </button>

                    {/* PDF BUTTON */}

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportPDF
                        }
                    >
                        📄 Export PDF
                    </button>

                    {/* ADD ASSET BUTTON */}

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
                            : "+ Add Asset"}
                    </button>

                </div>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {/* ================= SEARCH & FILTER ================= */}

            <div className="asset-filter-card">

                <div className="asset-search-box">

                    <input
                        type="text"
                        placeholder="Search by Asset ID, name, category, serial number..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            className="search-clear-button"
                            onClick={() => setSearchTerm("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="asset-filter-group">

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Available">
                            Available
                        </option>

                        <option value="Assigned">
                            Assigned
                        </option>

                        <option value="Under Maintenance">
                            Under Maintenance
                        </option>

                        <option value="Retired">
                            Retired
                        </option>

                        <option value="Lost">
                            Lost
                        </option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={departmentFilter}
                        onChange={(e) =>
                            setDepartmentFilter(e.target.value)
                        }
                    >
                        <option value="All">
                            All Departments
                        </option>

                        {departments.map((department) => (
                            <option
                                key={department}
                                value={department}
                            >
                                {department}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("All");
                            setCategoryFilter("All");
                            setDepartmentFilter("All");
                        }}
                    >
                        Clear Filters
                    </button>

                </div>

                <div className="asset-filter-summary">
                    Showing{" "}
                    <strong>{filteredAssets.length}</strong>{" "}
                    of{" "}
                    <strong>{assets.length}</strong>{" "}
                    assets
                </div>

            </div>

            {/* ================= FORM ================= */}

            {showForm && (
                <div className="table-card">

                    <h3>
                        {editingAssetId
                            ? "Edit Asset"
                            : "Add New Asset"}
                    </h3>

                    <form
                        onSubmit={
                            handleSaveAsset
                        }
                    >

                        <div className="asset-form-grid">

                            {/* Asset Name */}

                            <div className="form-group">

                                <label>
                                    Asset Name
                                </label>

                                <input
                                    name="assetName"
                                    placeholder="e.g. Dell Latitude 5440"
                                    value={
                                        formData.assetName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Category */}

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <input
                                    name="category"
                                    placeholder="e.g. Laptop"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Manufacturer */}

                            <div className="form-group">

                                <label>
                                    Manufacturer
                                </label>

                                <input
                                    name="manufacturer"
                                    placeholder="e.g. Dell"
                                    value={
                                        formData.manufacturer
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Serial Number */}

                            <div className="form-group">

                                <label>
                                    Serial Number
                                </label>

                                <input
                                    name="serialNumber"
                                    placeholder="e.g. DL5440SN001"
                                    value={
                                        formData.serialNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Purchase Date */}

                            <div className="form-group">

                                <label>
                                    Purchase Date
                                </label>

                                <input
                                    type="date"
                                    name="purchaseDate"
                                    value={
                                        formData.purchaseDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Purchase Cost */}

                            <div className="form-group">

                                <label>
                                    Purchase Cost (₹)
                                </label>

                                <input
                                    type="number"
                                    name="purchaseCost"
                                    placeholder="e.g. 75000"
                                    value={
                                        formData.purchaseCost
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    required
                                />

                            </div>

                            {/* Warranty Expiry */}

                            <div className="form-group">

                                <label>
                                    Warranty Expiry Date
                                </label>

                                <input
                                    type="date"
                                    name="warrantyExpiry"
                                    value={
                                        formData.warrantyExpiry
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* Department */}

                            <div className="form-group">

                                <label>
                                    Department
                                </label>

                                <input
                                    name="department"
                                    placeholder="e.g. IT Department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Building */}

                            <div className="form-group">

                                <label>
                                    Building
                                </label>

                                <input
                                    name="building"
                                    placeholder="e.g. Defence Bhawan"
                                    value={
                                        formData.building
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* Floor */}

                            <div className="form-group">

                                <label>
                                    Floor
                                </label>

                                <input
                                    name="floor"
                                    placeholder="e.g. 3rd Floor"
                                    value={
                                        formData.floor
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* Asset Status */}

                            <div className="form-group">

                                <label>
                                    Asset Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Assigned">
                                        Assigned
                                    </option>

                                    <option value="Under Maintenance">
                                        Under Maintenance
                                    </option>

                                    <option value="Retired">
                                        Retired
                                    </option>

                                    <option value="Lost">
                                        Lost
                                    </option>

                                </select>

                            </div>

                            {/* Assigned Employee */}

                            {formData.status ===
                                "Assigned" && (
                                    <div className="form-group">

                                        <label>
                                            Assigned Employee
                                        </label>

                                        <select
                                            name="assignedTo"
                                            value={
                                                formData.assignedTo
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select Employee
                                            </option>

                                            {employees
                                                .filter(
                                                    (
                                                        employee
                                                    ) =>
                                                        employee.status ===
                                                        "Active"
                                                )
                                                .map(
                                                    (
                                                        employee
                                                    ) => (
                                                        <option
                                                            key={
                                                                employee._id
                                                            }
                                                            value={
                                                                employee._id
                                                            }
                                                        >
                                                            {
                                                                employee.firstName
                                                            }{" "}
                                                            {
                                                                employee.lastName
                                                            }{" "}
                                                            (
                                                            {
                                                                employee.employeeId
                                                            }
                                                            )
                                                        </option>
                                                    )
                                                )}

                                        </select>

                                    </div>
                                )}

                        </div>

                        {/* Description */}

                        <div className="form-group">

                            <label>
                                Asset Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Enter asset description..."
                                rows="4"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* Save Button */}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingAssetId
                                    ? "Update Asset"
                                    : "Save Asset"}
                        </button>

                    </form>

                </div>
            )}

            {/* ================= ASSET TABLE ================= */}

            <div className="table-card">

                {filteredAssets.length > 0 ? (

                    <table className="data-table">

                        <thead>

                            <tr>
                                <th>Asset ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Manufacturer</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredAssets.map(
                                (asset) => (
                                    <tr
                                        key={
                                            asset._id
                                        }
                                    >

                                        <td>
                                            {
                                                asset.assetId
                                            }
                                        </td>

                                        <td>
                                            {
                                                asset.assetName
                                            }
                                        </td>

                                        <td>
                                            {
                                                asset.category
                                            }
                                        </td>

                                        <td>
                                            {
                                                asset.manufacturer
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${asset.status ===
                                                    "Available"
                                                    ? "status-available"
                                                    : asset.status ===
                                                        "Assigned"
                                                        ? "status-assigned"
                                                        : asset.status ===
                                                            "Under Maintenance"
                                                            ? "status-maintenance"
                                                            : asset.status ===
                                                                "Retired"
                                                                ? "status-retired"
                                                                : "status-lost"
                                                    }`}
                                            >
                                                {
                                                    asset.status ||
                                                    "Available"
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            {asset.assignedTo
                                                ? asset.assignedTo
                                                    .firstName
                                                    ? `${asset.assignedTo.firstName} ${asset.assignedTo
                                                        .lastName ||
                                                    ""
                                                    }`
                                                    : "Assigned"
                                                : "-"}

                                        </td>

                                        <td>
                                            {
                                                asset.department
                                            }
                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditAsset(
                                                            asset
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteAsset(
                                                            asset._id
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

                ) : (

                    <div className="empty-state">

                        <h3>
                            {searchTerm ||
                                statusFilter !== "All" ||
                                categoryFilter !== "All" ||
                                departmentFilter !== "All"
                                ? "No Matching Assets"
                                : "No Assets Found"}
                        </h3>

                        <p>
                            {searchTerm ||
                                statusFilter !== "All" ||
                                categoryFilter !== "All" ||
                                departmentFilter !== "All"
                                ? "No assets match the selected search or filters."
                                : "There are currently no assets available in the system."}
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Assets;