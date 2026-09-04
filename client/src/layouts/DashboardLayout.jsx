import { useState } from "react";
import {
    Outlet,
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    LayoutDashboard,
    Laptop,
    Users,
    Package,
    Wrench,
    BarChart3,
    Search,
    UserCircle,
    LogOut,
    ChevronDown,
    Menu,
    X,
    ShieldCheck,
} from "lucide-react";

import NotificationDropdown from "../components/NotificationDropdown";

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const isAdmin = user?.role === "Admin";

    // =========================================
    // MAIN NAVIGATION
    // =========================================

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Assets",
            path: "/assets",
            icon: Laptop,
        },
        {
            name: "Employees",
            path: "/employees",
            icon: Users,
        },
        {
            name: "Inventory",
            path: "/inventory",
            icon: Package,
        },
        {
            name: "Maintenance",
            path: "/maintenance",
            icon: Wrench,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: BarChart3,
        },
    ];

    // =========================================
    // ADMIN MANAGEMENT
    // =========================================

    const visibleMenuItems = isAdmin
        ? [
              ...menuItems,
              {
                  name: "Admin Management",
                  path: "/admin-management",
                  icon: ShieldCheck,
              },
          ]
        : menuItems;

    // =========================================
    // SEARCH DATA
    // =========================================

    const searchablePages = [
        {
            name: "Dashboard",
            path: "/dashboard",
            keywords: "dashboard home overview",
            icon: LayoutDashboard,
        },
        {
            name: "Assets",
            path: "/assets",
            keywords: "asset assets laptop computer equipment",
            icon: Laptop,
        },
        {
            name: "Employees",
            path: "/employees",
            keywords: "employee employees staff personnel users",
            icon: Users,
        },
        {
            name: "Inventory",
            path: "/inventory",
            keywords: "inventory package stock items",
            icon: Package,
        },
        {
            name: "Maintenance",
            path: "/maintenance",
            keywords: "maintenance repair service pending completed",
            icon: Wrench,
        },
        {
            name: "Reports",
            path: "/reports",
            keywords: "reports analytics statistics",
            icon: BarChart3,
        },
        {
            name: "My Profile",
            path: "/profile",
            keywords: "profile account user personal",
            icon: UserCircle,
        },
    ];

    if (isAdmin) {
        searchablePages.push({
            name: "Admin Management",
            path: "/admin-management",
            keywords: "admin administrator management security",
            icon: ShieldCheck,
        });
    }

    const filteredSearchResults =
        searchTerm.trim().length > 0
            ? searchablePages.filter((page) => {
                  const search = searchTerm
                      .toLowerCase()
                      .trim();

                  return (
                      page.name
                          .toLowerCase()
                          .includes(search) ||
                      page.keywords
                          .toLowerCase()
                          .includes(search)
                  );
              })
            : [];

    // =========================================
    // HANDLE SEARCH
    // =========================================

    const handleSearchChange = (e) => {
        const value = e.target.value;

        setSearchTerm(value);
    };

    const handleSearchResultClick = (path) => {
        setSearchTerm("");
        navigate(path);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (filteredSearchResults.length > 0) {
                handleSearchResultClick(
                    filteredSearchResults[0].path
                );
            }
        }

        if (e.key === "Escape") {
            setSearchTerm("");
        }
    };

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setProfileOpen(false);
        setMobileMenuOpen(false);
        setSearchTerm("");

        navigate("/login");
    };

    // =========================================
    // CLOSE SEARCH
    // =========================================

    const handleSearchBlur = () => {
        // Small delay allows click on search result
        setTimeout(() => {
            setSearchTerm("");
        }, 200);
    };

    return (
        <div className="dashboard-layout">

            {/* =====================================
                MOBILE MENU BUTTON
            ====================================== */}

            <button
                className="mobile-menu-button"
                onClick={() =>
                    setMobileMenuOpen(
                        !mobileMenuOpen
                    )
                }
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? (
                    <X size={22} />
                ) : (
                    <Menu size={22} />
                )}
            </button>


            {/* =====================================
                SIDEBAR
            ====================================== */}

            <aside
                className={`sidebar ${
                    mobileMenuOpen
                        ? "sidebar-mobile-open"
                        : ""
                }`}
            >

                {/* Logo */}

                <div className="sidebar-logo">

                    <div className="brand-logo">

                        <div className="brand-emblem">
                            Defence
                        </div>

                        <div>
                            <h2>DALMS</h2>

                            <p>
                                Asset Management
                            </p>
                        </div>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="sidebar-nav">

                    {visibleMenuItems.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            const isActive =
                                location.pathname ===
                                item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className={
                                        isActive
                                            ? "menu-item active"
                                            : "menu-item"
                                    }
                                >

                                    <Icon size={18} />

                                    <span>
                                        {item.name}
                                    </span>

                                </Link>
                            );
                        }
                    )}

                </nav>


                {/* Sidebar Bottom */}

                <div className="sidebar-bottom">

                    <button
                        className="sidebar-logout"
                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut size={19} />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="main-content">


                {/* =================================
                    TOPBAR
                ================================== */}

                <header className="topbar">


                    {/* Topbar Left */}

                    <div className="topbar-left">

                        <div>

                            <h1>
                               DALMS - Defence Asset & Logistics
                                Management System
                            </h1>

                            <p className="topbar-subtitle">
                                Asset management and
                                logistics dashboard
                            </p>

                        </div>

                    </div>


                    {/* Topbar Right */}

                    <div className="topbar-right">


                        {/* =================================
                            SEARCH
                        ================================== */}

                        <div className="topbar-search-wrapper">

                            <div className="topbar-search">

                                <Search size={18} />

                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    value={
                                        searchTerm
                                    }
                                    onChange={
                                        handleSearchChange
                                    }
                                    onKeyDown={
                                        handleSearchKeyDown
                                    }
                                    onBlur={
                                        handleSearchBlur
                                    }
                                />

                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="search-clear-button"
                                        onMouseDown={(e) =>
                                            e.preventDefault()
                                        }
                                        onClick={() =>
                                            setSearchTerm(
                                                ""
                                            )
                                        }
                                    >
                                        <X size={15} />
                                    </button>
                                )}

                            </div>


                            {/* Search Results */}

                            {searchTerm.trim() && (
                                <div className="topbar-search-results">

                                    {filteredSearchResults.length >
                                    0 ? (
                                        filteredSearchResults.map(
                                            (result) => {
                                                const ResultIcon =
                                                    result.icon;

                                                return (
                                                    <button
                                                        key={
                                                            result.path
                                                        }
                                                        type="button"
                                                        className="search-result-item"
                                                        onMouseDown={(
                                                            e
                                                        ) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() =>
                                                            handleSearchResultClick(
                                                                result.path
                                                            )
                                                        }
                                                    >

                                                        <div className="search-result-icon">
                                                            <ResultIcon
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <div className="search-result-content">

                                                            <strong>
                                                                {
                                                                    result.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    result.path
                                                                }
                                                            </span>

                                                        </div>

                                                    </button>
                                                );
                                            }
                                        )
                                    ) : (
                                        <div className="search-no-results">

                                            <Search
                                                size={20}
                                            />

                                            <div>
                                                <strong>
                                                    No results
                                                </strong>

                                                <span>
                                                    No page found for "
                                                    {
                                                        searchTerm
                                                    }
                                                    "
                                                </span>
                                            </div>

                                        </div>
                                    )}

                                </div>
                            )}

                        </div>


                        {/* =================================
                            NOTIFICATIONS
                        ================================== */}

                        <NotificationDropdown />


                        {/* =================================
                            PROFILE
                        ================================== */}

                        <div className="profile-container">

                            <button
                                className="profile-button"
                                onClick={() =>
                                    setProfileOpen(
                                        !profileOpen
                                    )
                                }
                            >

                                {/* Avatar */}

                                <div className="profile-avatar">

                                    {user?.profilePhoto ? (

                                        <img
                                            src={
                                                user.profilePhoto
                                            }
                                            alt={
                                                user.fullName ||
                                                "User"
                                            }
                                        />

                                    ) : (

                                        <UserCircle
                                            size={25}
                                        />

                                    )}

                                </div>


                                {/* User Information */}

                                <div className="profile-info">

                                    <strong>
                                        {user?.fullName ||
                                            "User"}
                                    </strong>

                                    <span>
                                        {user?.role ||
                                            "User"}
                                    </span>

                                </div>


                                {/* Dropdown Arrow */}

                                <ChevronDown
                                    size={17}
                                    className={
                                        profileOpen
                                            ? "chevron-rotate"
                                            : ""
                                    }
                                />

                            </button>


                            {/* =================================
                                PROFILE DROPDOWN
                            ================================== */}

                            {profileOpen && (

                                <div className="profile-dropdown">


                                    {/* Dropdown Header */}

                                    <div className="profile-dropdown-header">

                                        <div className="profile-avatar large">

                                            {user?.profilePhoto ? (

                                                <img
                                                    src={
                                                        user.profilePhoto
                                                    }
                                                    alt={
                                                        user.fullName ||
                                                        "User"
                                                    }
                                                />

                                            ) : (

                                                <UserCircle
                                                    size={34}
                                                />

                                            )}

                                        </div>


                                        <div>

                                            <strong>
                                                {user?.fullName ||
                                                    "User"}
                                            </strong>

                                            <span>
                                                {user?.role ||
                                                    "User"}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Divider */}

                                    <div className="profile-dropdown-divider"></div>


                                    {/* My Profile */}

                                    <Link
                                        to="/profile"
                                        className="profile-dropdown-item"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                    >

                                        <UserCircle
                                            size={18}
                                        />

                                        <span>
                                            My Profile
                                        </span>

                                    </Link>


                                    {/* Admin Management */}

                                    {isAdmin && (

                                        <Link
                                            to="/admin-management"
                                            className="profile-dropdown-item"
                                            onClick={() =>
                                                setProfileOpen(
                                                    false
                                                )
                                            }
                                        >

                                            <ShieldCheck
                                                size={18}
                                            />

                                            <span>
                                                Admin Management
                                            </span>

                                        </Link>

                                    )}


                                    {/* Logout */}

                                    <button
                                        className="profile-dropdown-item logout-item"
                                        onClick={
                                            handleLogout
                                        }
                                    >

                                        <LogOut
                                            size={18}
                                        />

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </header>


                {/* =====================================
                    PAGE CONTENT
                ====================================== */}

                <section className="page-content">

                    <Outlet />

                </section>

            </main>

        </div>
    );
};

export default DashboardLayout;