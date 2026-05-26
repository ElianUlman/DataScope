export async function isTokenValid() {
    const storage = await chrome.storage.local.get(["token", "expiresAt"]);

    if (!storage.token || !storage.expiresAt) {
        console.log("El token no existe o ha expirado.")
        return false;
    }

    const currentTime = Date.now();
    if (currentTime > storage.expiresAt) {
        console.warn("[DataScope] El token ha expirado.");
        await chrome.storage.local.remove(["token", "expiresAt", "user"]);
        return false;
    }

    return true;
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