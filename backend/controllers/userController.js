const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");



const registerUser = asyncHandler( async (req,res) => {
    
    const{name, email, password}= req.body

    //Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter all the required Fields")
    }

    if(password.length < 6){
        res.status(400)
        throw new Error("Please Enter all the required Fields")
    }


    //Checking If email is already exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("Email has already been Registered")
    }

    //Encrypting Password before creating a user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if(user){
        const {_id, name, email, photo, bio} =  user
        res.status(201).json({
           _id, name, email, photo, bio
        })
    } else{
        res.status(400)
        throw new Error
    }

});

module.exports = {
    registerUser,
}