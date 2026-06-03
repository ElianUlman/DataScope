if (!window.__fetchInterceptado) {
    window.__fetchInterceptado = true;

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const options = args[1];

        if (options?.method === 'POST' && options?.body) {
            try {
                const data = JSON.parse(options.body);
                if (data?.model) {
                    window.postMessage({
                        source: "IA_DETECTOR_INJECTED",
                        model: data.model
                    }, "*");
                }
            } catch (e) {}
        }
        return originalFetch.apply(this, args);
    };
}