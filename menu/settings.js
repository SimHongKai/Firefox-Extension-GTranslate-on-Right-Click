const $ = document.querySelector.bind(document);

// set drop down list on open
browser.storage.local.get("languageCode", function({languageCode}) {
    $("#languageCode").value = languageCode;
});

// listener for the LanguageCode drop down list
$("#languageCode").addEventListener("change", function(event) {
    browser.storage.local.set({languageCode: $("#languageCode").value});
});

// set drop down list
browser.storage.local.get("openIn", function({openIn}) {
    $("#openIn").value = openIn;
});

// listener for the open in list
$("#openIn").addEventListener("change", function(event) {
    browser.storage.local.set({openIn: $("#openIn").value});
});