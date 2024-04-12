async function loadModelFromPickle() {
    const fs = require('fs');
    const path = require('path');
    const tf = require('@tensorflow/tfjs-node');
  
    const modelPath = path.join(__dirname, 'model.pkl');
    
    try {
        // Asynchronously load the model
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        return model;
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
  }
  
  const { padSequences, Tokenizer } = require('@tensorflow/tfjs-core');

  
  function preprocessURL(url) {
    // Example preprocessing:
    const processedURL = url.trim(); // Trim leading and trailing whitespace
    return processedURL;
  }
  
  function preprocessURLs(urls, tokenizer, max_len) {
    // Validate tokenizer object
    if (!tokenizer || typeof tokenizer.texts_to_sequences !== 'function') {
        throw new Error('Invalid tokenizer object provided.');
    }
  
    // Validate max_len
    if (typeof max_len !== 'number' || max_len <= 0) {
        throw new Error('Invalid max_len value provided.');
    }
  
    const processedURLs = urls.map(url => preprocessURL(url));
    const tokenizedSequences = tokenizer.texts_to_sequences(processedURLs);
    const paddedSequences = padSequences(tokenizedSequences, { maxlen: max_len });
  
    return paddedSequences;
  }
  
  async function checkURL(stringURL, tokenizer, max_len) {
    // Validate tokenizer and max_len
    if (!tokenizer || typeof tokenizer.texts_to_sequences !== 'function') {
        throw new Error('Invalid tokenizer object provided.');
    }
    if (typeof max_len !== 'number' || max_len <= 0) {
        throw new Error('Invalid max_len value provided.');
    }
  
    const model = await loadModelFromPickle();
  
    const processedURL = preprocessURL(stringURL);
    const paddedSequence = preprocessURLs([processedURL], tokenizer, max_len);
  
    const predictions = model.predict(paddedSequence);
    const labelIndex = predictions.argMax().dataSync()[0]; // Get the index of the maximum value directly
  
    const index_to_label = {0: 'benign', 1: 'defacement', 2: 'malware', 3: 'phishing'};
    const predictedLabel = index_to_label[labelIndex];
  
    if (['malware', 'phishing', 'defacement'].includes(predictedLabel)) {
        // Perform action for malicious URL (e.g., redirect to warning page)
        myFunction(stringURL); // Pass the original URL
    }
  }
  
  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url);
        url = String(url);
        checkURL(url, tokenizer, max_len); // Pass tokenizer and max_len
    });
  }, {
    urls: ["<all_urls>"],
    types:['main_frame']
  });
  