const express = require('express');
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

         const token = await user.generateAuthtoken()

        res.status(201).send({user, token});


    } catch (e) {
        res.status(400).send(e)
    }


})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await  user.generateAuthtoken()
        res.send({user,token})
    } catch (e) {

        res.status(400).send()

    }

})

router.post('/users/logout',auth, async (req, res )=>{
    try{
           req.user.tokens = req.user.tokens.filter((token)=>{
                 return token.token !== req.token   

           }) 
           await req.user.save()

           res.send()

    }catch(e){
           
        res.status(500).send()

    }     
}) 

router.post('/logout/alluser',auth, async(req,res)=>{
   try{
req.user.tokens = []

      await req.user.save()

      res.send()

    }catch(e){

        res.status(500).send()
    }
}) 

    

router.get('/users/me', auth, async (req, res) => {
     res.send(req.user);
    
})

router.patch('/users/me',auth, async  (req, res )=>{
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowUpdates = ['name','email','password',]
    const isvalidators =  updates.every((update) => allowUpdates.includes(update)) // it return true or false 
     
    if(!isvalidators){
        res.status(400).send({'error':'Invalid  updates'})
    }

// findbyId  and update bypasses mongoose. it performs direct opreation from database so that,s why we use these method.


 try{
  updates.forEach((update) =>  req.user[update] = req.body[update])
        //  console.log(req.user)
  await req.user.save()
    res.send(req.user);
 }catch(e){

    
 }

})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        res.status(201).send(req.user)

    } catch (e) {

        res.status(500).send(e)

    }


})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
             return cb (new Error('not supported file'))
        }

       cb(undefined,true) 
    }
})

// uploading and updating user profile picture 
 
router.post('/users/me/avatars',auth,upload.single('avatars'),async (req,res) => {
    // const buffer = await sharp(req.file.buffer).resize({widh:250,height:250}).png().toBuffer()
req.user.avatar = req.file.buffer
await req.user.save()
res.send()
},(error,req,res,next) => { // this funcion is using for error handling
    res.status(400).send({error:error.message})
}
)


router.delete('/users/me/avators', auth,async (req,res) => {
    try{
    req.user.avatar = undefined

    await req.user.save()
    res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.get('/users/:id/avatar',async (req,res) => {
try{
 
    const user = await User.findById(req.params.id)

    if(!user||!user.avatar){

            throw new Error
    }
res.set('content-type', 'image/jpg')
res.send(user.avatar)

}catch(e){

res.status(400).send()

}

})








module.exports = router