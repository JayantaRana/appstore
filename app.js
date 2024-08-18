const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Access-Control-Allow-Origin: '*';

app.use(cors({
    origin: 'https://getapps.vercel.app', // Replace this with the exact URL of your frontend
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
}));





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













// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Schema to track download count
// const downloadSchema = new mongoose.Schema({
//     count: { type: Number, default: 0 }
// });

// const Download = mongoose.model('Download', downloadSchema);

// // Route to serve the APK file and update the count
// app.get('/api/download', async (req, res) => {
//     try {
//         // Increment the download count
//         await Download.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        
//         // Serve the APK file
//         const filePath = path.join(__dirname, 'public', 'myapp.apk');
//         res.download(filePath); // This triggers the file download
//     } catch (error) {
//         console.error('Error recording download:', error);
//         res.status(500).json({ error: 'Failed to record download' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
