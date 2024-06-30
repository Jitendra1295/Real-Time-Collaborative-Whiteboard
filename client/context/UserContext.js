"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const server = "http://localhost:8000";
        const connectionOptions = {
            "force new connection": true,
            reconnectionAttempts: "Infinity",
            timeout: 10000,
            transports: ["websocket"],
        };

        const socket = io(server, connectionOptions);
        setSocket(socket);

        // Clean up the socket connection when component unmounts
        return () => socket.close();
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, socket }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
