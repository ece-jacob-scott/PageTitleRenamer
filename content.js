// THIS!!!!!!!!!!!!!!!!
// https://stackoverflow.com/questions/46462484/chrome-extension-message-passing-no-response-farewell-undefined

chrome.storage.sync.get(document.URL, data => {
  const savedTitle = data[document.URL];
  if (savedTitle) {
    document.title = savedTitle;
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  sendResponse({
    title: document.title,
    url: document.URL
  });
});
