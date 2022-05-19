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

function onTabCreated(tab){
    console.log(`Tab Created: ${tab.id}`);
    translatorTab = tab;
}

function onTabUpdated(tab){
    console.log(`Tab Updated: ${tab.id}`);
    translatorTab = tab;
}

function onTabUpdatedError(error){
    console.log(`Tab Update Error: ${error}`);
}

function onTabCreatedError(error){
    console.log(`Tab Creation Error: ${error}`);
}

function onWindowCreated(windows){
    console.log(`Window Created: ${windows.id}`);
    translatorTab = windows.tabs[0];
}

function onWindowCreatedError(error){
    console.log(`Window Creation Error: ${error}`);
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
                updating.then(onTabUpdated, onTabUpdatedError);

            // if no translation tab or if its closed then create tab
            }else if(translatorTab == null){

                // get Windows.windows object (eventually since its a Promise)
                let creating = browser.tabs.create({
                    url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                });
                creating.then(onTabCreated, onTabCreatedError);
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
                updating.then(onTabUpdated, onTabUpdatedError);

            // if no translation tab or if its closed then create a new Window
            }else if(translatorTab == null){
                
                // get Windows.windows object (eventually since its a Promise)
                let creating = browser.windows.create({
                    url: `https://translate.google.com/?sl=auto&tl=${languageCode}&text=${info.selectionText}&op=translate`,
                    type: "popup",
                    width: 720,
                    height: 480,
                });
                creating.then(onWindowCreated, onWindowCreatedError);
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