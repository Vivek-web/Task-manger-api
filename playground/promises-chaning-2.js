require('../src/db/mongoose');

const Task  = require('../src/models/task')


// Task.findByIdAndDelete('5ea7e14aaf09cb20d9b62821').then((task) =>{ 
//              console.log(task);
//     return Task.countDocuments({completed:false})
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })



const deleteAndCount = async (id,completed) => {
 const task =  await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({completed:false})
            return count
}

deleteAndCount('5ea7e159af09cb20d9b62822').then((count)=>{
     console.log(count)

}).catch((e)=>{
    console.log(e);
})