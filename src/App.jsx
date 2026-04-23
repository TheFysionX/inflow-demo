import * as React from "react"
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom"
import {
    ACCESS_TERMS_PATH,
    CONSENT_SESSION_KEY,
    HOME_URL,
    chatConfig,
} from "./config"
import {
    DEMO_GALLERY_PATH,
    getDemoKeyFromSlug,
    getDemoMeta,
} from "./components/chat/demoCatalog"
import ExternalArrowIcon from "./components/ExternalArrowIcon"
import HelixLaunchOverlay from "./components/HelixLaunchOverlay"
import ConsentPage from "./pages/ConsentPage"
import DemoChatPage from "./pages/DemoChatPage"
import DemoSelectorPage from "./pages/DemoSelectorPage"

function ProtectedRoute({ isConsented, redirectPath, children }) {
    if (!isConsented) {
        return <Navigate to={redirectPath} replace />
    }

    return children
}

export default function App() {
    const location = useLocation()
    const navigate = useNavigate()
    const [showHelixIntro, setShowHelixIntro] = React.useState(false)
    const [isConsented, setIsConsented] = React.useState(() => {
        try {
            return window.sessionStorage.getItem(CONSENT_SESSION_KEY) === "1"
        } catch {
            return false
        }
    })

    const shellStyle = React.useMemo(
        () => ({
            "--accent": chatConfig.accent,
            "--bg": chatConfig.bg,
            "--surface": chatConfig.surface,
            "--text": chatConfig.text,
            "--muted": chatConfig.muted,
            "--border": chatConfig.border,
        }),
        []
    )

    const activeDemo = React.useMemo(() => {
        const match = location.pathname.match(/^\/(?:demos|demo)\/([^/]+)$/)
        if (!match) {
            return null
        }

        const demoKey = getDemoKeyFromSlug(match[1])
        const demoMeta = demoKey ? getDemoMeta(demoKey) : null

        return demoMeta?.locked ? null : demoMeta
    }, [location.pathname])
    const isConsentRoute = location.pathname === ACCESS_TERMS_PATH
    const isGalleryRoute =
        location.pathname === DEMO_GALLERY_PATH ||
        location.pathname === "/demo" ||
        location.pathname === "/gallery"

    const handleProceed = React.useCallback(() => {
        try {
            window.sessionStorage.setItem(CONSENT_SESSION_KEY, "1")
        } catch {
            // Ignore storage availability issues and continue.
        }

        setIsConsented(true)
        setShowHelixIntro(true)
    }, [])

    React.useEffect(() => {
        if (!showHelixIntro) return

        const timer = window.setTimeout(() => {
            setShowHelixIntro(false)
            navigate(DEMO_GALLERY_PATH)
        }, 2600)

        return () => window.clearTimeout(timer)
    }, [showHelixIntro, navigate])

    React.useEffect(() => {
        if (typeof document === "undefined") {
            return
        }

        if (activeDemo?.title) {
            document.title = `${activeDemo.title} Demo | Inflow AI`
            return
        }

        if (isGalleryRoute) {
            document.title = "Demo Gallery | Inflow AI"
            return
        }

        if (isConsentRoute) {
            document.title = "Access Terms | Inflow AI"
            return
        }

        document.title = "Inflow AI"
    }, [activeDemo?.title, isConsentRoute, isGalleryRoute])

    const handleResetToConsent = React.useCallback(() => {
        navigate(ACCESS_TERMS_PATH)
    }, [navigate])

    const handleHeaderResetChat = React.useCallback(() => {
        window.dispatchEvent(new CustomEvent("inflow-demo-reset-chat"))
    }, [])

    const handleHeaderChangeDemo = React.useCallback(() => {
        navigate(DEMO_GALLERY_PATH)
    }, [navigate])

    return (
        <div className="app-shell" style={shellStyle}>
            <header className="site-header">
                <div className="brand-block">
                    <img
                        src="/inflow-favicon.png"
                        alt=""
                        width="40"
                        height="40"
                        className="brand-icon"
                    />
                    <div className="brand-title">Product demo</div>
                </div>

                <div className="site-header-title">
                    {activeDemo?.title || ""}
                </div>

                <div className="site-header-actions">
                    {activeDemo && (
                        <button
                            type="button"
                            className="home-link header-action header-action-reset"
                            onClick={handleHeaderResetChat}
                        >
                            Reset Chat
                        </button>
                    )}
                    {activeDemo && (
                        <button
                            type="button"
                            className="home-link header-action header-action-change"
                            onClick={handleHeaderChangeDemo}
                        >
                            Change
                        </button>
                    )}
                    <a
                        className="home-link header-action"
                        href={HOME_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Back to inflowai.net
                        <ExternalArrowIcon />
                    </a>
                </div>
            </header>

            <main
                className={`app-main${isConsentRoute ? " app-main-consent" : ""}`}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={
                                    isConsented
                                        ? DEMO_GALLERY_PATH
                                        : ACCESS_TERMS_PATH
                                }
                                replace
                            />
                        }
                    />
                    <Route
                        path={ACCESS_TERMS_PATH}
                        element={<ConsentPage onProceed={handleProceed} />}
                    />
                    <Route
                        path="/terms"
                        element={<Navigate to={ACCESS_TERMS_PATH} replace />}
                    />
                    <Route
                        path={DEMO_GALLERY_PATH}
                        element={
                            <ProtectedRoute
                                isConsented={isConsented}
                                redirectPath={ACCESS_TERMS_PATH}
                            >
                                <DemoSelectorPage
                                    onResetToConsent={handleResetToConsent}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={`${DEMO_GALLERY_PATH}/:demoSlug`}
                        element={
                            <ProtectedRoute
                                isConsented={isConsented}
                                redirectPath={ACCESS_TERMS_PATH}
                            >
                                <DemoChatPage
                                    onResetToConsent={handleResetToConsent}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/demo"
                        element={<Navigate to={DEMO_GALLERY_PATH} replace />}
                    />
                    <Route
                        path="/gallery"
                        element={<Navigate to={DEMO_GALLERY_PATH} replace />}
                    />
                    <Route
                        path="/demo/:demoSlug"
                        element={
                            <Navigate
                                to={`${DEMO_GALLERY_PATH}/${location.pathname.split("/").pop()}`}
                                replace
                            />
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={
                                    isConsented
                                        ? DEMO_GALLERY_PATH
                                        : ACCESS_TERMS_PATH
                                }
                                replace
                            />
                        }
                    />
                </Routes>
            </main>
            {showHelixIntro && <HelixLaunchOverlay />}
        </div>
    )
}
