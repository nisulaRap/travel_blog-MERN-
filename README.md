# Travel Blog - MERN

## Overview
Travel Blog is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack with Vite for fast development. This application allows users to explore and share travel stories, upload images, and interact with stories through features like favorites, search, and filtering.

## Key Features
- **User Authentication:** Secure login and signup functionality using JWT authentication.
- **Upload Image:** Users can upload images along with their travel stories.
- **Update isFavourite:** Users can mark/unmark travel stories as favorite.
- **Search Travel Stories:** Users can search for travel stories using keywords.
- **Filter Travel Stories by Date Range:** Users can filter stories based on a selected date range.

## Tech Stack
- **Frontend:** React (with Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer (for image uploads)
- **Authentication:** JSON Web Token (JWT)

## Installation
### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (MongoDB Atlas)

### Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/nisulaRap/travel_blog-MERN-.git
   cd travel_blog-MERN-
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   npm start
   ```
   Configure your MongoDB URI and JWT secret in a `.env` file.

3. **Frontend Setup:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
