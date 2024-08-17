const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema to track download count
const downloadSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

const Download = mongoose.model('Download', downloadSchema);

// Route to serve the APK file and update the count
app.get('/api/download', async (req, res) => {
    try {
        // Increment the download count
        await Download.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        
        // Serve the APK file
        const filePath = path.join(__dirname, 'public', 'myapp.apk');
        res.download(filePath); // This triggers the file download
    } catch (error) {
        console.error('Error recording download:', error);
        res.status(500).json({ error: 'Failed to record download' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
