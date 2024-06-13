const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to handle user profile submission
app.post('/profile', (req, res) => {
    const { name, age, salary, currentPension } = req.body;
    res.redirect(`/details?name=${name}&age=${age}&salary=${salary}&currentPension=${currentPension}`);
});

// Endpoint to display user profile details
app.get('/details', (req, res) => {
    const { name, age, salary, currentPension } = req.query;
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
    const agedPhotoUrl = `https://mockapi.com/aged-photo/${photo.originalname}`;
    res.json({ message: 'Photo aged successfully', agedPhotoUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
