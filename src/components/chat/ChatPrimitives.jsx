import * as React from "react"
import { styles } from "./chatStyles"

export function BotBlobAvatar({ mode, size }) {
    const s = Math.round(size * 0.67)
    return (
        <div style={styles.botWrap(s)}>
            <div
                style={
                    mode === "thinking"
                        ? styles.botOuterThinking()
                        : styles.botOuterStatic()
                }
            />
            <div
                style={
                    mode === "thinking"
                        ? styles.botInnerThinking()
                        : styles.botInnerStatic()
                }
            />
        </div>
    )
}

function BotImageAvatar({ size, src }) {
    return (
        <div style={styles.botImageWrap(size)}>
            <img src={src} alt="Bot" style={styles.botImage} draggable={false} />
        </div>
    )
}

function UserAvatar({ size }) {
    return (
        <div style={styles.userWrap(size)}>
            <svg
                width={Math.round(size * 0.8)}
                height={Math.round(size * 0.8)}
                viewBox="0 0 24 24"
                style={styles.userSvg}
                aria-hidden
            >
                <path
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.964 0a9 9 0 1 0-11.964 0m11.964 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    fill="none"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}

function humanizeToken(value) {
    const normalized = String(value ?? "")
        .replace(/[_/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    if (!normalized) {
        return ""
    }

    return normalized.replace(/\b\w/g, (character) => character.toUpperCase())
}

function compactText(value, maxLength = 140) {
    const normalized = String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
    if (!normalized || normalized.length <= maxLength) {
        return normalized
    }

    return `${normalized.slice(0, maxLength - 3).trimEnd()}...`
}

function deriveTraceCode(meta) {
    const traceCode = String(
        meta?.details?.d_trace || meta?.decision_trace?.trace_code || ""
    ).trim()
    if (traceCode) {
        return traceCode
    }

    const docCount = Array.isArray(meta?.decision_trace?.docs_used)
        ? meta.decision_trace.docs_used.length
        : 0
    return docCount > 0 ? String(1000 + docCount * 137) : ""
}

function buildBookingLabelFromMeta(filled, details) {
    const detailsLabel = String(details.booking_label || "").trim()
    if (detailsLabel) {
        return detailsLabel
    }

    const day = String(filled.confirmed_day || "").trim()
    const time = String(
        filled.confirmed_time || filled.booked_time || filled.call_time || ""
    ).trim()
    if (!day) {
        return time
    }
    if (!time) {
        return day
    }

    return time.toLowerCase().includes(day.toLowerCase())
        ? time
        : `${day} ${time}`
}

function buildDetailSummary(meta) {
    const filled =
        meta?.filled && typeof meta.filled === "object" ? meta.filled : {}
    const details =
        meta?.details && typeof meta.details === "object" ? meta.details : {}
    const qualificationSignal = String(
        filled.qualification_signal || "unclear"
    ).trim()
    const threadClosed =
        filled.thread_closed === true || meta?.state?.thread_closed === true
    const needsHandoff = filled.needs_handoff === true
    const bookingLabel = buildBookingLabelFromMeta(filled, details)
    const pathLabel = String(
        details.path_label ||
            [meta?.stage, meta?.next_focus]
                .map(humanizeToken)
                .filter(Boolean)
                .join(" / ")
    ).trim()

    return {
        statusLabel: String(
            details.status_label ||
                (needsHandoff
                    ? "Human review"
                    : threadClosed
                      ? "Conversation ended"
                      : "Live")
        ).trim(),
        traceCode: deriveTraceCode(meta),
        pathLabel,
        nextFocusLabel: String(
            details.next_focus_label || humanizeToken(meta?.next_focus)
        ).trim(),
        signalLabel: String(
            details.signal_label || humanizeToken(qualificationSignal)
        ).trim(),
        confidenceLabel: String(details.confidence_label || "").trim(),
        threadLabel: String(
            details.thread_label || (threadClosed ? "Closed" : "Open")
        ).trim(),
        bookingLabel,
        noteLabel: compactText(meta?.reason_short, 160),
    }
}

export function MessageBubble(props) {
    const {
        msg,
        border,
        radius,
        text,
        muted,
        avatarSize,
        assistantAvatarUrl,
        scale,
        devTestEnabled,
        onRetry,
    } = props
    const isUser = msg.role === "user"
    const isSystem = msg.role === "system"
    const [showDetails, setShowDetails] = React.useState(false)
    const [detailsVisible, setDetailsVisible] = React.useState(false)
    const [detailsClosing, setDetailsClosing] = React.useState(false)
    const isHandoff = !!msg.meta?.filled?.needs_handoff
    const qualificationSignal = msg.meta?.filled?.qualification_signal
    const qualificationTone =
        qualificationSignal === "qualified"
            ? "qualified"
            : qualificationSignal === "unqualified"
              ? "unqualified"
              : "unclear"
    const detailSummary = React.useMemo(
        () => buildDetailSummary(msg.meta),
        [msg.meta]
    )

    React.useEffect(() => {
        if (showDetails) {
            setDetailsVisible(true)
            setDetailsClosing(false)
            return
        }

        if (!detailsVisible) {
            return
        }

        setDetailsClosing(true)
        const timer = window.setTimeout(() => {
            setDetailsVisible(false)
            setDetailsClosing(false)
        }, 180)

        return () => window.clearTimeout(timer)
    }, [detailsVisible, showDetails])

    const renderSystem = (t) => {
        const parts = t.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((p, i) => {
            const bold = p.startsWith("**") && p.endsWith("**")
            const clean = bold ? p.slice(2, -2) : p
            return (
                <span key={i} style={{ fontWeight: bold ? 650 : 450 }}>
                    {clean}
                </span>
            )
        })
    }

    if (isSystem) {
        return (
            <div style={styles.systemWrap}>
                <div style={styles.systemPill(border, radius, muted, scale)}>
                    {renderSystem(msg.text)}
                </div>
            </div>
        )
    }

    const avatarSizeBoosted = avatarSize * 2

    return (
        <div style={styles.msgRow(avatarSizeBoosted)}>
            <div style={styles.avatarCol}>
                {isUser ? (
                    <UserAvatar size={avatarSizeBoosted} border={border} />
                ) : assistantAvatarUrl ? (
                    <BotImageAvatar
                        size={avatarSizeBoosted}
                        border={border}
                        src={assistantAvatarUrl}
                    />
                ) : (
                    <BotBlobAvatar
                        mode="static"
                        size={avatarSizeBoosted}
                        border={border}
                    />
                )}
            </div>
            <div style={styles.msgCol}>
                {!isHandoff ? (
                    <div style={styles.msgText(text, isUser, scale)}>
                        {msg.text}
                    </div>
                ) : (
                    <div style={styles.handoffMessage}>
                        The AI has determined that it is no longer capable of
                        confidently continuing this conversation. A human would
                        be notified at this point.
                        <button
                            style={styles.retryBtn(border, text, scale)}
                            onClick={onRetry}
                        >
                            Retry Chat
                        </button>
                    </div>
                )}
                {!isUser && msg.meta && (
                    <div style={styles.detailWrap}>
                        <button
                            style={styles.detailToggle(border, text, scale)}
                            onClick={() => setShowDetails((v) => !v)}
                        >
                            <span style={styles.detailToggleLabel}>
                                {showDetails ? "Show less" : "More"}
                            </span>
                            <span
                                style={{
                                    ...styles.detailToggleArrow,
                                    transform: showDetails
                                        ? "rotate(90deg)"
                                        : "rotate(0deg)",
                                }}
                            >
                                ▶
                            </span>
                        </button>
                        {msg.meta.filled?.needs_handoff && (
                            <div style={styles.handoffWarning}>
                                The AI has determined that it is no longer
                                capable of confidently continuing this
                                conversation. A human would be notified at this
                                point.
                            </div>
                        )}
                        {detailsVisible && (
                            <div
                                style={styles.detailPanel(
                                    border,
                                    detailsClosing
                                )}
                            >
                                {detailSummary.statusLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Status
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.statusLabel}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.traceCode && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            D-Trace
                                        </div>
                                        <div style={styles.detailMonoValue}>
                                            {detailSummary.traceCode}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.pathLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Path
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.pathLabel}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.nextFocusLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Next Step
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.nextFocusLabel}
                                        </div>
                                    </div>
                                )}
                                <div style={styles.detailRow}>
                                    <div style={styles.detailLabel}>
                                        Signal
                                    </div>
                                    <div style={styles.detailValue}>
                                        <span
                                            style={styles.qualSquare(
                                                qualificationTone
                                            )}
                                            title={`Qualification: ${qualificationTone}`}
                                        />
                                        <span style={{ marginLeft: 8 }}>
                                            {detailSummary.signalLabel}
                                        </span>
                                    </div>
                                </div>
                                {detailSummary.confidenceLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Confidence
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.confidenceLabel}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.threadLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Thread
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.threadLabel}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.bookingLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Booking
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.bookingLabel}
                                        </div>
                                    </div>
                                )}
                                {detailSummary.noteLabel && (
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Note
                                        </div>
                                        <div style={styles.detailValue}>
                                            {detailSummary.noteLabel}
                                        </div>
                                    </div>
                                )}
                                {devTestEnabled && (
                                    <>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Tenant ID
                                            </div>
                                            <div
                                                style={styles.detailMonoValue}
                                            >
                                                {msg.debug?.tenant_id || "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Lead ID
                                            </div>
                                            <div
                                                style={styles.detailMonoValue}
                                            >
                                                {msg.debug?.lead_id || "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Conversation ID
                                            </div>
                                            <div
                                                style={styles.detailMonoValue}
                                            >
                                                {msg.debug?.conversation_id ||
                                                    "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Run ID
                                            </div>
                                            <div
                                                style={styles.detailMonoValue}
                                            >
                                                {msg.debug?.run_id || "n/a"}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
