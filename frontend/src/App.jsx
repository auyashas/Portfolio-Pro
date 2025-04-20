import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
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
import AdminApplication from './pages/AdminApplication';
import JobApplications from './pages/JobApplications';
import AdminProfile from './pages/AdminProfile';
import ClientFreelancerProfile from './pages/ClientFreelancerProfile';
import AdminDashboard from './pages/AdminDashboard';
import JobRequest from './pages/jobRequest';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="register" element={<Register />} />
                    <Route path="about" element={<About />} />
                    <Route path="admin/about" element={<About />} />
                    <Route path="freelancer/:id/about" element={<About />} />
                    <Route path="client/:id/about" element={<About />} />

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
                        path="admin/applications"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminApplication />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin/dashboard"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard />
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

                    <Route path="/freelancer/:id/profile" element={<Profile />} />
                    <Route path="/admin/profile/:id" element={<AdminProfile />} />
                    <Route path="/client/:id/profile/:freelancerid" element={<ClientFreelancerProfile />} />
                    <Route path="/client/:id/job-requests" element={<JobRequest />} />
                    <Route path="/freelancer/:id/job-requests" element={<JobApplications />} />

                </Route>
            </Routes>
        </Router>
    );
}

export default App;
