import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Assets from "./pages/Assets";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import AdminManagement from "./pages/AdminManagement";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
             <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/employees" element={<Employees/>} />
                    <Route path="/inventory" element={<Inventory/>} />
                    <Route path="/maintenance" element={<Maintenance/>} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route  path="/admin-management"
                     element={<AdminManagement />} 
                     />

   

                    
                </Route>
             </Route> 
            </Routes>
        </BrowserRouter>
    );
};

export default App;