import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'cookie-session';
import bodyParser from 'body-parser';
import './config/passport-setup.js';
import cors from 'cors';
import postmark from 'postmark';
import authRoutes from './routes/auth_routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(session({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    keys: ['your_secret_key']
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(4000, () => {
            console.log('Server is running...');
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use('/auth', authRoutes);

app.get('/test', (req, res) => {
    res.json('Test success');
});

const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

app.post('/send-email', async (req, res) => {
    const { from, to, subject, text, html } = req.body;

    try {
        const response = await postmarkClient.sendEmail({
            From: from,
            To: to,
            Subject: subject,
            TextBody: text,
            HtmlBody: html
        });

        // Send a single response after email is sent
        res.json({
            "To": response.To,
            "SubmittedAt": response.SubmittedAt,
            "Message": response.Message,
            "status": "Email sent successfully"
        });
    } catch (error) {
        console.error('Error Sending email: ', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});


app.get('/profile', (req, res) => {
    try {
        if (!req.session.passport || !req.session.passport.user) {
            console.error('Unauthorized access attempt');
            return res.status(401).send('Unauthorized'); // Handle unauthorized access
        }

        const userProfile = req.session.passport.user;
        //console.log('User profile:', userProfile);
        res.json({ profile: userProfile });
    } catch (error) {
        console.error('Error retrieving profile:', error);  // Log the error
        res.status(500).send('Internal Server Error');
    }
});
