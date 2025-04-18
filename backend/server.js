const express = require('express');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Content-Disposition'] 
}));

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// ✅ Use MySQL Pool instead of single connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio_pro',
    waitForConnections: true,
    connectionLimit: 10, // You can tweak this if needed
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection pool failed:', err);
    } else {
        console.log('✅ Connected to MySQL database via pool');
        connection.release(); // always release the connection after initial test
    }
});


// ✅ Nodemailer Transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Check if email exists
app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    try {
        const [rows] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        return res.json({ exists: rows.length > 0 });
    } catch (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


// ✅ Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const otp = generateOTP();

    try {
        await transporter.sendMail({
            from: `"Portfolio Pro" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <p>Hello!</p>
                <p>Your OTP code is <b>${otp}</b>.</p>
                <p>This OTP will expire in <b>1 minute</b>.</p>
            `
        });

        res.cookie('otp_cookie', JSON.stringify({ email, otp }), {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 1000,
            sameSite: 'Strict'
        });

        res.json({ success: true, message: "OTP sent to your email" });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// ✅ Verify OTP
app.post('/verify-otp', async(req, res) => {
    const { email, otp } = req.body;
    const otpCookie = req.cookies.otp_cookie;

    if (!otpCookie) {
        return res.status(400).json({ success: false, message: "OTP expired. Please request again." });
    }

    let storedData;
    try {
        storedData = JSON.parse(otpCookie);
    } catch {
        return res.status(400).json({ success: false, message: "Invalid OTP data." });
    }

    if (storedData.email !== email || storedData.otp !== otp) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP." });
    }

    res.clearCookie('otp_cookie');
    res.json({ success: true, message: "OTP verified successfully!" });
});

// ✅ Register
app.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        contactNumber,
        city,
        country,
        email,
        password,
        userType
    } = req.body;

    if (!email || !password || !firstName || !lastName || !contactNumber || !city || !country || !userType) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (email, password, first_name, last_name, contact, city, country, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            email,
            hashedPassword,
            firstName,
            lastName,
            contactNumber,
            city,
            country,
            userType
        ];

        await db.query(sql, values);

        return res.status(200).json({ success: true, message: 'User registered successfully' });

    } catch (err) {
        console.error('Registration error:', err);
        
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email is already registered. Please use a different email or login.' });
        }
    
        return res.status(500).json({ success: false, message: 'User may already exist or a DB error occurred' });
    }
    
});


