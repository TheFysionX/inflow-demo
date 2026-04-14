function createAnalyticsId(prefix) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `${prefix}${crypto.randomUUID()}`
    }

    return `${prefix}${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

const BROWSER_ID_KEY = "inflow_analytics_browser_id"
const PAGE_SESSION_ID_KEY = "inflow_analytics_page_session_id"

function readStoredValue(storage, key) {
    try {
        return storage.getItem(key) || ""
    } catch {
        return ""
    }
}

function writeStoredValue(storage, key, value) {
    try {
        storage.setItem(key, value)
    } catch { }
}

export function getAnalyticsIdentity() {
    if (typeof window === "undefined") {
        return {
            browserId: "",
            pageSessionId: "",
        }
    }

    const browserId =
        readStoredValue(window.localStorage, BROWSER_ID_KEY) ||
        createAnalyticsId("b_")
    const pageSessionId =
        readStoredValue(window.sessionStorage, PAGE_SESSION_ID_KEY) ||
        createAnalyticsId("ps_")

    writeStoredValue(window.localStorage, BROWSER_ID_KEY, browserId)
    writeStoredValue(window.sessionStorage, PAGE_SESSION_ID_KEY, pageSessionId)

    return { browserId, pageSessionId }
}

export function deriveAnalyticsUrl(apiUrl) {
    const raw = typeof apiUrl === "string" ? apiUrl.trim() : ""
    if (!raw) {
        return ""
    }

    try {
        const base =
            typeof window !== "undefined" && window.location
                ? window.location.href
                : "http://localhost"
        const url = new URL(raw, base)
        url.pathname = url.pathname.replace(/\/chat\/?$/, "/analytics")
        return url.toString()
    } catch {
        return raw.replace(/\/chat\/?$/, "/analytics")
    }
}

export function getPagePath() {
    if (typeof window === "undefined" || !window.location) {
        return "/"
    }

    const { pathname, search, hash } = window.location
    return `${pathname || "/"}${search || ""}${hash || ""}`
}

export function getNavigationTimingMetrics() {
    if (typeof performance === "undefined" || typeof performance.getEntriesByType !== "function") {
        return null
    }

    const [entry] = performance.getEntriesByType("navigation")
    if (!entry) {
        return null
    }

    return {
        type: entry.type || "navigate",
        domInteractiveMs: Math.round(entry.domInteractive || 0),
        domCompleteMs: Math.round(entry.domComplete || 0),
        loadEventEndMs: Math.round(entry.loadEventEnd || 0),
        responseEndMs: Math.round(entry.responseEnd || 0),
        transferSize: Number(entry.transferSize || 0),
        encodedBodySize: Number(entry.encodedBodySize || 0),
        decodedBodySize: Number(entry.decodedBodySize || 0),
    }
}

export function sendAnalyticsBatch(analyticsUrl, payload, options = {}) {
    const url = typeof analyticsUrl === "string" ? analyticsUrl.trim() : ""
    const events = Array.isArray(payload?.events) ? payload.events : []
    if (!url || events.length === 0) {
        return Promise.resolve(false)
    }

    const body = JSON.stringify(payload)
    if (options.useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        try {
            const ok = navigator.sendBeacon(
                url,
                new Blob([body], { type: "application/json" })
            )
            return Promise.resolve(ok)
        } catch { }
    }

    const headers = {
        "Content-Type": "application/json",
    }
    if (payload.leadId) {
        headers["X-Inflow-Lead-Id"] = payload.leadId
    }
    if (payload.conversationId) {
        headers["X-Inflow-Conversation-Id"] = payload.conversationId
    }
    if (payload.browserId) {
        headers["X-Inflow-Browser-Id"] = payload.browserId
    }
    if (payload.pageSessionId) {
        headers["X-Inflow-Page-Session-Id"] = payload.pageSessionId
    }

    return fetch(url, {
        method: "POST",
        headers,
        body,
        keepalive: true,
    })
        .then((res) => res.ok)
        .catch(() => false)
}
