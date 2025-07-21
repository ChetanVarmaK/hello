import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../Socket';

const Home = () => {
    const location = useLocation();
    const { name } = location.state || {};
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!name) navigate('/');

        const handleUserUpdate = (users) => {
            setUserList(users.filter(user => user.username !== name));
        };

        socket.on("fromServer", handleUserUpdate);
        socket.emit("toServer", name);

        return () => {
            socket.off("fromServer", handleUserUpdate);
        };
    }, [name, navigate]);

    return (
        <div className="vh-100 bg-light">
            <div className="p-3 bg-success text-white">
                <h2>Welcome, {name}</h2>
                <small>Online users: {userList.length}</small>
            </div>
            
            <div className="p-3 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
                {userList.map((user) => (
                    <div 
                        key={user.id}
                        className="p-3 mb-2 bg-white rounded shadow-sm d-flex align-items-center"
                        onClick={() => navigate('/chat', { 
                            state: { currentUser: name, selectedUser: user } 
                        })}
                    >
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                            style={{ width: '40px', height: '40px' }}>
                            {user.username.charAt(0)}
                        </div>
                        <div className="ms-3">
                            <h5 className="mb-0">{user.username}</h5>
                            <small className="text-success">Online</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;