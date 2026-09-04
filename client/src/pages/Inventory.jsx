import { useEffect, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    // =========================
    // SEARCH & FILTER STATE
    // =========================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // =========================
    // FORM DATA
    // =========================

    const [formData, setFormData] = useState({
        assetId: "",
        employeeId: "",
        assignedDate: "",
        returnDate: "",
        status: "Assigned",
    });

    // =========================
    // FETCH INVENTORY
    // =========================

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/inventory",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInventory(response.data.data || []);
        } catch (error) {
            console.error(
                "Inventory fetch error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load inventory."
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
            console.error(
                "Assets fetch error:",
                error
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
            console.error(
                "Employees fetch error:",
                error
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
                fetchInventory(),
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
            employeeId: "",
            assignedDate: "",
            returnDate: "",
            status: "Assigned",
        });
    };

    // =========================
    // CREATE INVENTORY RECORD
    // =========================

    const handleCreateInventory = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/inventory",
                {
                    assetId: formData.assetId,
                    employeeId: formData.employeeId,
                    assignedDate:
                        formData.assignedDate,
                    returnDate:
                        formData.returnDate || null,
                    status: formData.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            resetForm();
            setShowForm(false);

            await fetchInventory();
        } catch (error) {
            console.error(
                "Create Inventory Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to create inventory record."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // RETURN ASSET
    // =========================

    const handleReturnAsset = async (id) => {
        const confirmReturn = window.confirm(
            "Are you sure you want to return this asset?"
        );

        if (!confirmReturn) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/inventory/${id}/return`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchInventory();
        } catch (error) {
            console.error(
                "Return Asset Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to return asset."
            );
        }
    };

    // =========================
    // SEARCH & FILTER
    // =========================

    const filteredInventory = inventory.filter(
        (item) => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            const assetId =
                item.assetId?.assetId || "";

            const assetName =
                item.assetId?.assetName || "";

            const employeeId =
                item.employeeId?.employeeId || "";

            const employeeName =
                item.employeeId
                    ? `${item.employeeId.firstName || ""} ${
                          item.employeeId.lastName || ""
                      }`.trim()
                    : "";

            const status =
                item.status || "";

            const matchesSearch =
                !search ||
                assetId
                    .toLowerCase()
                    .includes(search) ||
                assetName
                    .toLowerCase()
                    .includes(search) ||
                employeeId
                    .toLowerCase()
                    .includes(search) ||
                employeeName
                    .toLowerCase()
                    .includes(search) ||
                status
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                item.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    // =========================
    // EXPORT TO EXCEL / CSV
    // =========================

    const handleExportExcel = () => {
        if (
            !filteredInventory ||
            filteredInventory.length === 0
        ) {
            alert(
                "No inventory records available to export."
            );

            return;
        }

        const headers = [
            "Asset ID",
            "Asset Name",
            "Employee ID",
            "Employee Name",
            "Assigned Date",
            "Return Date",
            "Status",
        ];

        const rows = filteredInventory.map(
            (item) => [
                item.assetId?.assetId || "",
                item.assetId?.assetName || "",
                item.employeeId?.employeeId || "",

                item.employeeId
                    ? `${item.employeeId.firstName || ""} ${
                          item.employeeId.lastName || ""
                      }`.trim()
                    : "",

                item.assignedDate
                    ? new Date(
                          item.assignedDate
                      ).toLocaleDateString(
                          "en-IN"
                      )
                    : "",

                item.returnDate
                    ? new Date(
                          item.returnDate
                      ).toLocaleDateString(
                          "en-IN"
                      )
                    : "",

                item.status || "",
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text =
                            String(value).replace(
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
            "DALMS_Inventory.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================
    // EXPORT TO PDF
    // =========================

    const handleExportPDF = () => {
        if (
            !filteredInventory ||
            filteredInventory.length === 0
        ) {
            alert(
                "No inventory records available to export."
            );

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

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "DALMS - Inventory Management Report",
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

        doc.text(
            `Total Records: ${filteredInventory.length}`,
            14,
            31
        );

        // =========================
        // TABLE DATA
        // =========================

        const tableData =
            filteredInventory.map(
                (item) => [
                    item.assetId?.assetId ||
                        "-",

                    item.assetId?.assetName ||
                        "-",

                    item.employeeId?.employeeId ||
                        "-",

                    item.employeeId
                        ? `${item.employeeId.firstName || ""} ${
                              item.employeeId.lastName || ""
                          }`.trim()
                        : "-",

                    item.assignedDate
                        ? new Date(
                              item.assignedDate
                          ).toLocaleDateString(
                              "en-IN"
                          )
                        : "-",

                    item.returnDate
                        ? new Date(
                              item.returnDate
                          ).toLocaleDateString(
                              "en-IN"
                          )
                        : "-",

                    item.status || "-",
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
                    "Employee ID",
                    "Employee Name",
                    "Assigned Date",
                    "Return Date",
                    "Status",
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
            "DALMS_Inventory_Report.pdf"
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return <h2>Loading inventory...</h2>;
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>
                    <h2>Inventory</h2>

                    <p>
                        Manage asset assignments
                        and returns.
                    </p>
                </div>

                <div className="page-header-actions">

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportExcel
                        }
                    >
                        📊 Export Excel
                    </button>

                    <button
                        className="secondary-button"
                        onClick={
                            handleExportPDF
                        }
                    >
                        📄 Export PDF
                    </button>

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
                            : "+ Assign Asset"}
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
                        placeholder="Search by Asset ID, asset name, Employee ID, employee name..."
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
                            className="search-clear-button"
                            onClick={() =>
                                setSearchTerm("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="asset-filter-group">

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Assigned">
                            Assigned
                        </option>

                        <option value="Returned">
                            Returned
                        </option>
                    </select>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter(
                                "All"
                            );
                        }}
                    >
                        Clear Filters
                    </button>

                </div>

                <div className="asset-filter-summary">

                    Showing{" "}
                    <strong>
                        {
                            filteredInventory.length
                        }
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {inventory.length}
                    </strong>{" "}
                    inventory records

                </div>

            </div>

            {/* ================= ASSIGN FORM ================= */}

            {showForm && (
                <div className="table-card">

                    <h3>
                        Assign Asset
                    </h3>

                    <form
                        onSubmit={
                            handleCreateInventory
                        }
                    >

                        <div className="asset-form-grid">

                            {/* ASSET */}

                            <select
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

                            {/* EMPLOYEE */}

                            <select
                                name="employeeId"
                                value={
                                    formData.employeeId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map(
                                    (employee) => (
                                        <option
                                            key={
                                                employee._id
                                            }
                                            value={
                                                employee._id
                                            }
                                        >
                                            {
                                                employee.employeeId
                                            }{" "}
                                            -{" "}
                                            {
                                                employee.firstName
                                            }{" "}
                                            {
                                                employee.lastName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            {/* ASSIGNED DATE */}

                            <input
                                type="date"
                                name="assignedDate"
                                value={
                                    formData.assignedDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            {/* RETURN DATE */}

                            <input
                                type="date"
                                name="returnDate"
                                value={
                                    formData.returnDate
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            {/* STATUS */}

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Assigned">
                                    Assigned
                                </option>

                                <option value="Returned">
                                    Returned
                                </option>

                            </select>

                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Assignment"}
                        </button>

                    </form>

                </div>
            )}

            {/* ================= INVENTORY TABLE ================= */}

            <div className="table-card">

                {filteredInventory.length >
                0 ? (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Asset ID
                                </th>

                                <th>
                                    Asset Name
                                </th>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Employee Name
                                </th>

                                <th>
                                    Assigned Date
                                </th>

                                <th>
                                    Return Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInventory.map(
                                (item) => (
                                    <tr
                                        key={
                                            item._id
                                        }
                                    >

                                        <td>
                                            {
                                                item
                                                    .assetId
                                                    ?.assetId ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                item
                                                    .assetId
                                                    ?.assetName ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                item
                                                    .employeeId
                                                    ?.employeeId ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {item.employeeId
                                                ? `${item.employeeId.firstName || ""} ${
                                                      item.employeeId.lastName || ""
                                                  }`.trim()
                                                : "-"}
                                        </td>

                                        <td>
                                            {item.assignedDate
                                                ? new Date(
                                                      item.assignedDate
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "-"}
                                        </td>

                                        <td>
                                            {item.returnDate
                                                ? new Date(
                                                      item.returnDate
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${
                                                    item.status ===
                                                    "Assigned"
                                                        ? "status-assigned"
                                                        : "status-available"
                                                }`}
                                            >
                                                {
                                                    item.status ||
                                                    "-"
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            {item.status ===
                                            "Assigned" ? (

                                                <button
                                                    className="return-button"
                                                    onClick={() =>
                                                        handleReturnAsset(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    Return
                                                </button>

                                            ) : (

                                                <span>
                                                    Returned
                                                </span>

                                            )}

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                ) : (

                    <div className="empty-state">

                        <h3>
                            No Inventory Records
                        </h3>

                        <p>
                            No inventory records
                            match your current
                            search or filters.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Inventory;