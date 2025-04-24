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
        const [rows] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.json({
                exists: true,
                userId: rows[0].id,
                message: 'User found'
            });
        } else {
            return res.json({
                exists: false,
                message: 'User not found'
            });
        }
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
app.post('/verify-otp', async (req, res) => {
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

app.put('/password/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Run the update query
        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "No user found with this email." });
        }

        res.json({ success: true, message: "Password updated successfully." });

    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
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
            role: sessionData.role,
            id: sessionData.id
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
    const { user_id, title, bio, skills, experience, social_links } = req.body;
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
                u.id AS user_id,
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

        // Fetch user info before making DB changes
        const { email, first_name, last_name } = userResult[0];
        const [clients] = await db.query(
            "select * from jobs where freelancer_id = ?",
            [id]
        );

        for (let i = 0; i < clients.length; i++) {
            const { client_email, client_name } = clients[i];
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: client_email,
                subject: `Freelancer Account Update`,
                text: `Dear ${client_name},\n\nWe regret to inform you that the freelancer ${first_name} ${last_name} associated with your job has had their account blocked or deleted. We apologize for any inconvenience this may have caused.\n\nIf you need further assistance or wish to contact the freelancer directly, please feel free to do so. Freelancer email:${email}\n\nThank you for your understanding.\n\nBest regards,\nPortfolio Pro Team`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email sending failed:', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }

        // Update or delete from freelancer table
        if (status === 'approve') {
            await db.query("UPDATE freelancer SET status = ? WHERE id = ?", [newStatus, id]);
        } else {
            await db.query("DELETE FROM jobs WHERE freelancer_id = ?", [id]);
            await db.query("DELETE FROM freelancer WHERE id = ?", [id]);
        }

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
                f.user_id,
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
        // Add this query inside the /admin/dashboard route after your existing stats queries
        const [[{ total_not_applied }]] = await connection.query(`SELECT COUNT(*) AS total_not_applied FROM users WHERE role = 'freelancer' AND id NOT IN (SELECT user_id FROM freelancer)`);


        connection.release();

        res.status(200).json({
            freelancers,
            clients,
            stats: {
                total_users,
                total_freelancers,
                total_pending,
                total_clients,
                total_not_applied
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

        // Step 1: Check if freelancer exists and get user details
        const [freelancerInfo] = await connection.query(`
            SELECT u.email, u.first_name, u.last_name
            FROM freelancer f
            JOIN users u ON f.user_id = u.id
            WHERE f.id = ?
        `, [freelancerId]);

        if (!freelancerInfo.length) {
            connection.release();
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        const { email, first_name, last_name } = freelancerInfo[0];

        // Step 2: Delete freelancer
        await connection.query('DELETE FROM freelancer WHERE id = ?', [freelancerId]);
        connection.release();

        // Step 3: Send email (after deletion)
        const subject = 'Freelancer Account Deleted';
        const body = `
            Dear ${first_name} ${last_name},

            Your freelancer profile has been deleted by the admin.

            If you believe this was done in error, feel free to contact our support team.
        `;

        await sendEmail(email, subject, body);

        return res.status(200).json({ message: 'Freelancer deleted and email sent successfully.' });
    } catch (err) {
        console.error('[Delete Freelancer]', err);
        return res.status(500).json({ message: 'Error deleting freelancer' });
    }
});

app.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await db.query(`
            SELECT 
                u.first_name, u.last_name, u.email, u.contact, u.city, u.country,
                f.title, f.bio, f.skills, f.experience, f.resume_path, f.profile_pic_path, f.social_links, f.status
            FROM users u
            JOIN freelancer f ON u.id = f.user_id
            WHERE u.id = ?
        `, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/profile/:id/update', async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, bio, contact, city, country } = req.body;

    let connection;

    try {
        // Get a connection from the pool
        connection = await db.getConnection();

        // Start a transaction
        await connection.beginTransaction();

        // Update the freelancer profile (bio field)
        const [freelancerResult] = await connection.query(`
            UPDATE freelancer
            SET bio = ?
            WHERE user_id = ?
        `, [bio, userId]);

        if (freelancerResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Freelancer profile not found or no changes made" });
        }

        // Update the user's contact, city, country, and name fields
        const [userResult] = await connection.query(`
            UPDATE users
            SET first_name = ?, last_name = ?, contact = ?, city = ?, country = ?
            WHERE id = ?
        `, [first_name, last_name, contact, city, country, userId]);

        if (userResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "User profile not found or no changes made" });
        }

        // Commit the transaction if both updates were successful
        await connection.commit();

        // Return a success message
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        if (connection) await connection.rollback();  // Rollback in case of error
        console.error("❌ Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.release();  // Always release the connection back to the pool
    }
});

