import * as React from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import {
    CONSENT_SESSION_KEY,
    HOME_URL,
    chatConfig,
} from "./config"
import ExternalArrowIcon from "./components/ExternalArrowIcon"
import HelixLaunchOverlay from "./components/HelixLaunchOverlay"
import ConsentPage from "./pages/ConsentPage"
import DemoChatPage from "./pages/DemoChatPage"
import DemoSelectorPage from "./pages/DemoSelectorPage"

function ProtectedRoute({ isConsented, children }) {
    if (!isConsented) {
        return <Navigate to="/" replace />
    }

    return children
}

export default function App() {
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
            navigate("/demo")
        }, 2600)

        return () => window.clearTimeout(timer)
    }, [showHelixIntro, navigate])

    const handleResetToConsent = React.useCallback(() => {
        navigate("/")
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
                    <div>
                        <div className="brand-title">Demo | Inflow AI</div>
                        <div className="brand-subtitle">
                            Standalone product sandbox
                        </div>
                    </div>
                </div>

                <a
                    className="home-link"
                    href={HOME_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    Back to inflowai.net
                    <ExternalArrowIcon />
                </a>
            </header>

            <main className="app-main">
                <Routes>
                    <Route
                        path="/"
                        element={<ConsentPage onProceed={handleProceed} />}
                    />
                    <Route
                        path="/demo"
                        element={
                            <ProtectedRoute isConsented={isConsented}>
                                <DemoSelectorPage
                                    onResetToConsent={handleResetToConsent}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/demo/:demoSlug"
                        element={
                            <ProtectedRoute isConsented={isConsented}>
                                <DemoChatPage
                                    onResetToConsent={handleResetToConsent}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={isConsented ? "/demo" : "/"}
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
