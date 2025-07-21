import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../Socket';

const ChatPage = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const { currentUser, selectedUser } = location.state || {};
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !selectedUser) navigate('/home', { state: { name: currentUser } });

        const handleMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
        };

        socket.on("msgFromServer", handleMessage);

        return () => {
            socket.off("msgFromServer", handleMessage);
        };
    }, [currentUser, selectedUser, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && selectedUser) {
            socket.emit("msgToServer", {
                message: message,
                to: selectedUser.id
            });
            setMessage("");
        }
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            <div className="d-flex align-items-center p-3 bg-success text-white">
                <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => navigate('/home', { state: { name: currentUser } })}
                >
                    ← Back
                </button>
                <h5 className="mb-0">{selectedUser?.username}</h5>
            </div>

            <div className="flex-grow-1 p-3 overflow-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`d-flex mb-3 ${msg.type === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`rounded p-3 ${msg.type === 'sent' ? 'bg-primary text-white' : 'bg-white border'}`}>
                            <div>{msg.message}</div>
                            <small className={`d-block text-end ${msg.type === 'sent' ? 'text-white-50' : 'text-muted'}`}>
                                {msg.timestamp}
                            </small>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="d-flex p-3 bg-white border-top">
                <input
                    type="text"
                    className="form-control rounded-pill me-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    required
                />
                <button type="submit" className="btn btn-success rounded-pill px-4">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatPage;