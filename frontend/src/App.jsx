import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Home from './pages/Home';
import Register from './pages/Register';
import About from './pages/About';
import Profile from './pages/Profile';
import FreelancerHome from './pages/FreelancerHome';
import ClientHome from './pages/ClientHome';
import AdminHome from './pages/AdminHome';
import { useSession } from './hooks/useSession';

// ✅ Protected Route Component
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useSession();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    const pathSegments = location.pathname.split('/');
    const urlId = pathSegments[pathSegments.length - 1];

    if (role === "admin" && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    if (role === "freelancer" && user.role === "freelancer" && user.id !== urlId) {
        return <Navigate to={`/freelancer/${user.id}`} replace />;
    }

    if (role === "client" && user.role === "client" && user.id !== urlId) {
        return <Navigate to={`/client/${user.id}`} replace />;
    }

    return children;
};

// ✅ Layout wrapper to hide Navbar on auth pages
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signup", "/register"];
    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            {children}
        </>
    );
};

// ✅ Main App Component
function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected Routes */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute role="freelancer">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/freelancer/:id"
                        element={
                            <ProtectedRoute role="freelancer">
                                <FreelancerHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/client/:id"
                        element={
                            <ProtectedRoute role="client">
                                <ClientHome />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
