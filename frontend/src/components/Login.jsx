import React from 'react';

const Login = () => {
    const handleLogin = () => {
        window.open('http://localhost:4000/auth/google', '_self');
        
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
