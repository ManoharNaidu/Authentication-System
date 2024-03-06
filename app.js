require("dotenv").config();
require('./config/database').connect();

const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('<h1>Hello from app file</h1>');
})


app.post("/register", async (req,res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
    
        if (!(firstname && lastname && email && password)) {
            res.status(400).send("All input is required");
        }
    
        const existingUser = await User.findOne({ email})
    
        if (existingUser) {
            res.status(409).send("User already exists");

        }
    
        const EncryptedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await User.create({firstname, lastname, email, password: EncryptedPassword})
    
        // token generation
        const token = jwt.sign(
            {user_id : newUser._id, email},
            process.env.SECRET_KEY,
            { expiresIn : "5h"}
        )
        newUser.token = token
    
        // password issue
        newUser.password = undefined;

        // update or not
        res.status(201).json(newUser);
    }
    catch (error) {
        console.log(error);
    }
})
module.exports = app;