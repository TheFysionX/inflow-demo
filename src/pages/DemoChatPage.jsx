import * as React from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { chatConfig } from "../config"
import {
    getDemoKeyFromSlug,
    getDemoMeta,
} from "../components/chat/demoCatalog"

const InflowChatDemo = React.lazy(() => import("../components/chat/InflowChatDemo"))

export default function DemoChatPage({ onResetToConsent }) {
    const navigate = useNavigate()
    const { demoSlug } = useParams()
    const demoKey = getDemoKeyFromSlug(demoSlug)
    const demoMeta = demoKey ? getDemoMeta(demoKey) : null

    if (!demoKey || demoMeta?.locked) {
        return <Navigate to="/demo" replace />
    }

    return (
        <section className="chat-shell">
            <div className="chat-stage">
                <React.Suspense
                    fallback={
                        <div className="chat-loading">
                            Loading Inflow AI...
                        </div>
                    }
                >
                    <InflowChatDemo
                        {...chatConfig}
                        demoKey={demoKey}
                        onExitChat={() => navigate("/demo")}
                        onResetToConsent={onResetToConsent}
                    />
                </React.Suspense>
            </div>
        </section>
    )
}
