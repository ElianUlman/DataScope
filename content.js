const TARGET_SELECTOR = 'div[id="prompt-textarea"]';
let editor; 

const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(TARGET_SELECTOR);

    if (element) {
        console.log("¡Elemento encontrado!", element);
        
        editor = element

        obs.disconnect(); 
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("LA EXTENSION ESTUVO ACA")