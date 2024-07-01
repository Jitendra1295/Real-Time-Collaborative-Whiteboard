# Real-Time Collaborative Whiteboard

## Overview

This project is a real-time collaborative whiteboard application built using Next.js, Node.js, and MongoDB. The application supports drawing, text editing, real-time collaboration, and user authentication. It leverages WebSocket for real-time communication and MongoDB for data storage.

## Features

- Real-time drawing and text editing
- User authentication (sign up, login)
- Join rooms to collaborate with others
- Server-side rendering with Next.js
- WebSocket integration for real-time updates
- State management using Redux or React Context API
- MongoDB for data storage

## Tech Stack

- **Frontend:** Next.js, React, Redux/React Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Real-time Communication:** WebSocket (Socket.io)
- **Authentication:** JWT (JSON Web Tokens)



## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/real-time-collaborative-whiteboard.git
   cd real-time-collaborative-whiteboard
   
## Set up your .env file:

Create a .env file in the root directory of your project and add the following environment variables:

PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

## Start the development server
note:This will start the Next.js development server

cd client 
npm i
npm run dev

cd server
npm i 
nodemon index.js



