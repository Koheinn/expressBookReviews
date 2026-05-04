const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// Session setup
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Auth middleware for JWT
app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.session.authorization;
    if (!authHeader) return res.status(401).json({ message: "User not logged in" });

    const token = authHeader.token;
    jwt.verify(token, "access", (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded.username;
        next();
    });
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));