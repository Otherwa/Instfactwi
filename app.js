const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// configs
app.set('view engine', 'ejs');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Create multer instance with storage configuration
const upload = multer({ storage });

// Set the view engine to EJS


// Define a route that renders an EJS template
app.get('/', (req, res) => {
    const data = {
        title: 'My Website',
        message: 'Welcome to my website!'
    };
    res.render('index', data);
});


// Define endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded successfully: ' + req.file.path);
    res.send('File uploaded successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
