const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../key')
const requirelogin = require('../middleware/requirelogin')


router.get('/home', requirelogin, (req, res) => {
    res.send("hahahhahahahahhaahhahaha")
})

router.post('/signup', (req, res) => {
    const { name, email, password, pic, age, gender, weight, height } = req.body
    if (!name || !email || !password || !age || !gender || !weight || !height) {
        return res.status(422).json({ error: "Please fill all the details" })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists" })
        }

        bcrypt.hash(password, 12).then(hashedpassword => {
            const user = new User({
                email,
                password: hashedpassword,
                name,
                pic,
                height,
                weight,
                gender,
                age
            })

            user.save().then(user => {
                res.json({ message: "Saved succesfully" })
            }).catch(err => {
                console.log(err)
            })
        })
    }).catch(err => {
        console.log(err)
    })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "Please provide Email and Password" })
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or Password" })
            }

            bcrypt.compare(password, savedUser.password)
                .then(domatch => {
                    if (domatch) {
                        // res.json({ message: "Successfully signedin" }) 
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({ token })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or Password" })
                    }
                }).catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router