app.get('/admin/profile/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await db.query(`
            SELECT 
                u.first_name, u.last_name, u.email, u.contact, u.city, u.country,
                f.title, f.bio, f.skills, f.experience, f.resume_path, f.profile_pic_path, f.social_links, f.status,f.id
            FROM users u
            JOIN freelancer f ON u.id = f.user_id
            WHERE u.id = ?
        `, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/hire-freelancer', async (req, res) => {
    const { freelancer_id, job_title, description, client_id, client_name, client_email, client_contact } = req.body;

    if (!freelancer_id || !job_title || !description || !client_id || !client_name || !client_email || !client_contact) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Retrieve the freelancer ID from the user_id
        const [freelancerInfo] = await db.query(
            `SELECT freelancer.id AS freelancer_id
             FROM freelancer
             WHERE freelancer.user_id = ?`,
            [freelancer_id]
        );

        if (freelancerInfo.length === 0) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        const fid = freelancerInfo[0].freelancer_id;

        // Insert job with the freelancer_id
        const [result] = await db.query(
            `INSERT INTO jobs (freelancer_id, job_title, description, client_id, client_name, client_email, client_contact)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [fid, job_title, description, client_id, client_name, client_email, client_contact]
        );

        // Fetch freelancer's email and full name
        const [freelancerDetails] = await db.query(
            `SELECT users.email AS freelancer_email, users.first_name, users.last_name
             FROM freelancer
             JOIN users ON freelancer.user_id = users.id
             WHERE freelancer.id = ?`,
            [fid]
        );

        if (freelancerDetails.length === 0) {
            return res.status(404).json({ message: 'Freelancer details not found' });
        }

        const { freelancer_email, first_name, last_name } = freelancerDetails[0];
        const freelancer_fullname = `${first_name} ${last_name}`;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: freelancer_email,
            subject: `New Job Application - "${job_title}"`,
            html: `
                <p>Hi ${freelancer_fullname},</p>
                <p>You have received a new job request from a client.</p>
                <h3>Job Details:</h3>
                <ul>
                    <li><strong>Title:</strong> ${job_title}</li>
                    <li><strong>Description:</strong> ${description}</li>
                </ul>
                <h3>Client Contact:</h3>
                <ul>
                    <li><strong>Name:</strong> ${client_name}</li>
                    <li><strong>Email:</strong> ${client_email}</li>
                    <li><strong>Phone:</strong> ${client_contact}</li>
                </ul>
                <p>Please login to your account to accept or reject this job request.</p>
                <p>Thank you,<br/>Portfolio Pro Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'Job request submitted and email sent', jobId: result.insertId });
    } catch (err) {
        console.error('❌ Error during job request or email sending:', err);
        return res.status(500).json({ message: 'Server error while processing job request' });
    }
});



app.get("/job-requests/:id", async (req, res) => {
    const client_id = req.params.id;
    try {
        console.log(client_id);
        const connection = await db.getConnection();

        const [rows] = await connection.query(`
            SELECT 
                j.id AS job_id,
                CONCAT(u.first_name, ' ', u.last_name) AS freelancer_name,
                u.email AS freelancer_email,
                j.job_title,
                j.status
            FROM jobs j
            JOIN freelancer f ON j.freelancer_id = f.id
            JOIN users u ON f.user_id = u.id
            WHERE j.client_id = ?`,
            [client_id]);

        connection.release();
        res.json(rows);
    } catch (error) {
        console.error("❌ Error fetching job requests:", error);
        res.status(500).json({ error: "Failed to fetch job requests" });
    }
});

app.get('/freelancer/:id/job-requests/:status', async (req, res) => {
    const userId = req.params.id; // This is the user's id which corresponds to freelancer.user_id
    const status = req.params.status;

    try {
        // First, get the freelancer's freelancer.id based on the user_id (freelancer.user_id)
        const [freelancer] = await db.query(
            'SELECT id FROM freelancer WHERE user_id = ?',
            [userId]
        );

        if (freelancer.length === 0) {
            return res.status(404).json({ message: "Freelancer not found" });
        }

        const freelancerId = freelancer[0].id;

        // Now, use the freelancer.id to fetch job requests from the jobs table
        const [rows] = await db.query(
            `SELECT jobs.id, jobs.job_title, jobs.description, jobs.client_name, jobs.client_email, jobs.client_contact, jobs.status
             FROM jobs
             WHERE jobs.freelancer_id = ? AND status = ?
             ORDER BY jobs.id`,
            [freelancerId, status] // Use the freelancer.id here
        );


        res.json(rows);
    } catch (err) {
        console.error("Error fetching job requests:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ POST: Update job status (Approve/Reject)
app.post('/freelancer/job-status/:id', async (req, res) => {
    const jobId = req.params.id;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const [result] = await db.query(
            "UPDATE jobs SET status = ? WHERE id = ?",
            [status, jobId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job not found" });
        }
        const [client] = await db.query(
            'SELECT id,client_name,client_email FROM jobs WHERE id = ?',
            [jobId]
        );
        if (client.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }
        const clientEmail = client[0].client_email;
        const clientName = client[0].client_name;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: `Your Freelancer Application has been ${status}`,
            html: status === 'Approved' ? `
                <p>Hi ${clientName},</p>
                <p>Your job request of id ${jobId} has been successfully accepted by the freelancer. Thank you for using our platform.</p>
                <p>Thank you,<br/>Portfolio Pro Team</p>
            `:
                `
                <p>Hi ${clientName},</p>
                <p>Your job request of id ${jobId} has been declined by the freelancer. We appreciate your interest in our platform and encourage you to explore other talented freelancers for your projects.</p>
                <p>Thank you,<br/>Portfolio Pro Team</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({ message: `Job status updated to ${status}` });
    } catch (err) {
        console.error("Error updating job status:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/freelancers/approved", async (req, res) => {
    try {
        const [freelancers] = await db.query(`
        SELECT 
          f.id AS freelancer_id,
          f.user_id,
          f.title,
          f.skills,
          f.experience,
          f.profile_pic_path,
          u.first_name,
          u.last_name
        FROM freelancer f
        JOIN users u ON f.user_id = u.id
        WHERE f.status = 'Approved'
      `);

        res.json(freelancers);
    } catch (error) {
        console.error("Error fetching approved freelancers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});