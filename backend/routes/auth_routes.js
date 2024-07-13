import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

// Callback route for Google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000/profile');
});


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000/');
});

export default router;
