import * as React from "react"
import { CONTACT_URL } from "../config"
import ExternalArrowIcon from "../components/ExternalArrowIcon"

const TitleAnimation = React.lazy(() => import("../TitleAnimation"))

export default function ConsentPage({ onProceed }) {
    const [understandsDemo, setUnderstandsDemo] = React.useState(false)
    const [acceptsUsePolicy, setAcceptsUsePolicy] = React.useState(false)

    const canProceed = understandsDemo && acceptsUsePolicy

    return (
        <section className="consent-shell">
            <div className="consent-card">
                <React.Suspense
                    fallback={
                        <div className="title-animation title-animation-fallback">
                            Inflow AI
                        </div>
                    }
                >
                    <TitleAnimation className="title-animation" />
                </React.Suspense>

                <p className="consent-lead">
                    Review the Inflow AI demo in a controlled environment
                    before entering the chat experience.
                </p>

                <div className="consent-grid">
                    <div className="consent-panel">
                        <h1>Before you continue</h1>
                        <p>
                            This page is meant for product review and guided
                            exploration. Some flows are mocked, some are
                            rate-limited, and it is not intended to be treated
                            like a public sandbox.
                        </p>
                        <ul className="consent-list">
                            <li>
                                Responses may be simulated or constrained for
                                demo purposes.
                            </li>
                            <li>
                                Do not scrape, stress-test, attack, or attempt
                                to bypass the demo.
                            </li>
                            <li>
                                If you want a real walkthrough, use the contact
                                path and we can show the live product directly.
                            </li>
                        </ul>
                        <a
                            className="inline-link"
                            href={CONTACT_URL}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Contact Inflow AI
                            <ExternalArrowIcon />
                        </a>
                    </div>

                    <div className="consent-panel consent-panel-form">
                        <label className="consent-check">
                            <input
                                type="checkbox"
                                checked={understandsDemo}
                                onChange={(event) =>
                                    setUnderstandsDemo(event.target.checked)
                                }
                            />
                            <span>
                                I understand this is a demo environment and
                                that responses may be mocked, staged, or
                                limited.
                            </span>
                        </label>

                        <label className="consent-check">
                            <input
                                type="checkbox"
                                checked={acceptsUsePolicy}
                                onChange={(event) =>
                                    setAcceptsUsePolicy(event.target.checked)
                                }
                            />
                            <span>
                                I agree not to abuse, scrape, stress-test, or
                                misuse this demo.
                            </span>
                        </label>

                        <button
                            type="button"
                            className="proceed-button"
                            onClick={() => {
                                if (canProceed) {
                                    onProceed()
                                }
                            }}
                            disabled={!canProceed}
                        >
                            Agree and proceed
                        </button>

                        <p className="consent-meta">
                            Continuing will unlock the demo selector and the
                            standalone chat previews.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
