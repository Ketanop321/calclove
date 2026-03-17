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

        const latestNames = await Names.findOne().sort({ _id: -1 }).exec();
        res.send(latestNames);
    } catch (err) {
        console.error('Error fetching names:', err);
        res.status(500).send({ error: 'Failed to fetch names.' });
    }
};
