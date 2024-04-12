// Get the malicious URL stored in chrome storage
chrome.storage.sync.get(['currentMaliciousList'], function(data) {
    // Update the website placeholder with the malicious URL
    document.getElementById('website').innerText = data.currentMaliciousList;
});

// Function to handle the redirection to the block page
function redirectToBlockPage() {
    // Redirect the user to the block page
    chrome.tabs.update(null, { url: "blockpage.html" });
}

// Get the current URL
var currentURL = window.location.href;

// Call the function to redirect to the block page
redirectToBlockPage();

