const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const router = express.Router()

require('../models/place')
const Places = mongoose.model('Places')

const jsonParser = bodyParser.json()

router.get("/", verifyToken, jsonParser, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(401).send({ message: 'You are not allowed, please register or login' })
        } else {

            Places.find({
                userId: authData.user._id
            }).then((places) => {
                res.status(200).send({ places })
            }).catch(err => {
                res.status(400).send({ message: 'Something wrong happend, please try again' })
            })
        }
    })
})

router.post('/new', verifyToken, jsonParser, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(401).send({ message: 'You are not allowed, please register or login' })
        } else {

            const userId = authData.user._id

            const newPlace = new Places({
                userId: userId,
                title: req.body.title,
                description: req.body.description,
                lat: req.body.lat,
                lng: req.body.lng
            })

            newPlace.save()
                .then(place => {
                    res.status(201).json({
                        message: 'Location was created successfully',
                        id: place.id
                    })
                })
                .catch(err => {
                    console.log(err)
                    return
                })
        }
    })
})

// Format Of Token
// Authorization : Bearer <access_token>

// Verify Token 
function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(401)
    }
}

module.exports = router;