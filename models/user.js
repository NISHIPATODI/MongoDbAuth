const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://www.securityindustry.org/wp-content/uploads/sites/3/2018/05/noimage.png"
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    taskDetails:[{
     type:Schema.Types.ObjectId,
     ref:"task"
    }]

})

mongoose.model("User", userSchema)


const taskDetails = new mongoose.Schema({
    userId: {
        type: { type: Schema.Types.ObjectId, 
            ref: "User" },
        
    },
    date: {
        type: String,
       
    },
    taskId: {
        type: String
        
    },
    taskName: {
        type: String,
      
    },
    status: {
        type:  String,
        default: "No"
    },
    reward: {
        type: String,
       
    },
   
})
mongoose.model("task", taskDetails);

