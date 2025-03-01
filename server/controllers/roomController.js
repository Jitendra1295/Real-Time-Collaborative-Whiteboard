const Room = require('../model/room');
const Feedback = require("../model/feedback")

async function addRoom(id, username, room) {
    const data = {
        createdBy: id,
        name: username,
        roomId: room,
        status: "active"
    };

    try {
        const newRoom = new Room(data); // Create a new instance of Room
        await newRoom.save(); // Save the new room instance to the database
        return newRoom; // Return the saved room object
    } catch (error) {
        throw error;
    }
}
async function update(req, res) {
    const { roomId } = req.params;
    const updates = req.body;

    try {
        const room = await Room.findOneAndUpdate(
            { roomId: roomId },
            updates,
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getActiveRoom(req, res) {
    try {
        const room = await Room.find(
            { status: "active" }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function addFeedback(req, res) {
    const { userId, feedback } = req.body;
    const data = {
        userId, feedbackText: feedback
    };
    console.log("addFeedback ::", userId, feedback);

    try {
        const addFeedback = new Feedback(data);
        await addFeedback.save();
        console.log("addFeedback ::", addFeedback);
        return res.status(200).json(addFeedback);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addRoom,
    update,
    getActiveRoom,
    addFeedback
};
