const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name:{
     type:String,
     require:true
   },
 
   email:{
     type:String,
     require:true,
     trim:true,
     unique:true  
   },
 
   password:{
    type:String,
    trim:true,
    minlength:6,
    validate(value){
        if(value.toLowerCase().includes('password')){
          throw  new Error ('password condition is nt match')   
        }
    }
   
 },
 tokens:[{
   token:{
     type:String,
     require:true
   }

 }],
 
 avatar:{
   type:Buffer
 }
 },{

timestamps:true      

 })

 userSchema.virtual('tasks',{
           ref:'Task',
           localField:'_id',
           foreignField:'owner'


 })

 // hiding private data //

 userSchema.methods.toJSON = function (){
        const user = this 
        const userObject = user.toObject()

        delete userObject.password
        delete userObject.tokens
   
        return userObject
 }

 // genrate authtoken for specific user

userSchema.methods.generateAuthtoken = async function () {
  const user = this
  // console.log(user);
  const token = await jwt.sign({'_id':user._id.toString() },process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({token:token})

  user.save()

    return token
}


// find user by its credentials //

 userSchema.statics.findByCredentials = async (email,password ) => {

   const user = await User.findOne({email})

   if(!user){

    throw new Error('unable to login')

   }

   const ismatch = await bcrypt.compare(password , user.password)

   // its give boolean value True or False. //  
   
   if(!ismatch){
     throw new Error ('unable to login')
   }

    return user   

 }




// Hash the plain text password before saving. pre is used doing something before an event  

// using standerd function there because arrow function don,t bind this 
 userSchema.pre('save', async function (next){ 

      const user = this   // this give us acess to the individual user thst,s should be saved 
  
      if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)

      }

      next()
 })

//  Delete user task when user is removed

userSchema.pre('remove', async function(next){
 const user = this 
await  Task.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model('User',userSchema)

module.exports = User