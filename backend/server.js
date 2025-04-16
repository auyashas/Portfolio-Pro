const express = require('express');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio_pro'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
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

// ✅ Check if email exists
app.post('/check-email', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const sql = 'SELECT email FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        return res.json({ exists: result.length > 0 });
    });
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
app.post('/verify-otp', (req, res) => {
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

        db.query(sql, values, (err) => {
            if (err) {
                console.error('Registration error:', err);
                return res.status(500).json({ success: false, message: 'User already exists or database error' });
            }

            return res.status(200).json({ success: true, message: 'User registered successfully' });
        });

    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// ✅ Login
// ✅ Login Route
// ✅ Login Route with HttpOnly cookie
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Input validation: Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        // Query the database to check if the email exists
        const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            // Check if user exists in the database
            if (results.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            // Create user payload to store in session cookie
            const userPayload = {
                id: user.id,
                role: user.role,
                email: user.email
            };

            // Set session cookie with user details (store it for 1 day)
            res.cookie('user_session', JSON.stringify(userPayload), {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: userPayload
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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


// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
