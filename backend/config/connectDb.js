const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try{
        const conn  = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB created: ${conn.connection.host}`);
    }
    catch(e){
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

module.exports = connectDb;