// ✅ Login
// ✅ Login Route
// ✅ Login Route with HttpOnly cookie
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const userPayload = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        res.cookie('user_session', JSON.stringify(userPayload), {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userPayload
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.get('/check-session', (req, res) => {
    const sessionCookie = req.cookies.user_session;

    if (!sessionCookie) {
        return res.status(200).json({ isLoggedIn: false });
    }

    try {
        const sessionData = JSON.parse(sessionCookie);
        return res.status(200).json({
            isLoggedIn: true,
            role: sessionData.role
        });
    } catch (error) {
        return res.status(400).json({ isLoggedIn: false, message: "Invalid session data" });
    }
});

app.get('/freelancer/check/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    try {
        const connection = await db.getConnection();
        const [results] = await connection.query('SELECT * FROM freelancer WHERE user_id = ?', [userId]);
        connection.release();

        if (results.length === 0) {
            return res.status(200).json({ exists: false });
        }

        return res.status(200).json({ exists: true, data: results[0] });

    } catch (err) {
        console.error('[Profile Check] Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});



// Setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Check if the upload folder exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        if (file.fieldname === 'profilePicture') {
            const profilePicPath = 'uploads/profile_pics';
            // Check if the profile_pics folder exists, if not, create it
            if (!fs.existsSync(profilePicPath)) {
                fs.mkdirSync(profilePicPath);
            }
            cb(null, profilePicPath); // Path to save profile pictures
        } else if (file.fieldname === 'resume') {
            const resumePath = 'uploads/resumes';
            // Check if the resumes folder exists, if not, create it
            if (!fs.existsSync(resumePath)) {
                fs.mkdirSync(resumePath);
            }
            cb(null, resumePath); // Path to save resumes
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique name
    }
});

// Initialize multer without file filter (allow all file types)
const upload = multer({ storage: storage });

app.post('/freelancer/submit', upload.fields([ 
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), async (req, res) => {
    const { user_id, title, bio, skills,experience, social_links } = req.body;
    console.log(experience)
    const experienceValue = experience === '' ? 0 : experience;

    // Validate required fields
    if (!user_id || !title || !bio || !skills) {
        return res.status(400).json({
            message: 'Required fields: user_id, title, bio, skills'
        });
    }

    // Default fallback profile picture
    let profilePicPath = 'uploads/default-user.png';

    // Handle profile picture upload
    if (req.files['profilePicture']) {
        const pic = req.files['profilePicture'][0];
        const newFileName = `${Date.now()}-${pic.originalname}`;
        const newFilePath = path.join('uploads', 'profile_pics', newFileName);
        fs.renameSync(pic.path, newFilePath);
        profilePicPath = newFilePath;
    }

    // Handle resume upload
    let resumePath = null;
    if (req.files['resume']) {
        const resume = req.files['resume'][0];
        const resumeFileName = `${Date.now()}-${resume.originalname}`;
        const newResumePath = path.join('uploads', 'resumes', resumeFileName);
        fs.renameSync(resume.path, newResumePath);
        resumePath = newResumePath;
    }

    // Prepare SQL query
    const sql = `
        INSERT INTO freelancer (user_id, title, bio, skills, experience, resume_path, profile_pic_path, social_links, status)
        VALUES (?, ?, ?, ?, ?, ?,?, ?, 'Pending')
    `;

    try {
        const connection = await db.getConnection();
        await connection.query(sql, [user_id, title, bio, skills, experienceValue, resumePath, profilePicPath, social_links]);
        console.log('Profile submitted successfully!');
        connection.release();
        return res.status(200).json({ message: 'Profile submitted successfully with status: Pending' });
    } catch (err) {
        console.error('[Freelancer Submit] Insert error:', err);
        return res.status(500).json({ message: 'Error saving profile' });
    }
});



// GET all pending applications with user details
app.get('/admin/applications', async (req, res) => {
    try {
        const query = `
            SELECT 
                f.id AS freelancer_id,
                f.title,
                f.skills,
                f.experience,
                f.bio,
                f.profile_pic_path,
                f.resume_path,
                f.status,
                u.first_name,
                u.last_name,
                u.email,
                u.contact,
                u.city,
                u.country
            FROM freelancer f
            JOIN users u ON f.user_id = u.id
            WHERE f.status = 'Pending'
        `;
        
        const [pending] = await db.query(query);
        res.json(pending);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST: Approve or Reject a freelancer application
// POST: Approve or Reject a freelancer application
app.post('/admin/application/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approve', 'reject'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const newStatus = status === 'approve' ? 'Approved' : 'Rejected';

    try {
        // Fetch user info before making DB changes
        const [userResult] = await db.query(
            "SELECT u.email, u.first_name, u.last_name FROM users u JOIN freelancer f ON u.id = f.user_id WHERE f.id = ?",
            [id]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        const { email, first_name, last_name } = userResult[0];

        // Update or delete from freelancer table
        if (status === 'approve') {
            await db.query("UPDATE freelancer SET status = ? WHERE id = ?", [newStatus, id]);
        } else {
            await db.query("DELETE FROM freelancer WHERE id = ?", [id]);
        }

        // Setup Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Your Freelancer Application has been ${newStatus}`,
            text: status === 'approve'
                ? `Dear ${first_name} ${last_name},\n\nCongratulations! Your freelancer application has been approved. Your profile will be visible on our site.\n\nRegards,\nPortfolio Pro Team`
                : `Dear ${first_name} ${last_name},\n\nYour freelancer application has been rejected. Please log in and reapply with valid documents and info.\n\nRegards,\nPortfolio Pro Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ message: `Freelancer ${newStatus}` });

    } catch (error) {
        console.error("Error processing application:", error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.get('/download-resume/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'resumes', fileName);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName); // This forces the download
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// backend: routes/admin.js
app.get('/admin/dashboard', async (req, res) => {
    try {
        const connection = await db.getConnection();

        // Fetch freelancer details (joined with users)
        const [freelancers] = await connection.query(`
            SELECT 
                f.id,
                u.first_name,
                u.last_name,
                f.title,
                f.skills,
                f.status,
                f.resume_path
            FROM freelancer f
            JOIN users u ON f.user_id = u.id
        `);

        // Fetch client details
        const [clients] = await connection.query(`
            SELECT id, email, first_name AS firstname, last_name AS lastname, contact, city 
            FROM users 
            WHERE role = 'client'
        `);

        // Dashboard stats
        const [[{ total_users }]] = await connection.query(`SELECT COUNT(*) AS total_users FROM users WHERE role != 'admin'`);
        const [[{ total_freelancers }]] = await connection.query(`SELECT COUNT(*) AS total_freelancers FROM freelancer WHERE status = 'Approved'`);
        const [[{ total_pending }]] = await connection.query(`SELECT COUNT(*) AS total_pending FROM freelancer WHERE status = 'Pending'`);
        const [[{ total_clients }]] = await connection.query(`SELECT COUNT(*) AS total_clients FROM users WHERE role = 'client'`);

        connection.release();

        res.status(200).json({
            freelancers,
            clients,
            stats: {
                total_users,
                total_freelancers,
                total_pending,
                total_clients
            }
        });

    } catch (error) {
        console.error('[Admin Dashboard] Fetch error:', error);
        res.status(500).json({ message: 'Error loading dashboard data' });
    }
});


app.delete('/admin/freelancer/:id', async (req, res) => {
    const freelancerId = req.params.id;

    try {
        const connection = await db.getConnection();
        
        // Check if freelancer exists before deleting
        const [freelancer] = await connection.query('SELECT * FROM freelancer WHERE id = ?', [freelancerId]);
        if (!freelancer.length) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        await connection.query('DELETE FROM freelancer WHERE id = ?', [freelancerId]);
        
        connection.release();
        return res.status(200).json({ message: 'Freelancer deleted successfully' });
    } catch (err) {
        console.error('[Delete Freelancer]', err);
        return res.status(500).json({ message: 'Error deleting freelancer' });
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
