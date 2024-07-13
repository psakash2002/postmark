import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);  // Set initial state to null
    const [showComposeForm, setShowComposeForm] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4000/profile', {
            withCredentials: true
        })
        .then(response => {
            setUser(response.data.profile);  // Access the profile object
        })
        .catch(err => console.log(err));
    }, []);

    const handleCompose = () => {
        setShowComposeForm(true);
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/send-email', {
            from: user.email,  // Assuming sender's email is the user's email
            to: recipient,
            subject: subject,
            text: text,
            html: `<p>${text}</p>`  // Example: Convert text to HTML for email body
        })
        .then(response => {
            console.log('Email sent:', response.data);
            // Optionally, you can update state or show a success message
        })
        .catch(error => {
            console.error('Error sending email:', error);
            // Handle errors
        });
    };

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <h3>Welcome, {user.username}</h3>
                    <img src={user.thumbnail} alt={user.username} />
                    <p>Email: {user.email}</p>
                    <a href="http://localhost:4000/auth/logout">Logout</a>
                    <br />
                    <button onClick={handleCompose}>Compose</button>
                    <button>History</button>
                    {showComposeForm && (
                        <form onSubmit={handleSendEmail}>
                            <label>
                                To:
                                <input
                                    type="email"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Subject:
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Text:
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                />
                            </label>
                            <br />
                            <button type="submit">Send Email</button>
                        </form>
                    )}
                </div>
            ) : (
                <h3>Loading...</h3>
            )}
        </div>
    );
};

export default Profile;
