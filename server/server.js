const app = require('../app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// database connection
const DB = process.env.DATABASE_LINK.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB CONNECTED SUCCESSFULLY..'));

// listening request
app.listen(PORT, () => {
    console.log(`Started Listening Port Number : ${PORT}`);
});
