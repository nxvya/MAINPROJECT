// This script will be injected into the web page to interact with the DOM

// Function to send URL to background script for checking
function checkURLAndSendToBackground(stringURL) {
  // Send the URL to the background script for checking
  $.ajax({
      type: "POST",
      url: "http://192.168.1.105:5000", // Replace with your server URL
      contentType: "application/json",
      data: JSON.stringify({ URLText: stringURL }),
      dataType: "json",
      success: function(response) {
          if (response == "Good") {
              // If the response is "Good", the website is safe
              // You may add your logic here if needed
          } else if (response == "No such website") {
              // If the response indicates the website does not exist
              alert("Website does not exist");
          } else {
              // If the response indicates a malicious URL
              // Perform the necessary actions (e.g., display warning)
              alert("Warning: Malicious URL Detected!");
              // Call myFunction to handle malicious URL
              myFunction(stringURL);
          }
      },
      error: function(err) {
          // If there's an error in getting a response
          alert("Failed to get a response");
      }
  });
}

// Function to handle a malicious URL
function myFunction(maliciousURL) {
  chrome.tabs.update(null, { url: "blockpage.html" }, function() {
      // Redirect the user to a block page and store the malicious URL
      chrome.storage.sync.set({ 'currentMaliciousList': maliciousURL });
  });
}

// Get the current URL
var currentURL = window.location.href;

// Call the function to check the URL and send it to the background script for checking
checkURLAndSendToBackground(currentURL);
