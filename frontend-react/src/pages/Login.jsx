import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            setError('Please enter a name');
            return;
        }

        // Simple validation passed
        navigate('/home', { state: { name: trimmedName } });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '300px' }}>
                <h2 className="text-center mb-4">Chat Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Enter Chat
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;