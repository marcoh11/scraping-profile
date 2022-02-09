console.log("entrando");

function scrapProfile() {
    const cssSelectors = { name: 'div.ph5 > div.mt2 > div > div > h1' }
    const aboutMeSelector={aboutme: 'div.display-flex.ph5.pv3 > div > div > div > span'}
    const educationSelector={education:'#ember77 > div.pvs-list__outer-container > ul > li:nth-child(1) > div > div.display-flex.flex-column.full-width.align-self-center > div > a > div > span > span:nth-child(1)'}
    console.log(cssSelectors)
    async function wait(seconds) {
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve()
            },seconds*1000);
        })
    }

    async function waitForSelector(cssSelector, seconds) {
        const intervalTime = 0.25
        for (let i=0; i < seconds/intervalTime; i++) {
            var element = document.querySelector(cssSelector)
            if (element){return element}
            await wait(intervalTime)
        }
    }

    async function autoScroll(cssSelector) {
        const element = document.querySelector(cssSelector)
        while (element) {
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY
            if (maxScrollTop <= currentScrollTop + 20 || elementScrollTop <= currentScrollTop) break
            await wait(0.05)
            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop)
            console.log(maxScrollTop, currentScrollTop, elementScrollTop)
            window.scroll(0, newScrollTop)
        }
    }
    function exportar (data, fileName) {
        const a = document.createElement("a");
        const contenido = data,
            blob = new Blob([contenido], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    
    async function getContactInformation() {
        const {name} = cssSelectors
        const {aboutme}= aboutMeSelector
        console.log(name)


        const nameElement = await waitForSelector(name, 20)
        const aboutmeElement=await waitForSelector(aboutme,20)
        let aboutProfile=aboutmeElement?.innerText
        let nameProfile=nameElement?.innerText
        /* if (!nameElement) {throw 'No se puede obtener la informacion del perfil'} */
        await autoScroll('body')
        const info={
            'Nombre': {nameProfile},
            'Sobre mi':{aboutProfile}
        };
        infoJson = JSON.stringify(info)
        const data = infoJson;
        const nombreArchivo = 'data.txt'
        exportar(data,nombreArchivo);
        return { info }
    }


    getContactInformation().then((data)=>{
        console.log(data)
    }).catch((err) => { console.log(`[ERROR] ${err}`)})
}

(
    function(){
        chrome.runtime.onConnect.addListener((port) => {
            port.onMessage.addListener(async(message) =>{
                const {action} = message
                if (action == 'getProfile') {
                    console.log(message)
                    scrapProfile()
                }
            })
        })
    }
)()