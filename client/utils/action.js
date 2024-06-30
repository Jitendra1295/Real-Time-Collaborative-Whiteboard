// utils/api.js
import { getAuthToken } from "./auth"
const BASE_URL = 'http://localhost:8000/api'; // Replace with your backend API URL
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const data = await response.json();
        console.log("loginUser ::", data);
        return data;
    } catch (error) {
        console.error('Error logging in:', error.message);
        return null;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error registering user:', error.message);
        return null;
    }
};

export const roomDataChange = async (data, id) => {
    try {
        const token = await getAuthToken()
        const response = await fetch(`http://localhost:8000/api/room/update/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch active rooms');
        }

        const rooms = await response.json();
        console.log("rooms ::", rooms);
        return rooms;
    } catch (error) {
        console.error('Error fetching active rooms:', error);
        // Handle error state in UI
    }

};

export const getActiveRoom = async () => {
    try {
        const response = await fetch(`${BASE_URL}/room/data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken}` // Example: use localStorage for token storage
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch active room');
        }

        return await response.json();
    } catch (error) {
        console.error('Error update:', error.message);
        return null;
    }
};
