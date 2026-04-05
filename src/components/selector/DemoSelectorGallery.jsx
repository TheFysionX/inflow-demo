import * as React from "react"
import lottie from "lottie-web"
import { UI_VERSION } from "../chat/chatUtils"
import {
    DEMO_ORDER,
    getDemoMeta,
} from "../chat/demoCatalog"
import "./demoSelectorGallery.css"

const DEMO_FLAVOR = {
    day_trading: {
        accentClass: "accent-trading",
        availabilityLabel: "Available",
        metric: "Qualification-led",
    },
    fitness_health: {
        accentClass: "accent-fitness",
        availabilityLabel: "Locked",
        metric: "Goal-led",
    },
    self_improvement: {
        accentClass: "accent-self",
        availabilityLabel: "Locked",
        metric: "Psychology-led",
    },
}

function clampValue(n, a, b) {
    return Math.max(a, Math.min(b, n))
}

function getLayout() {
    if (typeof window === "undefined") {
        return {
            columns: 3,
            gap: 26,
            sidePadding: 44,
        }
    }

    const viewportWidth = clampValue(window.innerWidth || 1440, 320, 4096)
    const columns =
        viewportWidth < 760 ? 1 : viewportWidth < 1180 ? 2 : 3
    const gap = Math.round(
        viewportWidth * (columns === 1 ? 0.036 : 0.02)
    )
    const sidePadding = Math.round(
        viewportWidth * (columns === 1 ? 0.045 : 0.034)
    )

    return {
        columns,
        gap,
        sidePadding,
    }
}

function buildSelectorCards(config) {
    return DEMO_ORDER.map((key) => {
        const meta = getDemoMeta(key)
        const flavor = DEMO_FLAVOR[key]

        return {
            key,
            label: meta?.selectorLabel || meta?.title || key,
            desc: meta?.selectorDesc || "",
            subtitle: meta?.subtitle || "",
            sample: meta?.canned?.[0]?.reply || "",
            locked: meta?.locked === true,
            lottie:
                key === "day_trading"
                    ? config.dayTradingLottieUrl
                    : key === "fitness_health"
                      ? config.fitnessLottieUrl
                      : config.selfImprovementLottieUrl,
            lottieScale:
                key === "day_trading"
                    ? config.dayTradingLottieScale
                    : key === "fitness_health"
                      ? config.fitnessLottieScale
                      : config.selfImprovementLottieScale,
            ...flavor,
        }
    })
}

function SelectorLottie({ src, scale = 1, isActive = false }) {
    const containerRef = React.useRef(null)
    const animationRef = React.useRef(null)

    React.useEffect(() => {
        const container = containerRef.current
        if (!container || !src) return

        const animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: src,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
            },
        })

        const stopAtLastFrame = () => {
            const lastFrame = Math.max(animation.totalFrames - 1, 0)
            animation.goToAndStop(lastFrame, true)
        }

        animationRef.current = animation
        animation.addEventListener("DOMLoaded", stopAtLastFrame)

        return () => {
            animation.removeEventListener("DOMLoaded", stopAtLastFrame)
            animation.destroy()
            if (animationRef.current === animation) {
                animationRef.current = null
            }
        }
    }, [src])

    React.useEffect(() => {
        const animation = animationRef.current
        if (!animation) return

        if (isActive) {
            animation.goToAndStop(0, true)
            animation.play()
            return
        }

        const lastFrame = Math.max(animation.totalFrames - 1, 0)
        animation.goToAndStop(lastFrame, true)
    }, [isActive])

    if (!src) {
        return <div className="selector-card-visual-fallback" />
    }

    return (
        <div className="selector-card-visual-shell">
            <div
                ref={containerRef}
                className="selector-card-visual-canvas"
                style={{ transform: `scale(${scale || 1})` }}
            />
        </div>
    )
}

