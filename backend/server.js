import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
    // root route
    res.send('This is a test page');
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});