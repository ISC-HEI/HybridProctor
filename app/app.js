const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());

// Define the directory root where stuff will be uploaded
const UPLOAD_DIR = "/home/admin/upload/";
// Set up Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        //Extract the name from the request body
        const name = req.body.name;
        if (!name) {
            return cb('No name provided.', null);
        }

        // Construct directory path with subdirectory for the name
        const directoryPath = path.join(UPLOAD_DIR, name);
        //const directoryPath = path.join(UPLOAD_DIR, "test");

        // Create directory if it doesn't exist
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Saving file ${file.originalname} in ${directoryPath}`);
        cb(null, directoryPath);
        //cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        // Get current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        // Construct filename with formatted date and original filename
        const formattedDate = `${year}${month}${day}_${hour}${minute}${seconds}`;
        const filename = `${formattedDate}_${file.originalname}`;
        console.log(filename);
        cb(null, filename);
        //cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Define a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    console.log("upload");
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});
// Define a route for file uploads
app.post('/upload_files', upload.array('files'), (req, res) => {
    //console.log(req.files);
    //console.log(req.body);
    if (!req.files) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

// Define a route for getting the version number
app.get('/version', (req, res) => {
    fs.readFile('package.json', (err, data) => {
        if (err) {
            console.error('Error reading package.json:', err);
            return res.status(500).send('Internal server error.');
        }
        const packageJson = JSON.parse(data);
        res.send('Version: ' + packageJson.version);
    });
});

// // Define a route for listing files in a directory
// app.get('/list_files', (req, res) => {
//     const directoryPath = 'uploads'; // Directory path to list files from
//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             console.error('Error listing files:', err);
//             return res.status(500).send('Internal server error.');
//         }
//         res.json(files); // Send the list of files as JSON response
//     });
// });

app.listen(port, () => {
    //console.log(`Server is running on http://localhost:${port}`);
});