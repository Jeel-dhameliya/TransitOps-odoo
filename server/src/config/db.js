const mongoose = require("mongoose")
const name = "Transit"


const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(`${process.env.MONGO_URL} / ${name}`)
        console.log(`\nMongoDB connectd !! DB HOST : ${connect.connection.host}`)
    }
    catch(error){
        console.log("error")
        process.exit(1);
    }
}
module.exports = connectDB