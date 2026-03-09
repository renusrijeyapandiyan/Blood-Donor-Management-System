# Blood-Donor-Management-System

# 🩸 Blood Management System

A **Full Stack Web Application** developed to manage blood donation and blood requests efficiently between **Donors, Patients, Hospitals, and Admin**.
The system helps hospitals find suitable donors quickly and allows patients to request blood easily.

---

# 📌 Project Overview

The **Blood Management System** is designed to digitize the blood donation process. It connects **blood donors, patients, hospitals, and administrators** on one platform.

The system allows:

* Donors to register and make themselves available for blood donation.
* Patients to search for donors and send blood requests.
* Hospitals to approve or manage blood requests.
* Admin to monitor all system activities.

This system improves **response time during emergencies** and ensures **efficient blood resource management**.

---

# 🚀 Features

## 👤 Donor

* Register and login as a donor
* View donor dashboard
* View all donors
* Search donors by **location and blood group**
* View personal profile

## 🧑‍⚕️ Patient

* Register and login as a patient
* View available donors
* Search donors by **name, location, blood group**
* Send blood request
* Track request status
* View profile

## 🏥 Hospital

* Login as hospital
* View all blood requests
* Approve blood requests
* View donor list
* Search donors

## 👨‍💻 Admin

* View system dashboard
* Monitor donors, patients, and hospitals
* View blood request analytics
* Manage users

---

# 🛠️ Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript
* Font Awesome

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JSON Web Token (JWT)

---

# 📂 Project Structure

```
Blood-Management-System
│
├── models
│   ├── User.js
│   ├── BloodRequest.js
│   └── BloodStock.js
│
├── routes
│   ├── authRoutes.js
│   ├── donorRoutes.js
│   ├── patientRoutes.js
│   ├── hospitalRoutes.js
│   └── adminRoutes.js
│
├── middleware
│   └── auth.js
│
├── public
│   ├── login.html
│   ├── register.html
│   ├── donor.html
│   ├── patient.html
│   ├── hospital.html
│   └── admin.html
│
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Follow these steps to run the project locally.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/blood-management-system.git
```

---

## 2️⃣ Navigate to Project Folder

```bash
cd blood-management-system
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file in the root folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 5️⃣ Run the Server

```bash
node server.js
```

or

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

---

# 🔑 Authentication

The system uses **JWT (JSON Web Token)** for authentication.

Each user receives a **token after login** which is used to access protected routes.

Roles supported:

* Admin
* Donor
* Patient
* Hospital

---

# 📊 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Patient

```
GET /api/patient/donors
POST /api/patient/request
GET /api/patient/status
```

## Hospital

```
GET /api/hospital/requests
PUT /api/hospital/approve/:id
GET /api/hospital/donors
```

## Admin

```
GET /api/admin/users
GET /api/admin/requests
GET /api/admin/analytics
```

---

# 🧪 Example Use Case

1. Donor registers and becomes available.
2. Patient searches donors based on blood group and location.
3. Patient sends a blood request.
4. Hospital reviews and approves the request.
5. Admin monitors all activities through the dashboard.

---

# 🔒 Security Features

* JWT Authentication
* Password encryption
* Protected routes with middleware
* Role-based access control

---

# 📈 Future Improvements

* SMS notification to donors
* Email alerts
* Blood stock management
* Mobile application
* Google Maps location integration
* Real-time emergency alerts

---

# 👨‍💻 Author

**Your Name**
J.Renu Sri
Blood Donor Management System

---

# 📜 License

This project is for **educational purposes**.
