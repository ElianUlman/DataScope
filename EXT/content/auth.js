export async function isTokenValid() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CHECK_SESSION" }, (response) => {
            resolve(response?.ok || false)
        })
    })
}

export async function checkTabAccessPermission(initializeCallback) {
    let currentAi = await getCurrentAi()

    if (currentAi) {
        await chrome.storage.local.set({ currentAi })
    }
    else{
        return;
    }

    initializeCallback();
}

export async function getCurrentAi() {
    const storage = await chrome.storage.local.get("user");
    const allowedAis = storage.user?.allowedAis || [];

    const currentUrl = window.location.href.toLowerCase();
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