import { useEffect, useState } from "react";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Employees = () => {
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    // =========================
    // SEARCH & FILTER STATE
    // =========================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [designationFilter, setDesignationFilter] = useState("All");

    // =========================
    // FORM DATA
    // =========================

    const [formData, setFormData] = useState({
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        designation: "",
        phoneNumber: "",
        status: "Active",
    });

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

            setError(
                error.response?.data?.message ||
                    "Unable to load employees."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchEmployees();
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
            employeeId: "",
            firstName: "",
            lastName: "",
            email: "",
            department: "",
            designation: "",
            phoneNumber: "",
            status: "Active",
        });

        setEditingEmployeeId(null);
    };

    // =========================
    // SAVE EMPLOYEE
    // =========================

    const handleSaveEmployee = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (editingEmployeeId) {
                await axios.put(
                    `http://localhost:5000/api/employees/${editingEmployeeId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/employees",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            resetForm();
            setShowForm(false);

            await fetchEmployees();
        } catch (error) {
            console.error(
                "Save Employee Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to save employee."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // EDIT EMPLOYEE
    // =========================

    const handleEditEmployee = (employee) => {
        setEditingEmployeeId(employee._id);

        setFormData({
            employeeId:
                employee.employeeId || "",

            firstName:
                employee.firstName || "",

            lastName:
                employee.lastName || "",

            email:
                employee.email || "",

            department:
                employee.department || "",

            designation:
                employee.designation || "",

            phoneNumber:
                employee.phoneNumber || "",

            status:
                employee.status || "Active",
        });

        setShowForm(true);
    };

    // =========================
    // DELETE EMPLOYEE
    // =========================

    const handleDeleteEmployee = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/employees/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchEmployees();
        } catch (error) {
            console.error(
                "Delete Employee Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to delete employee."
            );
        }
    };

    // =========================
    // SEARCH & FILTER LOGIC
    // =========================

    const filteredEmployees = employees.filter(
        (employee) => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            const fullName =
                `${employee.firstName || ""} ${
                    employee.lastName || ""
                }`.trim();

            const matchesSearch =
                !search ||
                (employee.employeeId || "")
                    .toLowerCase()
                    .includes(search) ||
                fullName
                    .toLowerCase()
                    .includes(search) ||
                (employee.email || "")
                    .toLowerCase()
                    .includes(search) ||
                (employee.department || "")
                    .toLowerCase()
                    .includes(search) ||
                (employee.designation || "")
                    .toLowerCase()
                    .includes(search) ||
                (employee.phoneNumber || "")
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                employee.status === statusFilter;

            const matchesDepartment =
                departmentFilter === "All" ||
                employee.department ===
                    departmentFilter;

            const matchesDesignation =
                designationFilter === "All" ||
                employee.designation ===
                    designationFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment &&
                matchesDesignation
            );
        }
    );

    // =========================
    // FILTER OPTIONS
    // =========================

    const departments = [
        ...new Set(
            employees
                .map(
                    (employee) =>
                        employee.department
                )
                .filter(Boolean)
        ),
    ];

    const designations = [
        ...new Set(
            employees
                .map(
                    (employee) =>
                        employee.designation
                )
                .filter(Boolean)
        ),
    ];

    // =========================
    // EXPORT EMPLOYEES TO EXCEL
    // =========================

    const handleExportExcel = () => {
        if (
            !filteredEmployees ||
            filteredEmployees.length === 0
        ) {
            alert(
                "No employees available to export."
            );
            return;
        }

        const headers = [
            "Employee ID",
            "First Name",
            "Last Name",
            "Email",
            "Department",
            "Designation",
            "Phone Number",
            "Status",
        ];

        const rows = filteredEmployees.map(
            (employee) => [
                employee.employeeId || "",
                employee.firstName || "",
                employee.lastName || "",
                employee.email || "",
                employee.department || "",
                employee.designation || "",
                employee.phoneNumber || "",
                employee.status || "",
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(
                            value
                        ).replace(
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
            "DALMS_Employees.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================
    // EXPORT EMPLOYEES TO PDF
    // =========================

    const handleExportPDF = () => {
        if (
            !filteredEmployees ||
            filteredEmployees.length === 0
        ) {
            alert(
                "No employees available to export."
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
            "DALMS - Employee Management Report",
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
            `Total Employees: ${filteredEmployees.length}`,
            14,
            31
        );

        // =========================
        // TABLE DATA
        // =========================

        const tableData =
            filteredEmployees.map(
                (employee) => [
                    employee.employeeId ||
                        "-",

                    `${employee.firstName || ""} ${
                        employee.lastName || ""
                    }`.trim() || "-",

                    employee.email || "-",

                    employee.department ||
                        "-",

                    employee.designation ||
                        "-",

                    employee.phoneNumber ||
                        "-",

                    employee.status || "-",
                ]
            );

        // =========================
        // CREATE TABLE
        // =========================

        autoTable(doc, {
            startY: 38,

            head: [
                [
                    "Employee ID",
                    "Name",
                    "Email",
                    "Department",
                    "Designation",
                    "Phone",
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
            "DALMS_Employees_Report.pdf"
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return <h2>Loading employees...</h2>;
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>
                    <h2>Employees</h2>

                    <p>
                        Manage organizational
                        employees.
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
                            : "+ Add Employee"}
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
                        placeholder="Search by Employee ID, name, email, department..."
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

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>
                    </select>

                    <select
                        value={
                            departmentFilter
                        }
                        onChange={(e) =>
                            setDepartmentFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="All">
                            All Departments
                        </option>

                        {departments.map(
                            (department) => (
                                <option
                                    key={
                                        department
                                    }
                                    value={
                                        department
                                    }
                                >
                                    {department}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={
                            designationFilter
                        }
                        onChange={(e) =>
                            setDesignationFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="All">
                            All Designations
                        </option>

                        {designations.map(
                            (designation) => (
                                <option
                                    key={
                                        designation
                                    }
                                    value={
                                        designation
                                    }
                                >
                                    {designation}
                                </option>
                            )
                        )}
                    </select>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter(
                                "All"
                            );
                            setDepartmentFilter(
                                "All"
                            );
                            setDesignationFilter(
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
                            filteredEmployees.length
                        }
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {employees.length}
                    </strong>{" "}
                    employees

                </div>

            </div>

            {/* ================= FORM ================= */}

            {showForm && (
                <div className="table-card">

                    <h3>
                        {editingEmployeeId
                            ? "Edit Employee"
                            : "Add New Employee"}
                    </h3>

                    <form
                        onSubmit={
                            handleSaveEmployee
                        }
                    >

                        <div className="asset-form-grid">

                            <input
                                name="employeeId"
                                placeholder="Employee ID"
                                value={
                                    formData.employeeId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="firstName"
                                placeholder="First Name"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="lastName"
                                placeholder="Last Name"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="department"
                                placeholder="Department"
                                value={
                                    formData.department
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="designation"
                                placeholder="Designation"
                                value={
                                    formData.designation
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            <input
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={
                                    formData.phoneNumber
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
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
                                : editingEmployeeId
                                ? "Update Employee"
                                : "Save Employee"}
                        </button>

                    </form>

                </div>
            )}

            {/* ================= EMPLOYEE TABLE ================= */}

            <div className="table-card">

                {filteredEmployees.length >
                0 ? (

                    <table className="data-table">

                        <thead>

                            <tr>
                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Designation
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredEmployees.map(
                                (employee) => (
                                    <tr
                                        key={
                                            employee._id
                                        }
                                    >

                                        <td>
                                            {
                                                employee.employeeId
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.firstName
                                            }{" "}
                                            {
                                                employee.lastName
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.email
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.department
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.designation
                                            }
                                        </td>

                                        <td>
                                            {
                                                employee.phoneNumber ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${
                                                    employee.status ===
                                                    "Active"
                                                        ? "status-available"
                                                        : "status-retired"
                                                }`}
                                            >
                                                {
                                                    employee.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditEmployee(
                                                            employee
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteEmployee(
                                                            employee._id
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
                            No Employees Found
                        </h3>

                        <p>
                            No employees match
                            your current search
                            or filters.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Employees;