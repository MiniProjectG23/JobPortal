Project - Job Portal
Ongoing Project of MERN Stack based Online Job Portal - Server (API)

Introduction
Welcome to Project Job Portal, a comprehensive backend solution for a job-seeking portal. This project aims to provide a seamless and efficient platform for job seekers and employers to connect. Job seekers can find and apply for jobs, while employers can post job listings and search for potential employees. This repository contains the server-side code, including routing, controllers, middleware, and database configurations.

Features
User Authentication and Authorization: Separate login systems for job seekers and employers.

Job Management: Employers can post jobs, and job seekers can search and apply for jobs.

Detailed Job Descriptions: Each job posting contains comprehensive details to help job seekers make informed decisions.

Error Handling: Robust middleware for handling errors and asynchronous operations.

Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Web application framework for Node.js.

MongoDB: NoSQL database for storing user and job data.

Mongoose: ODM for MongoDB and Node.js.

JWT: For user authentication and authorization.

FastAPI (Python Backend): For AI-powered features and document processing.

Uvicorn: ASGI server for FastAPI.

Pillow, pdf2image, google-generativeai, markdown, python-dotenv: Supporting libraries for the Python backend.

Getting Started
Follow these steps to run the project locally:

1. Run the Client (React Frontend)
bash
Copy
Edit
cd client
npm install
npm run dev
2. Run the Node.js Server
bash
Copy
Edit
cd server
npm install
npm start
3. Run the Python Backend (for AI or document-related services)
bash
Copy
Edit
cd server/python_backend
.\venv\Scripts\activate        # On Windows
pip install fastapi uvicorn Pillow pdf2image google-generativeai markdown python-dotenv
uvicorn main:app --reload
