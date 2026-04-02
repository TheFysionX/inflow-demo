import * as React from "react"
import { styles } from "./chatStyles"

export function BotBlobAvatar({ mode, size }) {
    // NOTE: Borders/background blocks removed to keep the page transparent.
    const s = Math.round(size * 0.67);
    return (<div style={styles.botWrap(s)}>
            <div style={mode === "thinking"
            ? styles.botOuterThinking()
            : styles.botOuterStatic()}/>
            <div style={mode === "thinking"
            ? styles.botInnerThinking()
            : styles.botInnerStatic()}/>
        </div>);
}

function BotImageAvatar({ size, src }) {
    return (<div style={styles.botImageWrap(size)}>
            <img src={src} alt="Bot" style={styles.botImage} draggable={false}/>
        </div>);
}

function UserAvatar({ size }) {
    return (<div style={styles.userWrap(size)}>
            <svg width={Math.round(size * 0.8)} height={Math.round(size * 0.8)} viewBox="0 0 24 24" style={styles.userSvg} aria-hidden>
                <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.964 0a9 9 0 1 0-11.964 0m11.964 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>);
}

export function MessageBubble(props) {
    const { msg, border, radius, text, muted, avatarSize, assistantAvatarUrl, scale, devTestEnabled, onRetry, } = props;
    const isUser = msg.role === "user";
    const isSystem = msg.role === "system";
    const [showDetails, setShowDetails] = React.useState(false);
    const isHandoff = !!msg.meta?.filled?.needs_handoff;
    const qualificationSignal = msg.meta?.filled?.qualification_signal;
    const qualificationTone = qualificationSignal === "qualified"
        ? "qualified"
        : qualificationSignal === "unqualified"
            ? "unqualified"
            : "unclear";
    const renderSystem = (t) => {
        const parts = t.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((p, i) => {
            const bold = p.startsWith("**") && p.endsWith("**");
            const clean = bold ? p.slice(2, -2) : p;
            return (<span key={i} style={{ fontWeight: bold ? 650 : 450 }}>
                    {clean}
                </span>);
        });
    };
    if (isSystem) {
        return (<div style={styles.systemWrap}>
                <div style={styles.systemPill(border, radius, muted, scale)}>
                    {renderSystem(msg.text)}
                </div>
            </div>);
    }
    const avatarSizeBoosted = avatarSize * 2;
    return (<div style={styles.msgRow(avatarSizeBoosted)}>
            <div style={styles.avatarCol}>
                {isUser ? (<UserAvatar size={avatarSizeBoosted} border={border}/>) : assistantAvatarUrl ? (<BotImageAvatar size={avatarSizeBoosted} border={border} src={assistantAvatarUrl}/>) : (<BotBlobAvatar mode="static" size={avatarSizeBoosted} border={border}/>)}
            </div>
            <div style={styles.msgCol}>
                {!isHandoff ? (<div style={styles.msgText(text, isUser, scale)}>
                        {msg.text}
                    </div>) : (<div style={styles.handoffMessage}>
                        The AI has determined that it is no longer capable of
                        confidently continuing this conversation. A human would
                        be notified at this point.
                        <button style={styles.retryBtn(border, text, scale)} onClick={onRetry}>
                            Retry Chat
                        </button>
                    </div>)}
                {!isUser && msg.meta && (<div style={styles.detailWrap}>
                        <button style={styles.detailToggle(border, text, scale)} onClick={() => setShowDetails((v) => !v)}>
                            <span style={styles.detailToggleLabel}>
                                {showDetails ? "Show less" : "More"}
                            </span>
                            <span style={{
                ...styles.detailToggleArrow,
                transform: showDetails
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
            }}>
                                ▶
                            </span>
                        </button>
                        {msg.meta.filled?.needs_handoff && (<div style={styles.handoffWarning}>
                                The AI has determined that it is no longer
                                capable of confidently continuing this
                                conversation. A human would be notified at this
                                point.
                            </div>)}
                        {showDetails && (<div style={styles.detailPanel(border)}>
                                {msg.meta.stage && (<div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Stage
                                        </div>
                                        <div style={styles.detailValue}>
                                            {msg.meta.stage}
                                        </div>
                                    </div>)}
                                {msg.meta.next_focus && (<div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Next Focus
                                        </div>
                                        <div style={styles.detailValue}>
                                            {msg.meta.next_focus}
                                        </div>
                                    </div>)}
                                {msg.meta.reason_short && (<div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            Reason
                                        </div>
                                        <div style={styles.detailValue}>
                                            {msg.meta.reason_short}
                                        </div>
                                    </div>)}
                                {msg.meta.decision_trace?.docs_used && (<div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>
                                            D-Trace
                                        </div>
                                        <div style={styles.detailValue}>
                                            {Array.isArray(msg.meta.decision_trace
                        .docs_used)
                        ? msg.meta.decision_trace
                            .docs_used.length
                        : 0}
                                        </div>
                                    </div>)}
                                <div style={styles.detailRow}>
                                    <div style={styles.detailLabel}>
                                        Qualification
                                    </div>
                                    <div style={styles.detailValue}>
                                        <span style={styles.qualSquare(qualificationTone)} title={`Qualification: ${qualificationTone}`}/>
                                    </div>
                                </div>
                                {devTestEnabled && (<>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Tenant ID
                                            </div>
                                            <div style={styles.detailMonoValue}>
                                                {msg.debug?.tenant_id || "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Lead ID
                                            </div>
                                            <div style={styles.detailMonoValue}>
                                                {msg.debug?.lead_id || "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Conversation ID
                                            </div>
                                            <div style={styles.detailMonoValue}>
                                                {msg.debug?.conversation_id ||
                        "n/a"}
                                            </div>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>
                                                Run ID
                                            </div>
                                            <div style={styles.detailMonoValue}>
                                                {msg.debug?.run_id || "n/a"}
                                            </div>
                                        </div>
                                    </>)}
                            </div>)}
                    </div>)}
            </div>
        </div>);
}
