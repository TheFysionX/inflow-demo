export const uid = () =>
    Math.random().toString(36).slice(2) + Date.now().toString(36)

export const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

export const UI_VERSION = "v2026-04-24-04"
export const DEVTEST_ENABLED_KEY = "inflow_devtest_enabled"
export const LEAD_ID_KEY = "inflow_lead_id"
export const CONVERSATION_ID_KEY = "inflow_conversation_id"

function parseColor(input) {
    const s = (input || "").trim()
    if (!s) return null

    if (s[0] === "#") {
        const hex = s.slice(1)
        const isShort = hex.length === 3 || hex.length === 4
        const isLong = hex.length === 6 || hex.length === 8
        if (!isShort && !isLong) return null

        const expand = (h) => h + h
        const rHex = isShort ? expand(hex[0]) : hex.slice(0, 2)
        const gHex = isShort ? expand(hex[1]) : hex.slice(2, 4)
        const bHex = isShort ? expand(hex[2]) : hex.slice(4, 6)
        const aHex = isShort
            ? hex.length === 4
                ? expand(hex[3])
                : "FF"
            : hex.length === 8
              ? hex.slice(6, 8)
              : "FF"

        const r = parseInt(rHex, 16)
        const g = parseInt(gHex, 16)
        const b = parseInt(bHex, 16)
        const a = parseInt(aHex, 16) / 255

        if ([r, g, b].some((value) => Number.isNaN(value)) || Number.isNaN(a)) {
            return null
        }

        return { r, g, b, a: clamp(a, 0, 1) }
    }

    if (s.startsWith("rgb")) {
        const match = s.match(/rgba?\(([^)]+)\)/i)
        if (!match) return null

        const parts = match[1]
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)

        if (parts.length < 3) return null

        const to255 = (value) => {
            if (value.endsWith("%")) {
                const pct = parseFloat(value)
                if (Number.isNaN(pct)) return null
                return clamp(Math.round((pct / 100) * 255), 0, 255)
            }

            const num = parseFloat(value)
            if (Number.isNaN(num)) return null
            return clamp(Math.round(num), 0, 255)
        }

        const r = to255(parts[0])
        const g = to255(parts[1])
        const b = to255(parts[2])
        if (r === null || g === null || b === null) return null

        let a = 1
        if (parts.length >= 4) {
            const num = parseFloat(parts[3])
            if (!Number.isNaN(num)) a = clamp(num, 0, 1)
        }

        return { r, g, b, a }
    }

    return null
}

export function withAlpha(color, alpha) {
    const parsed = parseColor(color)
    if (!parsed) return color
    return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${clamp(alpha, 0, 1)})`
}

export function round1(n) {
    return Math.round(n * 10) / 10
}

export function computeDemoCardLayout(viewportWidth, viewportHeight) {
    const safeWidth = clamp(viewportWidth || 1440, 320, 4096)
    const safeHeight = clamp(viewportHeight || 900, 560, 2160)
    const columns = safeWidth < 760 ? 1 : safeWidth < 1180 ? 2 : 3
    const gap = Math.round(safeWidth * (columns === 1 ? 0.038 : 0.024))
    const sidePadding = Math.round(safeWidth * (columns === 1 ? 0.05 : 0.06))
    const maxHeight = safeHeight * (columns === 1 ? 0.58 : 0.7)
    const widthByHeight = maxHeight * (9 / 16)
    const widthByViewport =
        columns === 3 ? safeWidth * 0.24 : columns === 2 ? safeWidth * 0.34 : safeWidth * 0.82
    const widthByAvailable =
        (safeWidth - sidePadding * 2 - gap * (columns - 1)) / columns
    const width = Math.min(widthByHeight, widthByViewport, widthByAvailable)
    const height = width * (16 / 9)

    return {
        columns,
        gap,
        sidePadding,
        width: Math.round(width),
        height: Math.round(height),
    }
}
