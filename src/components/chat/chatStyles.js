import { round1, withAlpha } from "./chatUtils"

export const styles = {
    // Root is transparent so the parent/container behind shows through.
    root: (outerPadding, fontFamily) => ({
        width: "100%",
        height: "100%",
        minHeight: 0,
        position: "relative",
        background: "transparent",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: outerPadding,
        fontFamily,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
    }),
    // Outer container is transparent; only certain elements (buttons/system pill/chatbox) have fills.
    shell: (radius) => ({
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 0,
        margin: 0,
        borderRadius: radius,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    }),
    topBar: () => ({
        padding: "16px 18px 12px 18px",
        background: "transparent",
    }),
    chatTopSpacer: {
        height: "clamp(36px, 8vh, 84px)",
        flex: "0 0 auto",
    },
    landingHeader: {
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        gap: 12,
    },
    landingBadgeRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexWrap: "wrap",
    },
    landingBadge: (border, muted) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 34,
        padding: "9px 14px",
        borderRadius: 999,
        border: `1px solid ${withAlpha(border, 0.92)}`,
        background: "rgba(255,255,255,0.025)",
        color: withAlpha(muted, 0.88),
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
    }),
    landingBadgeAccent: (accent) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 34,
        padding: "9px 14px",
        borderRadius: 999,
        border: `1px solid ${withAlpha(accent, 0.34)}`,
        background: `linear-gradient(135deg, ${withAlpha(accent, 0.22)}, rgba(95,165,255,0.16))`,
        color: "rgba(255,255,255,0.96)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        boxShadow: `0 10px 28px ${withAlpha(accent, 0.12)}`,
    }),
    landingTitle: (text, scale) => ({
        color: text,
        fontSize: `clamp(${round1(58 * scale)}px, 9.8vw, ${round1(100 * scale)}px)`,
        fontWeight: 720,
        letterSpacing: "0.12em",
        lineHeight: 0.9,
        textTransform: "uppercase",
        marginRight: "-0.12em",
        whiteSpace: "nowrap",
    }),
    landingSubtitle: (muted, scale) => ({
        color: withAlpha(muted, 0.94),
        fontSize: `clamp(${round1(17 * scale)}px, 1.9vw, ${round1(22 * scale)}px)`,
        lineHeight: 1.18,
        fontWeight: 520,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
    }),
    landingSubSubtitle: (muted, scale) => ({
        color: withAlpha(muted, 0.92),
        fontSize: `clamp(${round1(14 * scale)}px, 1.42vw, ${round1(16.5 * scale)}px)`,
        lineHeight: 1.68,
        fontWeight: 400,
        maxWidth: 700,
    }),
    headerRow: {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 12,
    },
    demoLeft: {
        justifySelf: "start",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
    },
    demoLabel: (text, scale) => ({
        color: text,
        fontSize: round1(15.5 * scale),
        fontWeight: 600,
        letterSpacing: "-0.012em",
    }),
    headerCenter: {
        justifySelf: "center",
        display: "inline-flex",
        alignItems: "center",
    },
    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    dot: (accent) => ({
        width: 10,
        height: 10,
        borderRadius: 999,
        background: accent,
        boxShadow: `0 0 0 6px ${withAlpha(accent, 0.09)}`,
    }),
    title: (text, scale) => ({
        color: text,
        fontSize: round1(23 * scale),
        fontWeight: 700,
        letterSpacing: "-0.028em",
        lineHeight: 1.15,
    }),
    subTitle: (muted, scale) => ({
        color: muted,
        fontSize: round1(15.5 * scale),
        lineHeight: 1.4,
        marginTop: 6,
        fontWeight: 450,
    }),
    pickerGrid: (layout) => ({
        display: "grid",
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, ${layout.width}px))`,
        alignItems: "stretch",
        justifyContent: "center",
        gap: `${layout.gap}px`,
        padding: `clamp(12px, 2vh, 22px) ${layout.sidePadding}px clamp(20px, 3vh, 34px)`,
        width: "100%",
        flex: "1 1 auto",
        margin: "0 auto",
    }),
    demoCard: (border, radius, locked, index, playIntro, layout) => ({
        appearance: "none",
        border: "1px solid rgba(255,255,255,0.045)",
        background: "rgba(255,255,255,0.012)",
        borderRadius: radius - 4,
        padding: "2.9vh 2.5vw",
        textAlign: "center",
        cursor: locked ? "not-allowed" : "pointer",
        outline: "none",
        transition: "transform 180ms ease, box-shadow 220ms ease, filter 220ms ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2.4vh",
        flex: "0 0 auto",
        width: `${layout.width}px`,
        height: `${layout.height}px`,
        justifyContent: "flex-start",
        opacity: locked ? 0.55 : 1,
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
        isolation: "isolate",
        justifySelf: "center",
        animation: playIntro
            ? "cardEnter 760ms cubic-bezier(0.2, 0.8, 0.2, 1) both"
            : undefined,
        animationDelay: playIntro ? `${120 + index * 140}ms` : undefined,
    }),
    cardContentWrap: {
        position: "relative",
        zIndex: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2.4vh",
    },
    cardBorderShell: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        borderRadius: "inherit",
        zIndex: 0,
    },
    cardBorderRailTop: {
        top: 0,
        left: "24px",
        right: "24px",
        height: "22px",
        transformOrigin: "center",
    },
    cardBorderRailRight: {
        top: "22px",
        right: 0,
        bottom: "22px",
        width: "24px",
        transformOrigin: "center",
    },
    cardBorderRailBottom: {
        left: "24px",
        right: "24px",
        bottom: 0,
        height: "22px",
        transformOrigin: "center",
    },
    cardBorderRailLeft: {
        top: "22px",
        left: 0,
        bottom: "22px",
        width: "24px",
        transformOrigin: "center",
    },
    cardBorderCornerTopLeft: {
        top: 0,
        left: 0,
        width: "24px",
        height: "22px",
        borderTopLeftRadius: "inherit",
    },
    cardBorderCornerTopRight: {
        top: 0,
        right: 0,
        width: "24px",
        height: "22px",
        borderTopRightRadius: "inherit",
    },
    cardBorderCornerBottomRight: {
        right: 0,
        bottom: 0,
        width: "24px",
        height: "22px",
        borderBottomRightRadius: "inherit",
    },
    cardBorderCornerBottomLeft: {
        left: 0,
        bottom: 0,
        width: "24px",
        height: "22px",
        borderBottomLeftRadius: "inherit",
    },
    cardBorderShine: {
        top: 0,
    },
    cardHeaderRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    cardLabel: (text, scale) => ({
        color: text,
        fontWeight: 620,
        fontSize: `clamp(${round1(18 * scale)}px, 2vw, ${round1(25 * scale)}px)`,
        letterSpacing: "-0.03em",
        textTransform: "none",
    }),
    cardEyebrow: (muted, locked) => ({
        color: locked ? withAlpha(muted, 0.86) : withAlpha(muted, 0.72),
        fontSize: 11,
        lineHeight: 1.2,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 600,
    }),
    cardDesc: (muted, scale) => ({
        color: muted,
        fontSize: round1(14.6 * scale),
        lineHeight: 1.38,
        marginTop: 9,
        minHeight: 36,
        fontWeight: 450,
    }),
    cardDescCentered: (muted, scale) => ({
        color: muted,
        fontSize: `clamp(${round1(12.5 * scale)}px, 1.18vw, ${round1(14.2 * scale)}px)`,
        lineHeight: 1.55,
        marginTop: "0.25vh",
        minHeight: "6vh",
        width: "88%",
        maxWidth: "30ch",
        fontWeight: 400,
        fontStyle: "normal",
        textAlign: "center",
    }),
    cardMetaWrap: (locked = false) => ({
        marginTop: "auto",
        width: "100%",
        paddingBottom: locked ? "3.8vh" : "1.6vh",
        display: "grid",
        placeItems: "center",
        gap: "0.6vh",
    }),
    cardCrystalWrap: {
        position: "absolute",
        top: "0.6vh",
        left: "50%",
        transform: "translateX(-50%)",
        width: "auto",
        display: "flex",
        justifyContent: "center",
        margin: 0,
        pointerEvents: "none",
    },
    cardCrystal: {
        width: "0.6vh",
        height: "0.6vh",
        borderRadius: "50%",
        filter: "blur(0.05vh)",
        boxShadow: "0 0 10px rgba(255,255,255,0.45), 0 0 20px rgba(255,255,255,0.25)",
        border: "1px solid rgba(255,255,255,0.55)",
    },
    cardCrystalGradient: (key) => {
        if (key === "day_trading")
            return "radial-gradient(circle at 30% 30%, rgba(190, 160, 255, 1.0) 0%, rgba(140, 90, 255, 0.85) 45%, rgba(90, 50, 220, 0.35) 70%)";
        if (key === "fitness_health")
            return "radial-gradient(circle at 30% 30%, rgba(255, 170, 220, 1.0) 0%, rgba(255, 120, 200, 0.85) 45%, rgba(220, 80, 180, 0.35) 70%)";
        return "radial-gradient(circle at 30% 30%, rgba(255, 150, 150, 1.0) 0%, rgba(255, 90, 90, 0.85) 45%, rgba(210, 50, 50, 0.35) 70%)";
    },
    cardGlowColor: (key) => {
        if (key === "day_trading")
            return "rgba(140, 90, 255, 0.35)";
        if (key === "fitness_health")
            return "rgba(255, 120, 200, 0.35)";
        return "rgba(255, 90, 90, 0.35)";
    },
    cardAccentColor: (key) => {
        if (key === "day_trading")
            return "rgba(154, 116, 255, 0.92)";
        if (key === "fitness_health")
            return "rgba(255, 132, 210, 0.92)";
        return "rgba(255, 112, 112, 0.92)";
    },
    cardAccentSoftColor: (key) => {
        if (key === "day_trading")
            return "rgba(154, 116, 255, 0.22)";
        if (key === "fitness_health")
            return "rgba(255, 132, 210, 0.22)";
        return "rgba(255, 112, 112, 0.22)";
    },
    cardShineTint: (key) => {
        if (key === "day_trading")
            return "rgba(208, 196, 255, 0.88)";
        if (key === "fitness_health")
            return "rgba(255, 206, 228, 0.88)";
        return "rgba(255, 206, 206, 0.88)";
    },
    cardShineTintSoft: (key) => {
        if (key === "day_trading")
            return "rgba(130, 118, 168, 0.34)";
        if (key === "fitness_health")
            return "rgba(170, 116, 142, 0.34)";
        return "rgba(170, 116, 116, 0.34)";
    },
    cardBorderBase: (key) => {
        if (key === "day_trading")
            return "rgba(131, 97, 255, 0.28)";
        if (key === "fitness_health")
            return "rgba(255, 128, 204, 0.28)";
        return "rgba(255, 106, 106, 0.28)";
    },
    cardBorderBaseSolid: (key) => {
        if (key === "day_trading")
            return "rgba(131, 97, 255, 0.26)";
        if (key === "fitness_health")
            return "rgba(255, 128, 204, 0.26)";
        return "rgba(255, 106, 106, 0.26)";
    },
    cardBorderTopBottom: (key) => {
        if (key === "day_trading")
            return "rgba(102, 74, 214, 0.28)";
        if (key === "fitness_health")
            return "rgba(214, 92, 164, 0.28)";
        return "rgba(214, 84, 84, 0.28)";
    },
    cardBorderHighlight: (key) => {
        if (key === "day_trading")
            return "rgba(223, 214, 255, 0.82)";
        if (key === "fitness_health")
            return "rgba(255, 226, 242, 0.82)";
        return "rgba(255, 225, 225, 0.82)";
    },
    cardGradient: (key) => {
        if (key === "day_trading")
            return "linear-gradient(170deg, rgba(180, 160, 255, 0.00) 0%, rgba(180, 160, 255, 0.14) 100%)";
        if (key === "fitness_health")
            return "linear-gradient(170deg, rgba(255, 180, 220, 0.00) 0%, rgba(255, 180, 220, 0.14) 100%)";
        return "linear-gradient(170deg, rgba(255, 170, 170, 0.00) 0%, rgba(255, 170, 170, 0.14) 100%)";
    },
    cardLottieBox: (border) => ({
        width: 88,
        height: 88,
        borderRadius: 18,
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.03)",
        display: "grid",
        placeItems: "center",
        boxShadow: "inset 0 0 20px rgba(255,255,255,0.04)",
    }),
    cardPill: (accent, scale) => ({
        display: "inline-flex",
        alignItems: "center",
        marginTop: 12,
        padding: "8px 11px",
        borderRadius: 999,
        background: withAlpha(accent, 0.1),
        color: "rgba(255,255,255,0.92)",
        fontSize: round1(13.2 * scale),
        fontWeight: 650,
        border: `1px solid ${withAlpha(accent, 0.16)}`,
    }),
    cardPillLocked: (border, muted, scale) => ({
        display: "inline-flex",
        alignItems: "center",
        marginTop: 12,
        padding: "8px 11px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.04)",
        color: muted,
        fontSize: round1(13.2 * scale),
        fontWeight: 600,
        border: `1px solid ${border}`,
    }),
    footer: (muted, scale) => ({
        padding: "0 18px 18px 18px",
        color: muted,
        fontSize: round1(13.2 * scale),
        fontWeight: 450,
        textAlign: "center",
    }),
    backBtn: (border, radius, text, scale) => ({
        appearance: "none",
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.02)",
        color: text,
        borderRadius: radius - 10,
        padding: "8px 10px",
        fontSize: round1(13.2 * scale),
        cursor: "pointer",
        fontWeight: 600,
        letterSpacing: "-0.01em",
    }),
    scroller: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "0px 0px 0px 0px",
        display: "block",
        position: "relative",
    },
    // Subtle allowed glow: transparent → tiny accent → transparent.
    chatGlow: (accent) => ({
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `
      radial-gradient(420px 260px at 20% 92%, rgba(208, 190, 255, 0.50) 0%, rgba(208, 190, 255, 0.18) 46%, transparent 72%),
      radial-gradient(520px 320px at 55% 100%, rgba(208, 190, 255, 0.46) 0%, rgba(208, 190, 255, 0.16) 50%, transparent 76%),
      radial-gradient(360px 240px at 85% 90%, rgba(208, 190, 255, 0.40) 0%, rgba(208, 190, 255, 0.12) 50%, transparent 74%)
    `,
        opacity: 1,
    }),
    // Center the chat content with a max-width, and add a bit more side padding.
    contentWrap: () => ({
        padding: "12px 26px 12px 26px",
        maxWidth: 1120,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        position: "relative",
    }),
    msgRow: (size) => ({
        display: "grid",
        gridTemplateColumns: `${Math.max(48, size)}px 1fr`,
        gap: 12,
        padding: "12px 0",
        alignItems: "flex-start",
    }),
    // Thin separator between chat messages.
    msgDivider: (border, size) => ({
        height: 1,
        width: "100%",
        background: withAlpha(border, 0.55),
        opacity: 0.9,
        margin: `0 0 0 ${Math.max(52, size + 12)}px`, // aligns under message text
    }),
    avatarCol: {
        display: "flex",
        justifyContent: "center",
        paddingTop: 2,
    },
    msgCol: {
        minWidth: 0,
    },
    msgText: (text, isUser, scale) => ({
        color: text,
        fontSize: round1(18.2 * scale),
        lineHeight: 1.55,
        letterSpacing: "-0.014em",
        whiteSpace: "normal",
        opacity: isUser ? 0.95 : 0.92,
        fontWeight: isUser ? 450 : 400,
    }),
    handoffMessage: {
        border: "1px solid rgba(255,80,80,0.6)",
        background: "rgba(255,80,80,0.08)",
        color: "rgba(255,200,200,0.98)",
        padding: "12px 14px",
        borderRadius: 14,
        fontSize: 14,
        lineHeight: 1.45,
        display: "grid",
        gap: 10,
    },
    retryBtn: (border, text, scale) => ({
        appearance: "none",
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.04)",
        color: text,
        borderRadius: 999,
        padding: "8px 12px",
        fontSize: round1(12.8 * scale),
        cursor: "pointer",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        width: "fit-content",
    }),
    detailWrap: {
        marginTop: 10,
        display: "grid",
        gap: 8,
    },
    detailToggle: (border, text, scale) => ({
        appearance: "none",
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.03)",
        color: text,
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: round1(12.5 * scale),
        cursor: "pointer",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        width: "fit-content",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "filter 160ms ease",
    }),
    detailToggleLabel: {
        display: "inline-block",
    },
    detailToggleArrow: {
        display: "inline-block",
        fontSize: 11,
        transition: "transform 180ms ease",
        opacity: 0.8,
    },
    handoffWarning: {
        border: "1px solid rgba(255,80,80,0.6)",
        background: "rgba(255,80,80,0.08)",
        color: "rgba(255,200,200,0.98)",
        padding: "10px 12px",
        borderRadius: 12,
        fontSize: 13,
        lineHeight: 1.45,
    },
    detailPanel: (border) => ({
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.02)",
        display: "grid",
        gap: 10,
        animation: "detailOpen 180ms ease",
    }),
    detailRow: {
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 10,
        alignItems: "start",
    },
    detailBlock: {
        display: "grid",
        gap: 6,
    },
    detailLabel: {
        fontSize: 12.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.55)",
        fontWeight: 600,
    },
    detailValue: {
        fontSize: 13.5,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 1.4,
    },
    detailMonoValue: {
        fontSize: 12.5,
        lineHeight: 1.4,
        color: "rgba(255,255,255,0.85)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        wordBreak: "break-all",
    },
    qualSquare: (status) => ({
        width: 11,
        height: 11,
        display: "inline-block",
        borderRadius: 3,
        border: status === "qualified"
            ? "1px solid rgba(110,240,150,0.58)"
            : status === "unqualified"
                ? "1px solid rgba(255,120,120,0.58)"
                : "1px solid rgba(255,220,120,0.58)",
        background: status === "qualified"
            ? "rgba(74,210,110,0.95)"
            : status === "unqualified"
                ? "rgba(235,86,86,0.95)"
                : "rgba(232,188,74,0.95)",
        boxShadow: status === "qualified"
            ? "0 0 0 1px rgba(74,210,110,0.10), 0 0 10px rgba(74,210,110,0.16)"
            : status === "unqualified"
                ? "0 0 0 1px rgba(235,86,86,0.10), 0 0 10px rgba(235,86,86,0.16)"
                : "0 0 0 1px rgba(232,188,74,0.10), 0 0 10px rgba(232,188,74,0.16)",
        verticalAlign: "middle",
    }),
    detailCode: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: "rgba(255,255,255,0.85)",
        background: "rgba(0,0,0,0.25)",
        borderRadius: 10,
        padding: "8px 10px",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
    },
    thinkingLine: (muted, scale) => ({
        color: muted,
        fontSize: round1(14.6 * scale),
        opacity: 0.9,
        paddingTop: 6,
        fontWeight: 450,
    }),
    dotWrap: {
        display: "inline-flex",
        gap: 3,
        marginLeft: 6,
    },
    dot1: {
        display: "inline-block",
        animation: "dotJump 1.1s ease-in-out infinite",
    },
    dot2: {
        display: "inline-block",
        animation: "dotJump 1.1s ease-in-out infinite 0.15s",
    },
    dot3: {
        display: "inline-block",
        animation: "dotJump 1.1s ease-in-out infinite 0.3s",
    },
    thinkingNote: {
        display: "inline-block",
        animation: "thinkingSwap 220ms ease",
    },
    outcomeWrap: (size) => ({
        margin: `8px 0 0 ${Math.max(52, size + 12)}px`,
        paddingBottom: 8,
    }),
    outcomeCard: (status, scale) => ({
        border: status === "qualified"
            ? "1px solid rgba(100,220,140,0.34)"
            : status === "unqualified"
                ? "1px solid rgba(255,110,110,0.34)"
                : "1px solid rgba(255,210,110,0.34)",
        background: status === "qualified"
            ? "rgba(58,145,84,0.12)"
            : status === "unqualified"
                ? "rgba(170,58,58,0.12)"
                : "rgba(180,140,52,0.12)",
        borderRadius: 16,
        padding: "14px 14px 13px 14px",
        display: "grid",
        gap: 10,
        boxShadow: status === "qualified"
            ? "0 10px 28px rgba(58,145,84,0.10)"
            : status === "unqualified"
                ? "0 10px 28px rgba(170,58,58,0.10)"
                : "0 10px 28px rgba(180,140,52,0.08)",
        backdropFilter: "blur(4px)",
        maxWidth: 560,
        width: "100%",
        fontSize: round1(14 * scale),
    }),
    outcomeTitle: (status, scale) => ({
        fontSize: round1(15.8 * scale),
        lineHeight: 1.2,
        fontWeight: 650,
        letterSpacing: "-0.02em",
        color: status === "qualified"
            ? "rgba(208,255,220,0.98)"
            : status === "unqualified"
                ? "rgba(255,220,220,0.98)"
                : "rgba(255,244,204,0.98)",
    }),
    outcomeBody: (scale) => ({
        fontSize: round1(13.6 * scale),
        lineHeight: 1.48,
        color: "rgba(255,255,255,0.84)",
    }),
    outcomeBtn: (status, scale) => ({
        appearance: "none",
        border: status === "qualified"
            ? "1px solid rgba(110,240,150,0.34)"
            : status === "unqualified"
                ? "1px solid rgba(255,120,120,0.34)"
                : "1px solid rgba(255,220,120,0.34)",
        background: status === "qualified"
            ? "rgba(110,240,150,0.08)"
            : status === "unqualified"
                ? "rgba(255,120,120,0.08)"
                : "rgba(255,220,120,0.08)",
        color: "rgba(255,255,255,0.96)",
        borderRadius: 999,
        padding: "8px 12px",
        fontSize: round1(12.8 * scale),
        cursor: "pointer",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        width: "fit-content",
        transition: "filter 160ms ease, transform 160ms ease",
    }),
    jumpWrap: {
        position: "sticky",
        bottom: 96,
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
        pointerEvents: "none",
    },
    jumpBtn: (border, text, scale) => ({
        pointerEvents: "auto",
        appearance: "none",
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.03)",
        color: text,
        borderRadius: 999,
        padding: "10px 12px",
        fontSize: round1(13.2 * scale),
        cursor: "pointer",
        fontWeight: 600,
    }),
    // Keep these visually light and transparent.
    userWrap: (size) => ({
        width: size,
        height: size,
        borderRadius: 999,
        border: "none",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
    }),
    userSvg: {
        display: "block",
    },
    systemWrap: {
        display: "flex",
        justifyContent: "center",
        padding: "10px 0 12px 0",
    },
    systemPill: (border, radius, muted, scale) => ({
        maxWidth: "min(1120px, 92%)",
        padding: "12px 14px",
        borderRadius: radius - 12,
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.03)",
        color: muted,
        fontSize: round1(15.1 * scale),
        lineHeight: 1.38,
        textAlign: "center",
        fontWeight: 450,
    }),
    // Composer wrapper stays transparent; chatbox itself has the only background.
    composer: () => ({
        background: "transparent",
        padding: "10px 0 14px 0",
    }),
    inputWrap: (border) => ({
        width: "calc(100% - 36px)",
        maxWidth: 1120,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 40px",
        gap: 10,
        borderRadius: 16,
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.02)",
        padding: "10px 10px 10px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
        boxSizing: "border-box",
    }),
    starterWrap: {
        width: "calc(100% - 36px)",
        maxWidth: 1120,
        margin: "0 auto 18px auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
    },
    starterChip: (border, text) => ({
        appearance: "none",
        border: `1px solid ${border}`,
        background: "rgba(255,255,255,0.02)",
        color: text,
        borderRadius: 12,
        padding: "12px 14px",
        fontSize: 13,
        lineHeight: 1.3,
        textAlign: "left",
        cursor: "pointer",
        fontWeight: 500,
        transition: "transform 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
    }),
    starterSection: {
        width: "100%",
        display: "grid",
        gap: 10,
        marginBottom: 8,
    },
    starterTitle: (muted) => ({
        width: "calc(100% - 36px)",
        maxWidth: 1120,
        margin: "0 auto",
        color: muted,
        fontSize: 12,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 600,
        textAlign: "center",
    }),
    textarea: (text, scale) => ({
        width: "100%",
        resize: "none",
        background: "transparent",
        border: "none",
        outline: "none",
        color: text,
        fontSize: round1(18.2 * scale),
        lineHeight: "24px",
        letterSpacing: "-0.012em",
        padding: 0,
        minHeight: 24,
        maxHeight: 160,
        overflow: "auto",
        fontWeight: 450,
    }),
    sendBtn: (accent, border, disabled) => ({
        width: 40,
        height: 40,
        border: `1px solid ${disabled ? border : withAlpha(accent, 0.2)}`,
        outline: "none",
        borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.02)",
        color: "rgba(255,255,255,0.92)",
        display: "grid",
        placeItems: "center",
        transition: "transform 120ms ease, border-color 160ms ease, filter 160ms ease, opacity 160ms ease",
        opacity: disabled ? 0.55 : 1,
    }),
    sendIcon: () => ({
        width: 0,
        height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderLeft: "10px solid rgba(255,255,255,0.92)",
        transform: "translateX(1px)",
    }),
    lottieWrap: {
        width: "100%",
        height: "auto",
        display: "grid",
        placeItems: "center",
        padding: "0.6vh 0",
    },
    lottiePlayer: {
        width: "150%",
        height: "auto",
        minHeight: "40%",
    },
    lottieFallback: {
        width: 28,
        height: 28,
        borderRadius: 10,
        background: "linear-gradient(140deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06))",
        boxShadow: "0 0 18px rgba(255,255,255,0.12)",
    },
    // Two-layer bot blob avatar — transparent wrapper.
    botWrap: (size) => ({
        width: size,
        height: size,
        position: "relative",
        flex: "0 0 auto",
        borderRadius: 999,
        border: "none",
        overflow: "hidden",
        background: "transparent",
    }),
    botOuterStatic: () => ({
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.92)",
        borderRadius: "48% 52% 62% 38% / 55% 40% 60% 45%",
        opacity: 0.9,
    }),
    botInnerStatic: () => ({
        position: "absolute",
        inset: "18%",
        background: "radial-gradient(circle at 30% 30%, rgba(255,190,238,0.95) 0%, rgba(170,214,255,0.92) 55%, rgba(255,255,255,0.10) 100%)",
        borderRadius: "52% 48% 46% 54% / 50% 60% 40% 50%",
        boxShadow: "0 0 18px rgba(255,190,238,0.18)",
    }),
    botOuterThinking: () => ({
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 30% 30%, rgba(255,210,160,0.75) 0%, rgba(180,200,255,0.65) 55%, rgba(255,255,255,0.10) 100%)",
        animation: "outerPulseVar 2.4s ease-in-out infinite, blobMorph 5.2s ease-in-out infinite",
        boxShadow: "0 0 0 10px rgba(255,255,255,0.06)",
    }),
    botInnerThinking: () => ({
        position: "absolute",
        inset: "18%",
        background: "radial-gradient(circle at 30% 30%, rgba(255,210,160,0.95) 0%, rgba(170,214,255,0.92) 45%, rgba(190,120,255,0.35) 80%)",
        animation: "innerPulseVar 2.4s ease-in-out infinite, blobMorph 5.2s ease-in-out infinite",
        boxShadow: "0 0 22px rgba(255,190,238,0.20)",
    }),
    botImageWrap: (size) => ({
        width: size,
        height: size,
        borderRadius: 999,
        border: "none",
        overflow: "hidden",
        background: "transparent",
        display: "grid",
        placeItems: "center",
    }),
    botImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: "scale(1.02)",
    },
    // Watermark (centered before first message)
    watermarkWrap: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        padding: 22,
    },
    watermarkInner: {
        display: "grid",
        placeItems: "center",
        gap: 16,
        opacity: 0.2,
        transform: "translateY(-10px)",
        textAlign: "center",
    },
    watermarkImg: {
        width: "clamp(120px, 26vw, 180px)",
        height: "clamp(120px, 26vw, 180px)",
        objectFit: "contain",
        filter: "saturate(1.05)",
    },
    watermarkFallback: {
        transform: "scale(1.0)",
    },
    watermarkText: (text, scale) => ({
        color: text,
        fontSize: round1(24 * scale),
        fontWeight: 700,
        letterSpacing: "-0.035em",
    }),
    versionTagButton: {
        position: "absolute",
        right: 18,
        bottom: 16,
        border: "none",
        background: "transparent",
        fontSize: 11,
        color: "rgba(255,255,255,0.22)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: 0,
        zIndex: 5,
    },
    cardLockPill: (border, muted) => ({
        marginTop: "1.8vh",
        padding: "8px 12px 8px 32px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        color: muted,
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: "rgba(255,255,255,0.05)",
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27rgba(255,255,255,0.74)%27 stroke-width=%271.4%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M5.2 7V5.9a2.8 2.8 0 1 1 5.6 0V7m-6.3 0h7a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z%27/%3E%3C/svg%3E")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "12px center",
        backgroundSize: "13px 13px",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        whiteSpace: "nowrap",
        width: "fit-content",
    }),
    lockIcon: {
        display: "none",
    },
    chatLayer: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
}
