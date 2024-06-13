const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { CohereClient } = require('cohere-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Cohere AI client
const cohere = new CohereClient({
    token: "QqvH8wko3rpDwzqv00oGmI6BT4kQdRNXAFvBEBXT", // Replace with your actual API key
});

// Set up body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle user profile submission
app.post('/profile', upload.single('photo'), async (req, res) => {
    const { name, age, salary, currentPension } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Uploaded photo URL

    try {
        // Generate pension advice using Cohere
        const response = await cohere.generate({
            model: "command",
            prompt: `give me pension advice for ${name}, ${age} years old, earning £${salary} with current pension ${currentPension}%\n`,
            maxTokens: 300,
            temperature: 0.9,
            k: 0,
            stopSequences: [],
            returnLikelihoods: "NONE"
        });

        const pensionAdvice = response.generations[0].text;

        // Redirect to details page with all details including pension advice
        res.redirect(`/details?name=${name}&age=${age}&salary=${salary}&currentPension=${currentPension}&photoUrl=${photoUrl}&pensionAdvice=${encodeURIComponent(pensionAdvice)}`);
    } catch (error) {
        console.error('Error generating pension advice:', error.message);
        res.status(500).send('Error generating pension advice');
    }
});

// Endpoint to display user profile details
app.get('/details', (req, res) => {
    const { name, age, salary, currentPension, photoUrl, pensionAdvice } = req.query;
    res.sendFile(path.join(__dirname, 'details.html'));
});

// Endpoint to handle photo upload and aging simulation
app.post('/age-photo', upload.single('photo'), (req, res) => {
    const photo = req.file;
    if (!photo) {
        return res.status(400).json({ error: 'No photo uploaded' });
    }
    // Simulate calling the mock API for photo aging
    console.log('Photo received, simulating aging...');
    const agedPhotoUrl = `/uploads/${photo.filename}`;
    res.json({ message: 'Photo aged successfully', agedPhotoUrl });
});

app.use('/uploads', express.static('uploads')); // Serve uploaded images

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
