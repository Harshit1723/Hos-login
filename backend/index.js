const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/HospitalLoginandReg", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// Defining our Routes
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user });
            } else {
                res.send({ message: "Wrong Password" });
            }
        } else {
            res.send({ message: "User Not Registered" });
        }
    } catch (err) {
        res.send(err);
    }
});


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.send({ message: "User Already Registered" });
        } else {
            const user = new User({
                name,
                email,
                password
            });

            await user.save();
            res.send({ message: "Successfully Registered,Please Login Now" });
        }
    } catch (err) {
        res.send(err);
    }
})

app.listen(9002, () => {
    console.log("BE Started at port 9002")
});
