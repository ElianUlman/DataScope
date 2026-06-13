export async function isTokenValid() {
    console.log("[EXT AUTH] Verificando validez del token con background...");
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CHECK_SESSION" }, (response) => {
            console.log("[EXT AUTH] Respuesta de CHECK_SESSION:", response);
            resolve(response?.ok || false)
        })
    })
}

export async function checkTabAccessPermission(initializeCallback) {
    console.log("[EXT AUTH] Comprobando permisos de acceso a la pestaña actual...");
    let currentAi = await getCurrentAi()

    if (currentAi) {
        console.log(`[EXT AUTH] IA detectada y permitida: ${currentAi}`);
        await chrome.storage.local.set({ currentAi })
    }
    else{
        console.log("[EXT AUTH] URL actual no coincide con ninguna IA permitida. Abortando inicialización.");
        return;
    }

    initializeCallback();
}

export async function getCurrentAi() {
    const storage = await chrome.storage.local.get("user");
    const allowedAis = storage.user?.allowedAis || [];

    const currentUrl = window.location.href.toLowerCase();
    console.log(`[EXT AUTH] Evaluando URL: ${currentUrl} contra IAs permitidas:`, allowedAis);
    let currentAi = null;

    allowedAis.some((aiName) => {
        const cleanAiName = aiName.toLowerCase().trim();
        const IS_CURRENT = currentUrl.includes(cleanAiName);

        if (IS_CURRENT) {
            currentAi = cleanAiName;
        }
        return IS_CURRENT;
    });

    return currentAi;
}