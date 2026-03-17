const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Rate limiter: max 60 requests per minute per IP for API routes
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/love_calculator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema and model
const NameSchema = new mongoose.Schema({
    name1: String,
    name2: String,
});

const Names = mongoose.model('Names', NameSchema);

// API endpoint to save names
app.post('/api/save-names', async (req, res) => {
    try {
        const { name1, name2 } = req.body;
        if (!name1 || !name2 || typeof name1 !== 'string' || typeof name2 !== 'string') {
            return res.status(400).send({ error: 'Both name1 and name2 are required and must be strings.' });
        }
        const newNames = new Names({ name1, name2 });
        await newNames.save();
        res.send({ message: 'Names saved successfully' });
    } catch (err) {
        console.error('Error saving names:', err);
        res.status(500).send({ error: 'Failed to save names.' });
    }
});

// API endpoint to retrieve the latest names
app.get('/api/get-names', async (req, res) => {
    try {
        const latestNames = await Names.findOne().sort({ _id: -1 }).exec();
        res.send(latestNames);
    } catch (err) {
        console.error('Error fetching names:', err);
        res.status(500).send({ error: 'Failed to fetch names.' });
    }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
