//@ts-nocheck
//TL;DR `await import` is native on Tauri
type logFunc = (...any: any[]) => void;

let info: logFunc, error: logFunc;

async function loadTauri() {
    let module = await import("tauri-plugin-log-api")
    info = module.info;
    error = module.error;
    
    await module.attachConsole().catch(e => {
        console.log('[error] The tauri logging API failed to load due to: ' + e)
        loadFallback();
    });
}

function loadFallback() {
    error = (...a) => {
        console.log("[error] " + a);
    };

    info = (...a) => {
        console.log("[info] " + a);
    }
}

if(window.__TAURI__) {
    await loadTauri();
} else {
    loadFallback();
};

export {error, info};