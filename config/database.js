const mongoose = require('mongoose');
const { MONGODB_URL } = process.env

exports.connect = () => {
    mongoose
    .connect(MONGODB_URL,)
    .then(console.log('DB Connection success'))
    .catch(error => {
        console.log('DB Connection failed');
        console.log(error);
        process.exit(1);
    })
}