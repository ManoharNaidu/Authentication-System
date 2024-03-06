require("dotenv").config();
require('./config/database').connect();

const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

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

app.post("/login", async (req,res) => {
    try{
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });

        // Method - 1
        // if (!user){console.log("You are not registered!!");}
        
        // if(bcrypt.campare(password,user.password)){
        //     // generate the token and send it to the client
        // }

        // Method - 2
        if (user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                {user_id : user._id, email},
                process.env.SECRET_KEY,
                { expiresIn : "1h"}
            )
            user.token = token;
            user.password = undefined;
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    }
    catch(error) {
        console.log(error);
    }
})

app.get("/dashboard", auth, (req,res) =>{
    res.send("Welcome to the User!!");
})

module.exports = app;