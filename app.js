require("dotenv").config();
require('./config/database').connect();

const express = require('express');
const user = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('<h1>Hello from app file</h1>');
})


app.get("/register", async (req,res) => {
    const { firstname, lastname, email, password } = req.body;
    
    if (!(firstname && lastname && email && password)) {
        res.status(400).send("All input is required");
    }

    const existingUser = await user.findOne({ email})

    if (existingUser) {
        res.status(409).send("User already exists");
    }

    EncryptedPassword = await bcrypt.hash(password, 10);

    user
    .create({firstname, lastname, email, password: EncryptedPassword})
    .then(console.log('User created'))
    .catch(error => {
        console.log('User not conected');
        console.log(error);
    })

})
module.exports = app;