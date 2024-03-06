const express = require('express');
const app = express();
require("dotenv").config();
app.use(express.json());
const user = require('./models/user');

app.get('/', (req, res) => {
    res.send('<h1>Hello from app file</h1>');
})


app.get("/register", (req,res) => {
    const { firstname, lastname, email, password } = req.body;
    
    if (!(firstname && lastname && email && password)) {
        res.status(400).send("All input is required");
    }

    const existingUser = user.findOne({ email})

    if (existingUser) {
        res.status(409).send("User already exists");
    }

})
module.exports = app;