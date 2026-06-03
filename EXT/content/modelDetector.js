if (!window.__fetchInterceptado) {
    window.__fetchInterceptado = true;

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        const options = args[1];

        if (options?.method === 'POST' && options?.body) {
            try {
                const data = JSON.parse(options.body);
                // Log temporal para ver toda la estructura
                if (url?.includes('claude.ai')) {
                    console.log("[DS] URL:", url)
                    console.log("[DS] BODY:", JSON.stringify(data, null, 2))
                }
            } catch (e) {}
        }

        return originalFetch.apply(this, args);
    };
}