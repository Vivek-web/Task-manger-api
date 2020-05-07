const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express(); 

const port = process.env.PORT 

app.use(express.json())

app.use(userRouter)

app.use(taskRouter)

app.listen(port, () => {

 console.log('port is runninng on' + port);
})

// const main = async () => {

// const user = await User.findById('5eabe37b06aa643dc47ad38e')
//    await user.populate('tasks').execPopulate()  //  populate data from a relationship and get data from user 

//    console.log(user.tasks)


// } 

// main()