import dotenv from 'dotenv'
import connectDB from "./db/index.js"


dotenv.config({
    path:'./env'
}) 



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`App is listenig on port ${process.env.PORT}`);
       })
})
.catch((err)=>{
console.log("MongoDB connetion failed", err);
})


 
// (async()=>{
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("error");
//         throw error;
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listenig on port ${process.env.PORT}`);
//        })
//     }
//     catch(error){
//         console.log("Error: ", error);
//         throw error;
//     }

// })() 