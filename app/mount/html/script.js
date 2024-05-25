const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function fetchFileList(directory) {
    fetch(directory)
        .then(response => response.text())
        .then(data => {
            // Parse the directory listing
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const files = htmlDoc.querySelectorAll('a');
            
            // Display each file as a download link
            const fileList = document.getElementById('fileList');
            //console.log(fileList)
            let isFirstItem = true;
            files.forEach(file => {
                // Skip the first item
                if (isFirstItem) {
                    isFirstItem = false;
                    return;
                }
                const encodedFileName = file.href.split('/').pop();
                //console.log("encoded:", encodedFileName);
                let decodedFileName;
                try {
                    // Doesn't work with decodeURIComponent..
                    //decodedFileName = decodeURIComponent(encodedFileName);  // Try to decode the filename
                    decodedFileName = unescape(encodedFileName);  // Try to decode the filename
                } catch (e) {
                    console.error('Error decoding filename:', e);
                    decodedFileName = encodedFileName;  // If an error occurs, use the encoded filename
                }
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                //console.log(decodedFileName)
                link.href = directory + "/" + encodedFileName;
                link.textContent = decodedFileName;
                link.download = decodedFileName; // Add download attribute to trigger download
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => {   
            console.error('Error fetching file list:', error);
        });
}

// Fetch the config file
function fetchConfigFile() {
    console.log("Fetching config file");
    fetch('/config.yml')
        .then(response => response.text())  // Read the response as text
        .then(text => {
            // Parse the YAML text
            const config = jsyaml.load(text);

            // If "enable" is false, return early
            if (!config.enable) {
                console.log('Display of information is disabled');
                return;
            }

            // The description is under the "description" key
            const description = config.description;

            // The filenames are under the "files" key
            const filenames = config.files;

            // Select the ul element under the "Upload" tag
            const ul = document.querySelector('#uploadFileList');

            // Create a p element for the description
            const p = document.createElement('p');

            // Set its text to the description
            p.textContent = description;

            // Insert the p element before the ul element in the DOM
            ul.parentNode.insertBefore(p, ul);

            // For each filename
            filenames.forEach(filename => {
                // Create a li element
                const li = document.createElement('li');

                // Set its text to the filename
                li.textContent = filename;

                // Append it to the ul
                ul.appendChild(li);
            });
        });
}

// Call the fetch function when the page loads
window.onload = function() {
    fetchFileList('/resources');
    fetchConfigFile();
};

// Function called when the form is submitted
function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const progressBar = document.getElementById("progressBar"); // Reference to progress bar element
    const formData = new FormData();

    hideStatusMessage();
    if (!name.value) {
        showStatusMessage("Please enter your name before uploading.", "error");
    }
    else if (files.files.length === 0) {
        showStatusMessage("Please select at least one file for uploading.", "error");
    }
    else {
        formData.append("name", name.value);
        for (let i = 0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
        }

        //progressBar.classList.remove("hidden");
        clearTimeout(progressBarTimeout);
        progressBar.classList.add("notransition");
        progressBar.style.width = 0;
        progressBar.offsetHeight; // Trigger a reflow, flushing the CSS changes
        progressBar.classList.remove("notransition");


        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://10.0.0.1:3000/upload_files"); // Adjust URL as needed
        //xhr.open("POST", "http://192.168.88.1:3000/upload_files"); // Adjust URL as needed
        //xhr.open("POST", "http://localhost:3000/upload_files"); // Adjust URL as needed
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = percentComplete + "%";
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                showStatusMessage("File(s) uploaded successfully.", "success");
            } else {
                showStatusMessage("Failed to upload file(s).", "error");
            }
            resetProgressBar(); // Reset progress bar after 6 seconds
        };

        xhr.onerror = function() {
            showStatusMessage("Error occurred while uploading file(s).", "error");
            resetProgressBar(); // Reset progress bar after 6 seconds
        };

        xhr.send(formData);
    }
}
// Helper functions to show and hide status messages
let timeout = setTimeout(()=>{});
function showStatusMessage(message, type) {
    clearTimeout(timeout);
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message;
    statusMessage.classList.add(type);
    statusMessage.classList.remove("hidden");
    timeout = setTimeout(() => {
        hideStatusMessage();
        statusMessage.classList.remove(type);
    }, 6000); // Hide after 6 seconds
}
function hideStatusMessage() {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.classList.add("hidden");
}

// Reset progress bar after 6 seconds of inactivity
let progressBarTimeout = setTimeout(()=>{});
function resetProgressBar() {
    const progressBar = document.getElementById("progressBar");
    progressBarTimeout = setTimeout(() => {
        progressBar.classList.add("notransition");
        progressBar.style.width = 0;
        progressBar.offsetHeight; // Trigger a reflow, flushing the CSS changes
        progressBar.classList.remove("notransition");
    }, 6000);
}