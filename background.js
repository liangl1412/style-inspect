let toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path: "images/on.png", tabId:tab.id});
    chrome.tabs.insertCSS({
      file: 'styles.css'
    });
    chrome.tabs.executeScript(tab.id, {file:"./lib/tinycolor.js"});
    chrome.tabs.executeScript(tab.id, {file:"./main.js"});
  }
  else{
    chrome.tabs.executeScript(tab.id, {file:"./cleanup.js"});
    chrome.browserAction.setIcon({path: "images/off.png", tabId:tab.id});
  }
});
