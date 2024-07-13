import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import User from '../models/user_model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        //console.log('Profile:', profile);
        const userEmail = profile.emails ? profile.emails[0].value : 'No email found';
        console.log('User Email:', userEmail);
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
                
            } else {
                new User({
                    email:profile.emails[0].value,
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);

