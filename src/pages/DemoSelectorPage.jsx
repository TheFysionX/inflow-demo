import * as React from "react"
import { useNavigate } from "react-router-dom"
import { chatConfig } from "../config"
import { getDemoPath } from "../components/chat/demoCatalog"

const InflowChatDemo = React.lazy(() => import("../components/chat/InflowChatDemo"))

export default function DemoSelectorPage({ onResetToConsent }) {
    const navigate = useNavigate()

    const handleSelectDemo = React.useCallback(
        (demoKey) => {
            navigate(getDemoPath(demoKey))
        },
        [navigate]
    )

    return (
        <section className="chat-shell">
            <div className="chat-stage">
                <React.Suspense
                    fallback={
                        <div className="chat-loading">
                            Loading demo experience...
                        </div>
                    }
                >
                    <InflowChatDemo
                        {...chatConfig}
                        onSelectDemo={handleSelectDemo}
                        onResetToConsent={onResetToConsent}
                    />
                </React.Suspense>
            </div>
        </section>
    )
}
