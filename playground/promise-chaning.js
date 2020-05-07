require('../src/db/mongoose');

const User = require('../src/models/user')


// User.findByIdAndUpdate('5ea69641ad0c853384f90aff',{age:1}).then((user)=>{

//     return User.countDocuments({age:1})
// }).then((result)=>{
//     conaole.log(result)
// }).catch((e)=>{
//     console.log(e);
// })


const updateAgeAndCount = async (id,age) =>{
     const user = await User.findByIdAndUpdate(id,{age});
     const count = await User.countDocuments({age})
          return count
} 
 
updateAgeAndCount('5ea69641ad0c853384f90aff',2).then((count)=>{
    console.log(count)
}).catch((e)=>{

    console.log(e);
})