chrome.runtime.onInstalled.addListener(({ reason }) => {
  chrome.contextMenus.create({
    id: 'generate-email',
    title: 'Generate Email',
    contexts: ['editable'],
  });

  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    showOptions();
  }
});

chrome.action.onClicked.addListener(() => {
  showOptions();
});

chrome.contextMenus.onClicked.addListener(async (clickData) => {
  if (clickData.menuItemId === 'generate-email') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id as number },
        files: ['fill-email.js'],
      });
    });
  }
});

function showOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}
