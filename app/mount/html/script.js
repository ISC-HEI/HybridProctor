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
                const fileName = file.href.split('/').pop();
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                //console.log(fileName)
                link.href = directory + "/" + fileName;
                link.textContent = fileName;
                link.download = fileName; // Add download attribute to trigger download
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching file list:', error);
    });
}

// Fetch file list when the page loads
window.onload = function() {
    fetchFileList('/resources');
};

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