let urlProfiles=[];
let tabSelected = null;
//TENGO QUE OBTENER TODOS LOS URLS


//INGRESAR BUCLE FOR PARA SCRAPEAR URLS DE URLS PROFILE
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { action } = request;
    if (action == 'lnkS-goToProfile') {
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const [tab] = tabs
            tabSelected = tab.id
            chrome.tabs.update(tab.id, { url: 'https://www.linkedin.com/in/katherinee-torres/' }).then((data) => {
                sendResponse({ message: 'ok' })
            
            })
        })
    }
    return true;
})
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabId == tabSelected) {
        if (changeInfo.status == 'complete') {
            scrollingProfile();
            tabSelected = null
        }
    }
})
async function scrollingProfile(){
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const port = chrome.tabs.connect(tab.id)
    port.postMessage({action:'getProfile'})
}
