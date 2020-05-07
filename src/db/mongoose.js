const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{

useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology: true

})



// const Task = mongoose.model('Task',{

// description:{
//     type:String,
//     trim:true,
//     required:true
// },

// completed:{
//   type:Boolean,
//   default:false
// }

// })

// const me = new Task({
//     description:'learn the monggose library',
//     completed: true
// })


// me.save().then(()=>{
// console.log(me)

// }).catch((error)=>{

//     console.log('error',error)
// })