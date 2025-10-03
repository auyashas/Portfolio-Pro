# 💼 Portfolio Pro

**Portfolio Pro** is a basic freelancing platform built using React.js, Node.js, and MySQL. It allows freelancers to register and upload their resumes, and upon admin approval, their profiles are listed for clients to view. Clients can directly contact freelancers using the information displayed. Admins can review and manage freelancer applications through a secure interface.

---

## 🔧 Tech Stack

* **Frontend:** React.js (Vite)
* **Backend:** Node.js + Express
* **Database:** MySQL
* **Tools Used:** VS Code, Nodemon

---

## 📌 Features

### 👤 Freelancer Module

* Register with personal details, skills, and resume upload
* Login after admin approval
* Update personal details from profile section

### 🔐 Admin Module

* Secure login
* View, approve, or reject freelancer applications
* View/download resumes of applicants
* Job management

### 👁️ Client Module

* View list of approved freelancers
* Download resumes
* Access freelancer contact info directly
* Hire freelancers

---

## 🗂️ Project Structure

```
/backend → Node.js backend
├── uploads
│   ├── profile_pics
│   ├── resumes
│   └── default-user.png
├── utils
│   └── sendEmail.js
├── .env
├── package.json
├── package-lock.json
└── server.js

/frontend → React.js (Vite-based frontend)  
├── public
├── src
│   ├── assets
│   ├── components
│   ├── hooks
│   ├── icons
│   ├── pages
│   ├── styles
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── Layout.jsx
│   ├── main.jsx
│   └── ProtectedRoute.jsx
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

/.gitattributes
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/auyashas/portfolio-pro.git
cd portfolio-pro
```

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Setup Database

* Open MySQL or phpMyAdmin
* Import the SQL schema (based on structure below)
* Update `.env` file with your database credentials

---

## 🗃️ Database Schema

### 📦 Database Overview

```
Database: portfolio_pro

Tables:
├── users       → Stores login credentials and personal info of freelancers, clients, and admins
├── freelancer  → Stores freelancer-specific profile and resume details
└── jobs        → Stores client-submitted job requests for freelancers
```

---

### 🔹 `users`

Stores credentials and personal details for all users (freelancers, clients, and admin).

```sql
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    role ENUM('freelancer','client','admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 🔹 `freelancer`

Stores freelancer-specific profile data.

```sql
CREATE TABLE freelancer (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) NOT NULL,
    title VARCHAR(100),
    bio TEXT,
    skills TEXT,
    experience VARCHAR(100),
    resume_path VARCHAR(255),
    profile_pic_path VARCHAR(255),
    social_links TEXT,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 🔹 `jobs`

Stores job requests submitted by clients for freelancers.

```sql
CREATE TABLE jobs (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    freelancer_id INT(11) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    client_id INT(11) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_contact VARCHAR(20) NOT NULL,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (freelancer_id) REFERENCES freelancer(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 👨‍💻 Developed By

* A.U Yashas
* Preetham
* Harshith R Shetty

---

## 📜 License

This project is developed for educational purposes only and is not intended for commercial deployment.
