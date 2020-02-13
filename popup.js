// TODO: trigger onclick event when the \n character gets written to changetitle
//       input
// TODO: make placeholder text the original document title, but make value the
//       value of the new title after update
// TODO: what happens if the tab renames the document? is there an event for
//       this? can you lock it from being changed
// TODO: persist title updates for pdf viewer pages
// TODO: add a title to the design

const changeTitle = document.getElementById("submitNewTitle");
const titleInput = document.getElementById("newTitle");

// Promise that returns the current tab object
const getCurrentTab = new Promise((res, rej) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      res(tabs[0]);
    }
  );
});

async function saveTitle(url, title) {
  const data = {};
  data[url] = title;
  chrome.storage.sync.set(data, () => {
    console.log(`Saved ${title} in storage`);
  });
  return Promise.resolve();
}

function askTheActiveTab(what) {
  return new Promise((res, rej) =>
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: what
          },
          function(response) {
            return res(response);
          }
        );
      }
    )
  );
}

// On start up ask the current tab for url information
// then update the input with placeholder text
askTheActiveTab("getURL").then(data => {
  if (!data) {
    titleInput.placeholder = "Title";
    return;
  }
  titleInput.placeholder = data.title;
});

changeTitle.onclick = e => {
  // - Get the current URL & title
  // - Update the value in storage
  // - Update the document title
  const newTitle = titleInput.value;
  askTheActiveTab("getURL")
    .then(data => {
      return Promise.all([getCurrentTab, saveTitle(data.url, newTitle)]);
    })
    .then(([tab, _]) => {
      chrome.tabs.executeScript(tab.id, {
        code: `document.title ='${newTitle}'`
      });
    });
};
