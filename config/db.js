const mongoose = require("mongoose");
// const url = "";
const url = "mongodb://localhost:27017/Aramestan";

const InitiateMongoServer = async() => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (e) {
        throw e;
    }
};
module.exports = InitiateMongoServer;