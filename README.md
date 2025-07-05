# 💼 Portfolio Pro

**Portfolio Pro** is a basic freelancing platform built using React.js, Node.js, and MySQL. It allows freelancers to register and upload their resumes, and upon admin approval, their profiles are listed for clients to view. Clients can directly contact freelancers using the information displayed. Admins can review and manage freelancer applications through a secure interface.

---

## 🔧 Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Tools Used:** VS Code, Nodemon

---

## 📌 Features

### 👤 Freelancer Module
- Register with personal details, skills, and resume upload
- Login after admin approval
- Update personal details from profile section

### 🔐 Admin Module
- Secure login
- View, approve, or reject freelancer applications
- View/download resumes of applicants
- Job management

### 👁️ Client Module
- View list of approved freelancers
- Download resumes
- Access freelancer contact info directly
- Hire freelancers

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
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Setup Database

- Open MySQL or phpMyAdmin
- Import the SQL schema (based on structure below)
- Update `.env` file with your database credentials

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

| Column      | Type                            | Description                     |
|-------------|----------------------------------|---------------------------------|
| id          | int(11), PK, AUTO_INCREMENT     | Unique user ID                  |
| email       | varchar(255), UNIQUE            | User login email                |
| password    | varchar(255)                    | Hashed password                 |
| first_name  | varchar(100)                    | First name                      |
| last_name   | varchar(100)                    | Last name                       |
| contact     | varchar(20)                     | Contact number                  |
| city        | varchar(100) (nullable)         | City                            |
| country     | varchar(100) (nullable)         | Country                         |
| role        | enum('freelancer','client','admin') | Role of the user           |
| created_at  | timestamp DEFAULT CURRENT_TIMESTAMP | Created time               |

---

### 🔹 `freelancer`
Stores freelancer-specific profile data.

| Column           | Type                            | Description                      |
|------------------|----------------------------------|----------------------------------|
| id               | int(11), PK, AUTO_INCREMENT     | Unique freelancer ID             |
| user_id          | int(11), FK                     | Refers to `users.id`             |
| title            | varchar(100)                    | Professional headline            |
| bio              | text                            | Short bio                        |
| skills           | text                            | Skillset                         |
| experience       | varchar(100)                    | Experience info                  |
| resume_path      | varchar(255)                    | Uploaded resume path             |
| profile_pic_path | varchar(255)                    | Uploaded profile picture path    |
| social_links     | text                            | Portfolio or LinkedIn URL(s)     |
| status           | enum('Pending','Approved','Rejected') | Admin approval status     |
| created_at       | timestamp DEFAULT CURRENT_TIMESTAMP | Created time               |

---

### 🔹 `jobs`
Stores job requests submitted by clients for freelancers.

| Column         | Type                            | Description                      |
|----------------|----------------------------------|----------------------------------|
| id             | int(11), PK, AUTO_INCREMENT     | Unique job ID                    |
| freelancer_id  | int(11), FK                     | Refers to `freelancer.id`        |
| job_title      | varchar(255)                    | Job/project title                |
| description    | text                            | Detailed job description         |
| client_id      | int(11), FK                     | Refers to `users.id`             |
| client_name    | varchar(255)                    | Client name                      |
| client_email   | varchar(255)                    | Client email                     |
| client_contact | varchar(20)                     | Client phone number              |
| status         | enum('Pending','Approved','Rejected') | Status of the job         |
| created_at     | timestamp DEFAULT CURRENT_TIMESTAMP | Created time               |

---

## 👨‍💻 Developed By

- A.U Yashas  
- Preetham  
- Harshith R Shetty

---

## 📜 License

This project is developed for educational purposes only and is not intended for commercial deployment.
