const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

const router = express.Router()

const jsonParser = bodyParser.json()
require('../models/User')
const User = mongoose.model('Users')


router.post('/login', jsonParser, (req, res) => {
    // Data Validation
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ message: 'invalid credentials' })
    }
    // Checking if this user (email) exist
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // checking the password 
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if (match) {
                        jwt.sign({ user }, 'secretkey', (err, token) => {
                            res.json({
                                token
                            })
                        })
                    } else {
                        res.status(400).json({ message: 'invalid email or password.' })
                    }
                })

            } else {
                res.status(404).json({ message: 'this user does not exist' })
            }
        })

})

router.post('/register', jsonParser, (req, res) => {
    // Data validation
    if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
        res.status(400).json({ message: 'invalid data' })
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        res.status(400).json({ message: 'passwords should match' })
        return;
    }
    // Check if User (email) already exist            
    User.findOne({ email: req.body.email })
        .then(user => {
            // if this email exist in db
            if (user) {
                res.status(400).send({ message: 'this email is taken' })
            } else {
                // Encrypt password 
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        const newUser = new User({
                            email: req.body.email,
                            password: hash
                        })
                        newUser.save()
                            .then(user => {
                                res.status(201).send({ message: 'user created successfully' })
                            })
                            .catch(err => {
                                console.log(err)
                                return
                            })
                    })
                })
            }
        })

})


module.exports = router;