import { useEffect, useState } from "react";
import axios from "axios";
import {
    Search,
    UserCircle,
    ShieldCheck,
    Mail,
    Building2,
    Loader2,
    X,
    UserPlus,
} from "lucide-react";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        employeeId: "",
        fullName: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        joiningDate: "",
        mobile: "",
        officeLocation: "",
    });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/admins",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAdmins(response.data.data || []);
        } catch (error) {
            console.error("Get Admins Error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load administrators."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    };

    const resetForm = () => {
        setFormData({
            employeeId: "",
            fullName: "",
            email: "",
            password: "",
            department: "",
            designation: "",
            joiningDate: "",
            mobile: "",
            officeLocation: "",
        });

        setFormError("");
    };

    const closeAddAdminModal = () => {
        if (submitting) {
            return;
        }

        setShowAddAdmin(false);
        resetForm();
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();

        setFormError("");
        setSuccessMessage("");

        if (formData.password.length < 6) {
            setFormError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (formData.mobile.length < 10) {
            setFormError(
                "Please enter a valid mobile number."
            );
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/admins",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccessMessage(
                response.data.message ||
                    "Admin created successfully."
            );

            setShowAddAdmin(false);
            resetForm();

            await fetchAdmins();
        } catch (error) {
            console.error("Add Admin Error:", error);

            setFormError(
                error.response?.data?.message ||
                    "Unable to create administrator."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAdmins = admins.filter((admin) => {
        const search = searchTerm.toLowerCase();

        return (
            admin.fullName?.toLowerCase().includes(search) ||
            admin.email?.toLowerCase().includes(search) ||
            admin.employeeId?.toLowerCase().includes(search) ||
            admin.department?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="admin-management-page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2>Admin Management</h2>

                    <p>
                        Manage administrators and their access
                        to the DALMS system.
                    </p>
                </div>

                <button
                    className="primary-action-button"
                    onClick={() => {
                        setShowAddAdmin(true);
                        setFormError("");
                        setSuccessMessage("");
                    }}
                >
                    <UserPlus size={17} />
                    Add Admin
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="admin-success">
                    {successMessage}
                </div>
            )}

            {/* Search */}
            <div className="admin-search-box">

                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search administrators..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

            </div>

            {/* Loading */}
            {loading && (
                <div className="admin-state">

                    <Loader2
                        size={24}
                        className="loading-icon"
                    />

                    <p>Loading administrators...</p>

                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            {/* Admin Table */}
            {!loading && !error && (
                <div className="admin-table-card">

                    <div className="admin-table-header">
                        <div>
                            <h3>Administrators</h3>

                            <span>
                                {filteredAdmins.length}{" "}
                                administrator
                                {filteredAdmins.length !== 1
                                    ? "s"
                                    : ""}
                            </span>
                        </div>
                    </div>

                    {filteredAdmins.length > 0 ? (
                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>
                                    <tr>
                                        <th>Administrator</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredAdmins.map(
                                        (admin) => (
                                            <tr
                                                key={
                                                    admin._id
                                                }
                                            >

                                                <td>
                                                    <div className="admin-user-cell">

                                                        <div className="admin-avatar">
                                                            <UserCircle
                                                                size={
                                                                    25
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    admin.fullName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    admin.employeeId
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-detail-cell">
                                                        <Mail
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        {
                                                            admin.email
                                                        }
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-detail-cell">
                                                        <Building2
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        {
                                                            admin.department
                                                        }
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="admin-role-badge">
                                                        <ShieldCheck
                                                            size={
                                                                13
                                                            }
                                                        />

                                                        {
                                                            admin.role
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            admin.status ===
                                                            "Active"
                                                                ? "admin-status-badge active"
                                                                : "admin-status-badge inactive"
                                                        }
                                                    >
                                                        <span></span>

                                                        {
                                                            admin.status
                                                        }
                                                    </span>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    ) : (
                        <div className="admin-empty-state">

                            <UserCircle
                                size={45}
                            />

                            <h3>
                                No administrators found
                            </h3>

                            <p>
                                Try changing your search
                                or add a new administrator.
                            </p>

                        </div>
                    )}

                </div>
            )}

            {/* Add Admin Modal */}
            {showAddAdmin && (
                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        {/* Modal Header */}
                        <div className="admin-modal-header">

                            <div>
                                <h2>Add Administrator</h2>

                                <p>
                                    Create a new Admin account
                                    for DALMS.
                                </p>
                            </div>

                            <button
                                className="admin-modal-close"
                                onClick={
                                    closeAddAdminModal
                                }
                                type="button"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Form Error */}
                        {formError && (
                            <div className="admin-form-error">
                                {formError}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            className="admin-form"
                            onSubmit={handleAddAdmin}
                        >

                            <div className="admin-form-grid">

                                {/* Employee ID */}
                                <div className="admin-form-field">

                                    <label>
                                        Employee ID
                                    </label>

                                    <input
                                        type="text"
                                        name="employeeId"
                                        value={
                                            formData.employeeId
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="ADM003"
                                        required
                                    />

                                </div>

                                {/* Full Name */}
                                <div className="admin-form-field">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={
                                            formData.fullName
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Full name"
                                        required
                                    />

                                </div>

                                {/* Email */}
                                <div className="admin-form-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="admin@dalms.com"
                                        required
                                    />

                                </div>

                                {/* Password */}
                                <div className="admin-form-field">

                                    <label>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Minimum 6 characters"
                                        required
                                    />

                                </div>

                                {/* Department */}
                                <div className="admin-form-field">

                                    <label>
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        name="department"
                                        value={
                                            formData.department
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Administration"
                                        required
                                    />

                                </div>

                                {/* Designation */}
                                <div className="admin-form-field">

                                    <label>
                                        Designation
                                    </label>

                                    <input
                                        type="text"
                                        name="designation"
                                        value={
                                            formData.designation
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="System Administrator"
                                        required
                                    />

                                </div>

                                {/* Joining Date */}
                                <div className="admin-form-field">

                                    <label>
                                        Joining Date
                                    </label>

                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={
                                            formData.joiningDate
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                {/* Mobile */}
                                <div className="admin-form-field">

                                    <label>
                                        Mobile
                                    </label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={
                                            formData.mobile
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="9876543210"
                                        required
                                    />

                                </div>

                                {/* Office Location */}
                                <div className="admin-form-field admin-form-full">

                                    <label>
                                        Office Location
                                    </label>

                                    <input
                                        type="text"
                                        name="officeLocation"
                                        value={
                                            formData.officeLocation
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Defence Delhi"
                                        required
                                    />

                                </div>

                            </div>

                            {/* Form Actions */}
                            <div className="admin-form-actions">

                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={
                                        closeAddAdminModal
                                    }
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-submit-button"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="loading-icon"
                                            />

                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus
                                                size={17}
                                            />

                                            Create Admin
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminManagement;