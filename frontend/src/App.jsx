import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // 👈 Import the Layout you just created
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
import FreelancerApplication from './pages/FreelancerApplication';
import ProtectedRoute from './ProtectedRoute'; // If it's in a separate file

function App() {
    return (
        <Router>
            <Routes>
                {/* All Routes wrapped in the Layout */}
                <Route path="/" element={<Layout />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="register" element={<Register />} />
                    <Route path="about" element={<About />} />

                    {/* Protected Routes */}
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute role="freelancer">
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="freelancer/:id"
                        element={
                            <ProtectedRoute role="freelancer">
                                <FreelancerHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="client/:id"
                        element={
                            <ProtectedRoute role="client">
                                <ClientHome />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/freelancer/:id/freelancer-application"
                        element={<FreelancerApplication />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
