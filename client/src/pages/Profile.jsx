import {
    UserCircle,
    Mail,
    ShieldCheck,
    LockKeyhole,
    Building2,
    BriefcaseBusiness,
    CalendarDays,
    Phone,
    MapPin,
} from "lucide-react";

const Profile = () => {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-section">
                    <h2>Profile unavailable</h2>
                    <p>
                        Please log in again to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    const formattedJoiningDate = user.joiningDate
        ? new Date(user.joiningDate).toLocaleDateString(
              "en-IN",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              }
          )
        : "Not available";

    return (
        <div className="profile-page">

            {/* =========================
                PAGE HEADER
            ========================== */}
            <div className="page-header">

                <div>
                    <h2>My Profile</h2>

                    <p>
                        Manage your account information and
                        security settings.
                    </p>
                </div>

            </div>


            {/* =========================
                PROFILE HERO
            ========================== */}
            <div className="profile-hero">

                <div className="profile-page-avatar">

                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt={user.fullName}
                        />
                    ) : (
                        <UserCircle size={70} />
                    )}

                </div>


                <div className="profile-hero-info">

                    <h2>
                        {user.fullName || "User"}
                    </h2>

                    <p>
                        {user.designation || "Employee"}
                    </p>

                    <span className="profile-status">

                        <span></span>

                        {user.status === "Inactive"
                            ? "Inactive Account"
                            : "Active Account"}

                    </span>

                </div>

            </div>


            {/* =========================
                ACCOUNT INFORMATION
            ========================== */}
            <div className="profile-section">

                <div className="profile-section-header">

                    <div>
                        <h3>Account Information</h3>

                        <p>
                            Basic information associated with
                            your DALMS account.
                        </p>
                    </div>

                    <ShieldCheck size={22} />

                </div>


                <div className="profile-info-grid">

                    {/* Name */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <UserCircle size={19} />
                        </div>

                        <div>
                            <span>Name</span>

                            <strong>
                                {user.fullName || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Email */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <Mail size={19} />
                        </div>

                        <div>
                            <span>Email</span>

                            <strong>
                                {user.email || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Employee ID */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <div>
                            <span>Employee ID</span>

                            <strong>
                                {user.employeeId ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Role */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <div>
                            <span>Role</span>

                            <strong>
                                {user.role || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Department */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <Building2 size={19} />
                        </div>

                        <div>
                            <span>Department</span>

                            <strong>
                                {user.department ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Designation */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <div>
                            <span>Designation</span>

                            <strong>
                                {user.designation ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Joining Date */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <CalendarDays size={19} />
                        </div>

                        <div>
                            <span>Joining Date</span>

                            <strong>
                                {formattedJoiningDate}
                            </strong>
                        </div>

                    </div>


                    {/* Mobile */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <Phone size={19} />
                        </div>

                        <div>
                            <span>Mobile</span>

                            <strong>
                                {user.mobile || "Not available"}
                            </strong>
                        </div>

                    </div>


                    {/* Office Location */}
                    <div className="profile-info-card">

                        <div className="profile-info-icon">
                            <MapPin size={19} />
                        </div>

                        <div>
                            <span>Office Location</span>

                            <strong>
                                {user.officeLocation ||
                                    "Not available"}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                SECURITY
            ========================== */}
            <div className="profile-section">

                <div className="profile-section-header">

                    <div>
                        <h3>Security</h3>

                        <p>
                            Manage your account security.
                        </p>
                    </div>

                    <LockKeyhole size={22} />

                </div>


                <div className="security-row">

                    <div>

                        <strong>Password</strong>

                        <p>
                            Your password is securely encrypted
                            and never displayed here.
                        </p>

                    </div>

                    <button
                        className="profile-action-button"
                        disabled
                    >
                        Change Password
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Profile;