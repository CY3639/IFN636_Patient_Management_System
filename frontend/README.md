# E-Prescription and Prescription Tracker

A full-stack MERN application for managing electronic prescriptions and drug tracking. Built as part of IFN636 Software Lifecycle Management coursework.
## Live Application

**Public URL**: [https://ec2-16-176-13-80.ap-southeast-2.compute.amazonaws.com/] as of 17/08/2025

**Demo Credentials**:

New credentials can be created by using "Register" function or existing credentials are as follow:

- **Doctor Dashboard**:
  - Username: `drwho@email.com`
  - Password: `1234`

- **Pharmacy Dashboard**:
  - Username: `pharmacy@email.com`
  - Password: `1234`
## Project Overview

This system enables doctors to create electronic prescriptions and send them directly to pharmacies via the portal. Key features include:

- Doctor authentication and dashboard
- CRUD operations for prescriptions
- Patient and pharmacy management

## Tech Stack

- **Frontend**: React.js (Create React App)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Deployment**: AWS EC2
- **Project Management**: Jira
## Prerequisites

Before running this project locally, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git
## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CY3639/ePrescription_project.git
cd ePrescription_project
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env:

# MONGODB_URI=mongodb://localhost:27017/eprescription
# JWT_SECRET=your_jwt_secret_here
# PORT=5001
npm run dev

```
The backend server will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend
# Install dependencies
npm install
# Start the React development server
npm start
```
The frontend will run on `http://localhost:3000`
### 4. Database Setup
Update your `.env` file with your MongoDB Atlas connection string.
## Available Scripts
### Frontend Scripts

In the `frontend` directory:
#### `npm start`

Runs the React app in development mode on [http://localhost:3000](http://localhost:3000).
### Backend Scripts

In the `backend` directory:
#### `npm run dev`
Starts the backend server with nodemon for development.
#### `npm test`
Runs backend tests.