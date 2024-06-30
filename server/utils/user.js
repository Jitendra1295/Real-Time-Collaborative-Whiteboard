const { addRoom } = require("../controllers/roomController");

const users = [];

// Join user to chat
const userJoin = async (id, username, room, host, presenter) => {
    const user = { id, username, room, host, presenter };
    users.push(user);
    console.log("userJoin::", users);
    if (presenter) {
        const newRoom = await addRoom(id, username, room, host, presenter)
    }
    return users.filter((user) => user.room === room);
};
// User leaves chat
const userLeave = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

//get users
const getUsers = (room) => {
    const RoomUsers = [];
    users.map((user) => {
        if (user.room == room) {
            RoomUsers.push(user);
        }
    });

    return RoomUsers;
};

const getUserInRoom = (roomId) => {
    return users.filter((user) => { user.room === roomId })
}

module.exports = {
    userJoin,
    userLeave,
    getUsers,
    getUserInRoom
};