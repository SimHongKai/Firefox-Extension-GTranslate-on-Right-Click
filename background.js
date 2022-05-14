// set default translated language to English and open in tabs
browser.storage.local.set({ languageCode: "en", openIn: "tab"});

// add Translate Text option to Right Click Menu
browser.contextMenus.create({
    id: "google-translate-text",
    title: "Translate text",
    contexts: ["selection"],
});
// to store the current translator tab data
var translatorTab = null;

function onCreated(tab){
    console.log("Tab was created");
    translatorTab = tab;
}

function onWindowCreated(windows){
    console.log("Window was created");
    translatorTab = windows.tabs[0];
}

function onUpdated(tab){
    console.log("Tab was updated");
    translatorTab = tab;
}

function onError(tab){
    console.log("Tab Error");
}

browser.contextMenus.onClicked.addListener(function(info, tab) {
    browser.storage.local.get(["languageCode", "openIn"], function(data) {
        
        languageCode = data.languageCode;
        openIn = data.openIn;
        // open translation in new tab
        if (openIn == "tab"){
            // if previous tab for translation exist then update url
            if (translatorTab != null){
                let updating = browser.tabs.update(
                    translatorTab.id,
                    {
                        url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                        active: true,
                        highlighted: true
                    }
                );
                updating.then(onUpdated, onError);
            // if no translation tab or if its closed then create tab
            }else if(translatorTab == null){
                // get Windows.windows object (eventually since its a Promise)
                let creating = browser.tabs.create({
                    url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                });
                creating.then(onCreated, onError);
            }
        // creates a pop-up window instead of new tab
        }else if (openIn == "pop-up"){
            // if previous tab for translation exist then update url
            if (translatorTab != null){
                let updating = browser.tabs.update(
                    translatorTab.id,
                    {
                        url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                        active: true,
                        highlighted: true
                    }
                );
                updating.then(onUpdated, onError);
            // if no translation tab or if its closed then create a new Window
            }else if(translatorTab == null){
                // get Windows.windows object (eventually since its a Promise)
                let creating = browser.windows.create({
                    url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                    type: "popup",
                    width: 720,
                    height: 480,
                });
                creating.then(onWindowCreated, onError);
            }
        }
    });
});

// if translation tab was closed, set translator tab variable to null
function handleRemoved(tabId, removeInfo) {
    if(translatorTab.id == tabId){
        translatorTab = null;
    }
}

browser.tabs.onRemoved.addListener(handleRemoved);