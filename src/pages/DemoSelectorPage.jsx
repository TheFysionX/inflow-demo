import * as React from "react"
import { useNavigate } from "react-router-dom"
import { chatConfig } from "../config"
import { getDemoPath } from "../components/chat/demoCatalog"

const DemoSelectorGallery = React.lazy(
    () => import("../components/selector/DemoSelectorGallery")
)

export default function DemoSelectorPage({ onResetToConsent }) {
    const navigate = useNavigate()

    const handleSelectDemo = React.useCallback(
        (demoKey) => {
            navigate(getDemoPath(demoKey))
        },
        [navigate]
    )

    return (
        <section className="chat-shell selector-page-shell">
            <div className="chat-stage selector-page-stage">
                <React.Suspense
                    fallback={
                        <div className="chat-loading">
                            Loading Inflow AI...
                        </div>
                    }
                >
                    <DemoSelectorGallery
                        config={chatConfig}
                        onSelectDemo={handleSelectDemo}
                        onResetToConsent={onResetToConsent}
                    />
                </React.Suspense>
            </div>
        </section>
    )
}
