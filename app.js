const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');//edit
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: 'https://appdownloader-three.vercel.app' // Replace with your frontend's URL
})); //edit

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // 30 seconds
    socketTimeoutMS: 45000  // 45 seconds
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const downloadSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

const Download = mongoose.model('Download', downloadSchema);

app.use(express.json());

app.post('/api/download', async (req, res) => {
    try {
        let download = await Download.findOne();
        if (!download) {
            download = new Download();
        }
        download.count += 1;
        await download.save();
        res.status(200).json({ message: 'Download recorded', count: download.count });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const download = await Download.findOne();
        res.status(200).json({ count: download ? download.count : 0 });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
