import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL + process.env.DBNAME);
        console.log(`connected to DB successfully ==> ${process.env.MONGOURL + process.env.DBNAME}` )
    } catch (error) {
        console.log(`error while connection to db` + error.message)
    }
}

export default connectDb;