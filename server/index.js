
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const mongoose = require("mongoose")
const cors = require('cors');
const { userJoin, getUsers, userLeave } = require("./utils/user");
dotenv.config();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);

});
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/room', roomRoutes);

let imageUrl, userRoom;
const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    socket.on("user-joined", (data) => {
        const { roomId, userId, userName, host, presenter } = data;
        userRoom = roomId;
        socket.join(roomId);
        const users = userJoin(userId, userName, roomId, host, presenter)
        socket.emit("joinUsers", { success: true });
        socket.broadcast.to(roomId).emit("whiteBoardData", {
            imageUrl: imageUrl,
        });

    });

    socket.on("drawing", (data) => {
        // console.log("drawing::", userRoom);
        imageUrl = data;
        socket.broadcast.to(userRoom).emit("whiteBoardData", { imageUrl: data });
    });

    socket.on("disconnect", () => {
        const userLeaves = userLeave(socket.id);
        const roomUsers = getUsers(userRoom);
        console.log("disconnect::", roomUsers, socket.id);
        if (userLeaves) {
            io.to(userLeaves.room).emit("message", {
                message: `${userLeaves.username} left the chat`,
            });
            io.to(userLeaves.room).emit("users", roomUsers);
        }
    });
});

