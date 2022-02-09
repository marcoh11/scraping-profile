let btnScrap = document.getElementById('scrap-button')

btnScrap.addEventListener('click',async ()=>{
    /* let[tab]=await chrome.tabs.query({active:true,currentWindow:true})
    const port=chrome.tabs.connect(tab.id)
    console.log("hola",tab.id)
    port.postMessage({action:'getProfile'}) */

    chrome.runtime.sendMessage({action:'lnkS-goToProfile'},()=>{})
})

