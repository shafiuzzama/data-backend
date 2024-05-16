const mongoose = require('mongoose');
require('dotenv').config();
async function connection(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
       console.log("Db Connected")
        
    } catch (error) {
        console.log("Db Conenction Failed")
        
    }
}

module.exports={connection};