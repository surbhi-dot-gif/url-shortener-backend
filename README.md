URL Shortener – MERN Stack

A production-ready URL shortening application built with the MERN stack. The project includes secure user authentication using JWT, URL analytics, responsive UI, and cloud deployment on Render and Vercel.

Features

URL shortening with unique shortcode generation

User authentication using JSON Web Tokens (JWT)

Click tracking and analytics for each short URL

Responsive and clean user interface built with React and Tailwind CSS

RESTful backend API using Express and MongoDB Atlas

Full deployment using Render (backend) and Vercel (frontend)

Tech Stack

Frontend: React (Vite), Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas, Mongoose
Authentication: JWT
Deployment: Render (API) and Vercel (UI)

Project Structure
url-shortener-backend/
    models/
    routes/
    middleware/
    server.js
    app.js

new-frontend/
    src/
    components/
    pages/
    utils/
    App.jsx
    main.jsx

Environment Variables

This project requires environment variables for backend (JWT secret, MongoDB connection, etc.) and frontend (API base URL).
Create a .env file in both the backend and frontend folders based on the examples provided in the codebase.

Backend

Contains variables for database connection, JWT configuration, and application base URL.
Check server.js and related configuration files for required keys.

Frontend

Contains the API base URL used to communicate with the backend.

Note: Actual credentials and production secrets should not be committed to GitHub.
Refer to your local .env files or deployment environment settings (Render, Vercel) for the correct configuration.

Frontend (.env)
VITE_API_BASE_URL=https://url-shortener-backend-wvhf.onrender.com

Running Locally
Backend
cd url-shortener-backend
npm install
npm start

Frontend
cd new-frontend
npm install
npm run dev

API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Create account
POST	/api/auth/login	Authenticate user
URL Shortening
Method	Endpoint	Description
POST	/api/shorten	Create a new short URL
GET	/:code	Redirect to original URL
GET	/api/stats/:code	Get analytics for a URL
Deployment
Backend

Hosted on Render as a Node service with environment variables configured for MongoDB, JWT, and BASE_URL.

Frontend

Hosted on Vercel using the Vite build pipeline and environment variable for API base URL.

Live Demo

Frontend: https://new-frontend-orcin.vercel.app/
Backend API: https://url-shortener-backend-wvhf.onrender.com

Future Improvements

User dashboard with all created URLs

Analytics charts and insights

Custom short codes

Rate limiting and abuse protection

Custom domain support

License

This project is open-source and available under the MIT License.
