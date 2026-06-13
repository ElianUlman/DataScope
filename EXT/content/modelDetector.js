// modelDetector.js

if (!window.__fetchInterceptado) {
    window.__fetchInterceptado = true;

    // interceptar fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        const options = args[1];

        console.log("[modelDetector] fetch →", url)

        if (options?.method === 'POST' && options?.body) {
            try {
                const data = JSON.parse(options.body);
                console.log("[modelDetector] body JSON:", JSON.stringify(data, null, 2))
                if (data?.model) {
                    window.postMessage({ source: "IA_DETECTOR_INJECTED", model: data.model }, "*");
                }
            } catch (e) {
                console.log("[modelDetector] body no-JSON en:", url)
            }
        }

        return originalFetch.apply(this, args);
    };

    // interceptar XMLHttpRequest también
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._method === 'POST' && body) {
            console.log("[modelDetector] XHR POST →", this._url)
            try {
                const data = JSON.parse(body);
                console.log("[modelDetector] XHR body JSON:", JSON.stringify(data, null, 2))
                if (data?.model) {
                    window.postMessage({ source: "IA_DETECTOR_INJECTED", model: data.model }, "*");
                }
            } catch (e) {
                console.log("[modelDetector] XHR body no-JSON en:", this._url)
            }
        }
        return originalSend.apply(this, arguments);
    };
}