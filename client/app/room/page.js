"use client";

import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../context/UserContext';
import { getAuthToken } from "../../utils/auth"

const JoinCreateRoom = ({ }) => {
    const [roomId, setRoomId] = useState(uuidv4());
    const [activeRooms, setActiveRooms] = useState([]);
    const [name, setName] = useState("");
    const [joinName, setJoinName] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [roomJoined, setRoomJoined] = useState("");
    const { user, setUser, socket } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (roomJoined) {
            console.log("roomJoined::", user);
            socket.emit("user-joined", user);
            router.push('/whiteboard');
        }
    }, [roomJoined]);
    useEffect(() => {
        const fetchActiveRooms = async () => {
            const token = await getAuthToken()
            console.log("getAuthToken::", token);
            try {
                const response = await fetch('http://localhost:8000/api/room/data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch active rooms');
                }

                const rooms = await response.json();
                console.log("rooms ::", rooms);
                const filterRoom = rooms.filter(item => item.createdBy !== user._id)
                setActiveRooms(filterRoom);
            } catch (error) {
                console.error('Error fetching active rooms:', error);
                // Handle error state in UI
            }
        };

        fetchActiveRooms();
    }, []);

    const generateUuid = () => {
        setRoomId(uuidv4())
    }
    console.log("user ::-->", user);
    const handleCreateSubmit = (e) => {

        e.preventDefault();
        if (!name) return toast.dark("Please enter your name!");
        setUser({
            ...user,
            roomId,
            userId: user?._id,
            userName: name,
            host: true,
            presenter: true,
        });
        setRoomJoined(true);
    };
    const handleJoinSubmit = (e) => {
        e.preventDefault();
        if (!joinName) return toast.dark("Please enter your name!");

        const room = activeRooms.find(item => item.roomId === joinRoomId);
        console.log("handleJoinSubmit::", room);

        if (room) {
            setUser({
                ...user,
                roomId: joinRoomId,
                userId: user?._id,
                userName: joinName,
                host: false,
                presenter: false,
            });
            setRoomJoined(true);
        } else {
            return toast.error("Please enter a valid room!");
        }
    };

    if (!user) {
        router.push("/")
    }



    return (
        <div className="container" >
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center my-5">
                        Welcome To Realtime Whiteboard Sharing App
                    </h1>
                </div>
            </div>
            <div className="row mx-5 mt-5">
                <div className="col-md-5 p-5 border mx-auto" style={{ backgroundColor: "#f8f9fa", borderRadius: "7px" }}>
                    <h1 className="text-center text-primary mb-5">Create Room</h1>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="form-group my-2">
                            <input
                                type="text"
                                placeholder="Name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group my-2 border align-items-center">
                            <input
                                type="text"
                                className="form-control border-0 outline-0"
                                value={roomId}
                                readOnly={true}
                                style={{
                                    boxShadow: "none",
                                    zIndex: "0 !important",
                                    fontsize: "0.89rem !important",
                                }}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-primary  border-0 btn-sm"
                                    type="button"
                                    onClick={() => generateUuid()}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div className="form-group mt-5">
                            <button type="submit" className="form-control btn btn-dark">
                                Create Room
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-5 p-5 border mx-auto" style={{ backgroundColor: "#f8f9fa", borderRadius: "7px" }}>
                    <h1 className="text-center text-primary mb-5">Join Room</h1>
                    <form onSubmit={handleJoinSubmit}>
                        <div className="form-group my-2">
                            <input
                                type="text"
                                placeholder="Name"
                                className="form-control"
                                value={joinName}
                                onChange={(e) => setJoinName(e.target.value)}
                            />
                        </div>
                        <div className="form-group my-2">
                            <input
                                type="text"
                                className="form-control outline-0"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value)}
                                placeholder="Room Id"
                                style={{
                                    boxShadow: "none",
                                }}
                            />
                        </div>
                        <div className="form-group mt-5">
                            <button type="submit" className="form-control btn btn-dark">
                                Join Room
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            <div className="row mx-5 mt-5">
                <div className="col-md-5 p-5 border mx-auto" style={{ backgroundColor: "#f8f9fa", borderRadius: "7px" }}>
                    <h1 className="text-center text-primary mb-5">Active Room</h1>
                    <form>
                        {activeRooms && activeRooms.map((item) => (
                            <div key={item._id} className="input-group my-2 border align-items-center">
                                <input
                                    type="text"
                                    className="form-control border-0 outline-0"
                                    value={item.roomId}
                                    readOnly={true}
                                    style={{
                                        boxShadow: "none",
                                        zIndex: "0 !important",
                                        fontSize: "0.89rem !important",
                                    }}
                                />
                                <div className="input-group-append">
                                    <CopyToClipboard
                                        text={item.roomId}
                                        onCopy={() => toast.success("Room Id Copied To Clipboard!")}
                                    >
                                        <button
                                            className="btn btn-outline-dark border-0 btn-sm"
                                            type="button"
                                        >
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            </div >
        </div >
    );
};

export default JoinCreateRoom;