function StatusIcon({ locked }) {
    if (locked) {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M8 10V8a4 4 0 1 1 8 0v2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x="6.5"
                    y="10"
                    width="11"
                    height="9"
                    rx="2.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                />
            </svg>
        )
    }

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
                cx="12"
                cy="12"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M10.1 12.1 11.5 13.5 14.6 10.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default function DemoSelectorGallery({
    config,
    onSelectDemo,
    onResetToConsent,
}) {
    const cards = React.useMemo(() => buildSelectorCards(config), [config])
    const [activeKey, setActiveKey] = React.useState(null)
    const [lottieActiveKey, setLottieActiveKey] = React.useState(null)
    const [layout, setLayout] = React.useState(() => getLayout())

    React.useEffect(() => {
        const onResize = () => setLayout(getLayout())
        window.addEventListener("resize", onResize, { passive: true })
        return () => window.removeEventListener("resize", onResize)
    }, [])

    React.useEffect(() => {
        if (activeKey && !cards.some((card) => card.key === activeKey)) {
            setActiveKey(null)
        }
    }, [activeKey, cards])

    React.useEffect(() => {
        if (
            lottieActiveKey &&
            !cards.some((card) => card.key === lottieActiveKey)
        ) {
            setLottieActiveKey(null)
        }
    }, [cards, lottieActiveKey])

    return (
        <div className="selector-gallery">
            <button
                type="button"
                className="selector-version-button"
                onClick={() => onResetToConsent?.()}
            >
                {UI_VERSION}
            </button>
            <div className="selector-hero">
                <h1 className="selector-title">INFLOW AI</h1>
                <p className="selector-subtitle">
                    Choose a sandbox to preview tone, flow, and qualification
                    behavior across the current demo environments.
                </p>
            </div>

            <div
                className={`selector-card-grid columns-${layout.columns}`}
                style={{
                    "--selector-gap": `${layout.gap}px`,
                    "--selector-side-padding": `${layout.sidePadding}px`,
                }}
            >
                {cards.map((card) => {
                    const isActive = activeKey === card.key
                    const isLottieActive = lottieActiveKey === card.key
                    const lottieScale = (card.lottieScale || 1) * 1.34

                    return (
                        <div
                            key={card.key}
                            onMouseEnter={() => {
                                setLottieActiveKey(card.key)
                            }}
                            onMouseLeave={() => {
                                setLottieActiveKey((current) =>
                                    current === card.key ? null : current
                                )
                            }}
                            className="selector-card-shell"
                        >
                            <button
                                type="button"
                                disabled={card.locked}
                                aria-disabled={card.locked}
                                className={`selector-card ${card.accentClass} ${card.locked ? "is-locked" : ""} ${isActive ? "is-active" : ""}`}
                                onMouseEnter={() => {
                                    if (!card.locked) {
                                        setActiveKey(card.key)
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (!card.locked) {
                                        setActiveKey((current) =>
                                            current === card.key
                                                ? null
                                                : current
                                        )
                                    }
                                }}
                                onFocus={() => {
                                    if (!card.locked) {
                                        setActiveKey(card.key)
                                        setLottieActiveKey(card.key)
                                    }
                                }}
                                onBlur={() => {
                                    if (!card.locked) {
                                        setActiveKey((current) =>
                                            current === card.key
                                                ? null
                                                : current
                                        )
                                        setLottieActiveKey((current) =>
                                            current === card.key
                                                ? null
                                                : current
                                        )
                                    }
                                }}
                                onClick={() => {
                                    if (!card.locked) {
                                        onSelectDemo(card.key)
                                    }
                                }}
                            >
                                <div className="selector-card-top">
                                    <div className="selector-card-availability">
                                        <span
                                            className={`selector-status-icon ${card.locked ? "is-locked" : "is-live"}`}
                                        >
                                            <StatusIcon locked={card.locked} />
                                        </span>
                                        <span className="selector-status-label">
                                            {card.availabilityLabel}
                                        </span>
                                    </div>

                                    <span className="selector-card-metric">
                                        {card.metric}
                                    </span>
                                </div>

                                <div className="selector-card-visual">
                                    <SelectorLottie
                                        src={card.lottie}
                                        scale={lottieScale}
                                        isActive={isLottieActive}
                                    />
                                </div>

                                <div className="selector-card-copy">
                                    <h2>{card.label}</h2>
                                    <p>{card.desc}</p>
                                </div>

                                <div className="selector-card-bottom">
                                    <span className="selector-card-flow">
                                        {card.subtitle}
                                    </span>
                                </div>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
