export async function isTokenValid() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CHECK_SESSION" }, (response) => {
            resolve(response?.ok || false)
        })
    })
}

export async function checkTabAccessPermission(initializeCallback) {
    const currentUrl = window.location.href.toLowerCase();

    const storage = await chrome.storage.local.get("user");
    const allowedAis = storage.user?.allowedAis || [];

    console.log("[DataScope] Current URL:", currentUrl);
    console.log("[DataScope] Allowed AIs from user profile:", allowedAis);

    let currentAi = null;
    const isAllowed = allowedAis.some((aiName) => {
        const cleanAiName = aiName.toLowerCase().trim();
        const IS_CURRENT = currentUrl.includes(cleanAiName);
        if (IS_CURRENT) currentAi = cleanAiName;
        return IS_CURRENT;
    });

    if (currentAi) {
        await chrome.storage.local.set({ currentAi })
    }

    if (!isAllowed) {
        console.warn(`[DataScope] Extension disabled. This AI is not allowed in your settings.`);
        return;
    }

    console.log(`[DataScope] AI authorized! Initializing extension features...`);
    initializeCallback();
}