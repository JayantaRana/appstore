const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Access-Control-Allow-Origin: '*';

app.use(cors({
    origin: 'https://appdownloader-three.vercel.app', // Replace this with the exact URL of your frontend
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
}));
// app.use(cors());




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
        console.log('Received download request');
        let download = await Download.findOne();
        console.log('Download record:', download);
        if (!download) {
            download = new Download();
        }
        download.count += 1;
        await download.save();
        console.log('Download count updated',download);
        res.status(200).json({ message: 'Download recorded', count: download.count });
    } catch (err) {
        console.error('Error during download recording:', err);
        res.status(500).json({ error: 'Internal Server Error3',err });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const download = await Download.findOne();
        res.status(200).json({ count: download ? download.count : 0 });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error2',err });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
