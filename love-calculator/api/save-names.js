const mongoose = require('mongoose');

const connectToDatabase = () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection.asPromise();
    }

    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const NameSchema = new mongoose.Schema({
    name1: String,
    name2: String,
});

const Names = mongoose.models.Names || mongoose.model('Names', NameSchema);

module.exports = async (req, res) => {
    try {
        await connectToDatabase();

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
};
