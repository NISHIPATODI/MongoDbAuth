const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Task = mongoose.model("task")

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../key')
const requirelogin = require('../middleware/requirelogin')
const requireLogin = require('../middleware/requirelogin')


router.get('/home', requirelogin,(req, res) => {
//let {_id} =req.user;
console.log("inside home "+req.body.name);

Task.save().then(user => {
    res.json({ message: "Saved succesfully" })
}).catch(err => {
    console.log(err)
})

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

router.post('/schedule',requirelogin, (req, res) => {
    let userId= req.body.userId
    let date=req.body.date
    let taskName=req.body.taskName
    var task = new Task({ userId:userId,date: date, taskName:taskName });
    //console.log(userId);
    
    // save model to database
    task.save(function (err, taskDetails) {
      if (err) return console.error(err);
      res.json(taskDetails);
      console.log(taskDetails );
    });
    
})

router.get('/userDetails', requireLogin, async (req, res) => {
    let userId= req.body.userId
   
    let userTask = await User.find({_id:req.body.userId}).populate("taskDetails");
  //.populate(" taskDetails");
  console.log(userTask);
  res.send(userTask);
  })
    

  router.get('/allTasks',(req, res) => {
    let userId= req.body.userId
   
    let userTask = Task.find(function (err, userTask){
if(err )return console.log(err);
        console.log(userTask);
        res.send(userTask);
  
    })

  //.populate(" taskDetails");
  //console.log(userTask);
 // res.send(userTask);
  })



  router.post("/insertTask", function(req, res) {
    // Create a new note and pass the req.body to the entry
    Task.create(req.body)
      .then(function(taskDetails) {
        // If a Review was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new Review
        // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return User.findOneAndUpdate({ _id: req.body.userId }, {$push: {taskDetails: taskDetails.taskName}}, { new: true });
      })
      .then(function(dbUser) {
        // If we were able to successfully update a Product, send it back to the client
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

module.exports = router