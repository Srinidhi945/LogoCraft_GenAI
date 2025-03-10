document.getElementById("generateBtn").addEventListener("click", function() {
    const prompt = document.getElementById("prompt").value.trim();
    
    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }

    // Show loading state
    document.getElementById("logos-container").innerHTML = "<p>Generating logos...</p>";
    document.getElementById("downloadPdfBtn").style.display = "none";

    // Clear any previous error messages
    document.getElementById("error-message").style.display = "none";

    fetch("/generate-logo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        if (data.image_files) {
            displayLogos(data.image_files);
            document.getElementById("downloadPdfBtn").style.display = "inline-block";
        } else {
            showError("Failed to generate logos");
        }
    })
    .catch(error => {
        showError(error.message);
    });
});

document.getElementById("downloadPdfBtn").addEventListener("click", function() {
    window.location.href = "/download-logo-pdf";
});



function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.querySelector("p").textContent = message;
    errorMessage.style.display = "block";
}

script.js