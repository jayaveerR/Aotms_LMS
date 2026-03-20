import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: Date;
    [key: string]: any;
}

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    notifications: [],
    clearNotifications: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(API_URL);
        
        newSocket.on('connect', () => {
            console.log('[Socket] Connected to server');
            newSocket.emit('authenticate', user.id);
        });

        newSocket.on('notification', (data: Notification) => {
            console.log('[Socket] Received notification:', data);
            setNotifications(prev => [data, ...prev]);
            
            // Show toast
            toast(data.title, {
                description: data.message,
                action: {
                    label: "View",
                    onClick: () => console.log("View notification", data),
                },
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.id]);

    const clearNotifications = () => setNotifications([]);

    return (
        <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};
