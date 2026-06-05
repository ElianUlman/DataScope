if (!window.__fetchInterceptado) {
    window.__fetchInterceptado = true;

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        const options = args[1];

        if (options?.method === 'POST' && options?.body) {
            try {
                const data = JSON.parse(options.body);
                if (data?.model) {
                    console.log("[modelDetector] modelo detectado:", data.model, "— enviando postMessage")
                    window.postMessage({
                        source: "IA_DETECTOR_INJECTED",
                        model: data.model
                    }, "*");
                    console.log("[modelDetector] postMessage enviado")
                }
            } catch (e) {}
        }

        return originalFetch.apply(this, args);
    };
}