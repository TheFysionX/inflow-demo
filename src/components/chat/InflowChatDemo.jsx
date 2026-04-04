import * as React from "react"
import LottieHoverIcon from "./LottieHoverIcon"
import StyleTag from "./StyleTag"
import { BotBlobAvatar, MessageBubble } from "./ChatPrimitives"
import { DEMO_CATALOG, getDemoCards, getDemoMeta } from "./demoCatalog"
import {
    clamp,
    computeDemoCardLayout,
    CONVERSATION_ID_KEY,
    DEVTEST_ENABLED_KEY,
    LEAD_ID_KEY,
    UI_VERSION,
    uid,
} from "./chatUtils"
import { styles } from "./chatStyles"

function getViewportSize() {
    if (typeof window === "undefined") {
        return { width: 1440, height: 900 }
    }

    return { width: window.innerWidth, height: window.innerHeight }
}

function getInitialMessages(demoKey) {
    if (!demoKey || !DEMO_CATALOG[demoKey]) {
        return []
    }

    return [{ id: uid(), role: "system", text: DEMO_CATALOG[demoKey].intro }]
}

const THINKING_STAGE_LABELS = {
    opening: "Reviewing conversation context",
    discovery: "Reviewing discovery signals",
    mid_qualification: "Checking qualification signals",
    closing_prep: "Preparing the close path",
    closing: "Checking outcome state",
    handoff: "Reviewing handoff conditions",
    devtest: "Preparing test response",
}

const THINKING_FOCUS_LABELS = {
    entry_intent: "Clarifying user intent",
    baseline_experience: "Checking experience level",
    primary_goal: "Reviewing goal signals",
    baseline_routine: "Reviewing current routine",
    main_constraint: "Checking constraints",
    change_target: "Clarifying the target",
    success_definition: "Defining success",
    friction_point: "Looking at friction points",
    budget_fit: "Checking budget fit",
    schedule_lock: "Checking schedule fit",
    pain_clarity: "Clarifying the main pain point",
    human_handoff: "Reviewing handoff conditions",
    post_qualification_followup: "Preparing the follow-up",
    manual_review: "Checking qualification state",
    contact_offer: "Preparing the contact handoff",
    devtest_command: "Loading test controls",
}

function getThinkingSequence(meta) {
    const stage = meta?.stage || meta?.filled?.last_stage
    const nextFocus = meta?.next_focus
    const stageText =
        THINKING_STAGE_LABELS[stage] || "Analyzing conversation state"
    const focusText =
        THINKING_FOCUS_LABELS[nextFocus] || "Choosing the next best question"

    return [
        { delay: 0, text: "Reviewing conversation context" },
        { delay: 3200, text: stageText },
        { delay: 8200, text: focusText },
        { delay: 15800, text: "Preparing the reply" },
        { delay: 22600, text: "Finalizing the response" },
    ]
}

export default function InflowChatDemo(props) {
    const { accent, bg, surface, border, text, muted, radius, outerPadding, headerTitle, apiUrl, apiTimeoutMs, minThinkingMs, demoLatencyMs, typeSpeedCps, avatarSize, assistantAvatarUrl, watermarkImageUrl, watermarkLabel, fontFamily, textScale, dayTradingLottieUrl, fitnessLottieUrl, selfImprovementLottieUrl, dayTradingLottieScale, fitnessLottieScale, selfImprovementLottieScale, starter1, starter2, starter3, contactHref, demoKey = null, onSelectDemo, onExitChat, onResetToConsent, } = props;
    // IMPORTANT: In Framer preview/published pages, Color controls can be emitted as rgb()/rgba() strings.
    // Anywhere we need an "accent with alpha" we must NOT do string concat like `${accent}22`.
    // We normalize those via withAlpha(...) so the UI is consistent between Editor and Preview.
    const C = React.useMemo(() => ({
        accent: accent || "#7C5CFF",
        bg: bg || "#242323",
        surface: surface || "#292728",
        border: border || "rgba(255,255,255,0.10)",
        text: text || "#FFFFFF",
        muted: muted || "rgba(255,255,255,0.72)",
        fontFamily: (fontFamily || "").trim() ||
            'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        scale: clamp(textScale || 1.0, 0.9, 1.25),
    }), [accent, bg, surface, border, text, muted, fontFamily, textScale]);
    const demo = demoKey || null;
    const [messages, setMessages] = React.useState(() => getInitialMessages(demo));
    const [input, setInput] = React.useState("");
    const [isThinking, setIsThinking] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [showJump, setShowJump] = React.useState(false);
    const [thinkingNote, setThinkingNote] = React.useState("Thinking");
    const [cardsHoverReady, setCardsHoverReady] = React.useState(false);
    const [hoveredCard, setHoveredCard] = React.useState(null);
    const [pickerLayout, setPickerLayout] = React.useState(() => {
        const viewport = getViewportSize();
        return computeDemoCardLayout(viewport.width, viewport.height);
    });
    const [devTestEnabled, setDevTestEnabled] = React.useState(() => {
        try {
            return window.localStorage.getItem(DEVTEST_ENABLED_KEY) === "1";
        }
        catch {
            return false;
        }
    });
    const [latestIds, setLatestIds] = React.useState({});
    const scrollerRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const sendingRef = React.useRef(false);
    const abortReasonRef = React.useRef(null);
    // timers/cancel tokens
    const thinkingTimersRef = React.useRef([]);
    const typingCancelRef = React.useRef({
        cancelled: false,
    });
    const abortRef = React.useRef(null);
    const demoCards = React.useMemo(() => getDemoCards({
        dayTradingLottieUrl,
        fitnessLottieUrl,
        selfImprovementLottieUrl,
        dayTradingLottieScale,
        fitnessLottieScale,
        selfImprovementLottieScale,
    }), [
        dayTradingLottieUrl,
        fitnessLottieUrl,
        selfImprovementLottieUrl,
        dayTradingLottieScale,
        fitnessLottieScale,
        selfImprovementLottieScale,
    ]);
    const handoffHit = React.useMemo(() => messages.some((m) => m.role === "assistant" && m.meta?.filled?.needs_handoff), [messages]);
    const { lastAssistantMeta, threadClosed, lastQualSignal, } = React.useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.role === "assistant" && msg.meta) {
                const signal = msg.meta.filled?.qualification_signal;
                return {
                    lastAssistantMeta: msg.meta,
                    threadClosed: msg.meta.filled?.thread_closed === true,
                    lastQualSignal: signal === "qualified" || signal === "unqualified"
                        ? signal
                        : "unclear",
                };
            }
        }
        return {
            lastAssistantMeta: null,
            threadClosed: false,
            lastQualSignal: "unclear",
        };
    }, [messages]);
    const shouldDisableSend = isThinking || isTyping || handoffHit || input.trim().length === 0;
    const DEMOS = React.useMemo(() => ({
        day_trading: {
            title: "Day Trading",
            subtitle: "DM-style qualifier + next-step framing",
            intro: "This is a **demo sandbox**. Responses are generated from pre-filled example parameters to showcase flow, tone, and structure — not real trading advice.",
            canned: [
                {
                    reply: "Bet, appreciate you tapping in. What are you trying to get out of trading right now?",
                    stage: "opening",
                    filled: {
                        keyword: "trading",
                        qualification_signal: "unclear",
                        zoom_mentioned: false,
                        needs_handoff: false,
                        pain_lock: false,
                        last_reply_starter: "Bet appreciate you",
                        last_stage: "opening",
                        last_question_id: "OPEN_INTENT_01",
                        asked_question_ids: ["OPEN_INTENT_01"],
                    },
                    missing_required: ["entry_intent"],
                    next_focus: "entry_intent",
                    reason_short: "They came from content and want to start trading, so we need their intent first.",
                    reason_long: "This is the first message, so the main job is to understand what they actually want from trading. They said they want to get into it, but that can mean a few different things. A simple intent question keeps it DM native and sets up the next steps clean.",
                },
                {
                    reply: "Got you. Quick one — are you trying to learn it for extra income, replace your income, or just understand the markets?",
                    stage: "opening",
                    missing_required: ["entry_intent"],
                    next_focus: "entry_intent",
                },
                {
                    reply: "Makes sense. What’s your starting point right now — brand new, paper trading, or already taking small live trades?",
                    stage: "opening",
                    missing_required: ["baseline_experience"],
                    next_focus: "baseline_experience",
                },
            ],
        },
        fitness_health: {
            title: "Fitness / Health",
            subtitle: "Simple intake → tailored next question",
            intro: "This is a **demo sandbox**. Responses are mocked to demonstrate how the assistant collects goals, constraints, and adherence signals — not medical advice.",
            canned: [
                {
                    reply: "Alright — what’s the main goal right now: fat loss, muscle gain, or just feeling better day-to-day?",
                    stage: "opening",
                    missing_required: ["primary_goal"],
                    next_focus: "primary_goal",
                },
                {
                    reply: "What’s your current routine like? Even if it’s inconsistent — workouts per week + what you usually eat in a normal day.",
                    stage: "opening",
                    missing_required: ["baseline_routine"],
                    next_focus: "baseline_routine",
                },
                {
                    reply: "What’s the biggest thing that keeps throwing you off — time, motivation, cravings, or not knowing what to do?",
                    stage: "opening",
                    missing_required: ["main_constraint"],
                    next_focus: "main_constraint",
                },
            ],
        },
        self_improvement: {
            title: "Self-Improvement",
            subtitle: "Clarity → leverage point → plan",
            intro: "This is a **demo sandbox**. Responses are mocked to show how the assistant narrows intent, identifies friction, and proposes a simple plan.",
            canned: [
                {
                    reply: "Real question — what are you trying to change first: discipline, confidence, focus, or consistency?",
                    stage: "opening",
                    missing_required: ["change_target"],
                    next_focus: "change_target",
                },
                {
                    reply: "What does a ‘good week’ look like for you right now — like, what would be noticeably different?",
                    stage: "opening",
                    missing_required: ["success_definition"],
                    next_focus: "success_definition",
                },
                {
                    reply: "Where do you get stuck most — starting, staying consistent, or bouncing back after you slip?",
                    stage: "opening",
                    missing_required: ["friction_point"],
                    next_focus: "friction_point",
                },
            ],
        },
    }), []);
    const clearThinkingSequence = React.useCallback(() => {
        thinkingTimersRef.current.forEach((timerId) =>
            window.clearTimeout(timerId)
        );
        thinkingTimersRef.current = [];
    }, []);
    const startThinkingSequence = React.useCallback((meta) => {
        const sequence = getThinkingSequence(meta);
        clearThinkingSequence();
        if (!sequence.length) {
            setThinkingNote("Reviewing conversation context");
            return;
        }
        setThinkingNote(sequence[0].text);
        thinkingTimersRef.current = sequence.slice(1).map((item) =>
            window.setTimeout(() => {
                setThinkingNote(item.text);
            }, item.delay)
        );
    }, [clearThinkingSequence]);
    const stopAll = React.useCallback(() => {
        clearThinkingSequence();
        if (abortRef.current)
            abortRef.current.abort();
        abortRef.current = null;
        typingCancelRef.current.cancelled = true;
        setIsThinking(false);
        setIsTyping(false);
    }, [clearThinkingSequence]);
    const scrollToBottom = React.useCallback(() => {
        const el = scrollerRef.current;
        if (!el)
            return;
        el.scrollTop = el.scrollHeight;
    }, []);
    const normalizeId = React.useCallback((v) => {
        const trimmed = (v || "").trim();
        return trimmed || undefined;
    }, []);
    const getStoredThreadIds = React.useCallback(() => {
        try {
            return {
                lead_id: normalizeId(window.localStorage.getItem(LEAD_ID_KEY)),
                conversation_id: normalizeId(window.localStorage.getItem(CONVERSATION_ID_KEY)),
            };
        }
        catch {
            return { lead_id: undefined, conversation_id: undefined };
        }
    }, [normalizeId]);
    React.useEffect(() => {
        const onResize = () => {
            const viewport = getViewportSize();
            setPickerLayout(computeDemoCardLayout(viewport.width, viewport.height));
        };
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, []);
    React.useEffect(() => {
        stopAll();
        setInput("");
        setMessages(getInitialMessages(demo));
        setThinkingNote("Reviewing conversation context");
        setShowJump(false);
        setHoveredCard(null);
        if (demo) {
            window.setTimeout(() => inputRef.current?.focus(), 50);
            return;
        }
        window.setTimeout(() => window.scrollTo({
            top: 0,
            behavior: "smooth",
        }), 0);
    }, [demo, stopAll]);
    // Enter-to-send reliability in Framer: handle Enter at window level when input is focused.
    React.useEffect(() => {
        if (!demo)
            return;
        const onKeyDown = (e) => {
            if (e.key !== "Enter")
                return;
            if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey)
                return;
            if (document.activeElement !== inputRef.current)
                return;
            e.preventDefault();
            // @ts-ignore
            onSend();
        };
        window.addEventListener("keydown", onKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", onKeyDown, {
            capture: true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demo, isThinking, isTyping, input]);
    const sendPreset = React.useCallback((text) => {
        if (handoffHit || isThinking || isTyping || !demo)
            return;
        setInput(text);
        window.setTimeout(() => {
            onSend();
        }, 0);
    }, [handoffHit, isThinking, isTyping, demo, input]);
    React.useEffect(() => {
        // Only auto-follow if user is already near the bottom.
        const el = scrollerRef.current;
        if (!el)
            return;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        if (nearBottom)
            scrollToBottom();
    }, [messages, isThinking, isTyping, scrollToBottom]);
    React.useEffect(() => {
        const el = scrollerRef.current;
        if (!el)
            return;
        const onScroll = () => {
            const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
            setShowJump(!nearBottom);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => el.removeEventListener("scroll", onScroll);
    }, [demo]);
    // Auto-grow textarea height (compact start)
    React.useLayoutEffect(() => {
        const ta = inputRef.current;
        if (!ta)
            return;
        ta.style.height = "auto";
        ta.style.height = Math.min(160, Math.max(24, ta.scrollHeight)) + "px";
    }, [input]);
    React.useEffect(() => {
        return () => stopAll();
    }, [stopAll]);
    React.useEffect(() => {
        if (demo) {
            setCardsHoverReady(false);
            return;
        }
        setCardsHoverReady(false);
        const t = window.setTimeout(() => setCardsHoverReady(true), 1100);
        return () => window.clearTimeout(t);
    }, [demo]);
    React.useEffect(() => {
        setLatestIds((prev) => {
            const stored = getStoredThreadIds();
            return {
                ...prev,
                lead_id: stored.lead_id,
                conversation_id: stored.conversation_id,
            };
        });
    }, [getStoredThreadIds]);
    React.useEffect(() => {
        try {
            window.localStorage.setItem(DEVTEST_ENABLED_KEY, devTestEnabled ? "1" : "0");
        }
        catch { }
    }, [devTestEnabled]);
    function resetConversation(nextDemo) {
        if (!nextDemo)
            return;
        stopAll();
        setInput("");
        setMessages(getInitialMessages(nextDemo));
        window.setTimeout(() => inputRef.current?.focus(), 50);
    }
    function getMockResponse(userText) {
        if (!demo)
            return { reply: "Pick a demo to start." };
        const canned = DEMO_CATALOG[demo].canned;
        const t = userText.toLowerCase();
        if (demo === "day_trading") {
            if (t.includes("begin") || t.includes("new") || t.includes("start"))
                return canned[2];
            if (t.includes("money") ||
                t.includes("income") ||
                t.includes("job"))
                return canned[1];
            return canned[0];
        }
        if (demo === "fitness_health") {
            if (t.includes("diet") || t.includes("food") || t.includes("eat"))
                return canned[1];
            if (t.includes("time") ||
                t.includes("busy") ||
                t.includes("motivation"))
                return canned[2];
            return canned[0];
        }
        if (demo === "self_improvement") {
            if (t.includes("focus") ||
                t.includes("adhd") ||
                t.includes("procrast"))
                return canned[2];
            if (t.includes("week") ||
                t.includes("goal") ||
                t.includes("routine"))
                return canned[1];
            return canned[0];
        }
        return canned[0];
    }
    function getDevTestResponse(userText) {
        const m = userText.match(/^DEVTEST:\s*(.+)$/i);
        if (!m)
            return null;
        const rawName = (m[1] || "").trim().toLowerCase();
        const key = rawName.replace(/[\s-]+/g, "_");
        function pick(items) {
            return items[Math.floor(Math.random() * items.length)];
        }
        if (key === "commands" || key === "help" || key === "list") {
            return {
                reply: "Available DEVTEST commands:\n- DEVTEST: commands\n- DEVTEST: test\n- DEVTEST: hello world\n- DEVTEST: handoff true\n- DEVTEST: qualification clear\n- DEVTEST: qualification qualified\n- DEVTEST: qualified\n- DEVTEST: qualification not clear\n- DEVTEST: qualification unclear\n- DEVTEST: unclear\n- DEVTEST: qualification unqualified\n- DEVTEST: unqualified",
                stage: "devtest",
                filled: {
                    needs_handoff: false,
                    qualification_signal: "unclear",
                    thread_closed: false,
                },
                next_focus: "devtest_command",
                reason_short: "Manual DEVTEST: command list.",
                decision_trace: {
                    docs_used: ["devtest/help", "devtest/commands"],
                },
            };
        }
        if (key === "handoff" || key === "handoff_true") {
            return {
                reply: "DEVTEST: handoff forced. This simulates the assistant deciding a human should take over.",
                stage: "handoff",
                filled: {
                    needs_handoff: true,
                    qualification_signal: "unclear",
                    thread_closed: false,
                },
                next_focus: "human_handoff",
                reason_short: "Manual DEVTEST: force handoff state.",
                decision_trace: {
                    docs_used: ["devtest/handoff", "devtest/manual_trigger"],
                },
            };
        }
        if (key === "qualification_clear" ||
            key === "qualification_qualified" ||
            key === "qualified") {
            return {
                reply: "DEVTEST: qualification marked as qualified so you can verify the green status and end-of-conversation banner.",
                stage: "closing",
                filled: {
                    needs_handoff: false,
                    qualification_signal: "qualified",
                    thread_closed: true,
                },
                next_focus: "post_qualification_followup",
                reason_short: "Manual DEVTEST: qualified closing state.",
                decision_trace: {
                    docs_used: ["devtest/qualification", "devtest/qualified"],
                },
            };
        }
        if (key === "qualification_not_clear" ||
            key === "qualification_unclear" ||
            key === "unclear") {
            return {
                reply: "DEVTEST: qualification left unclear so you can verify the yellow indicator and neutral end state.",
                stage: "closing",
                filled: {
                    needs_handoff: false,
                    qualification_signal: "unclear",
                    thread_closed: true,
                },
                next_focus: "manual_review",
                reason_short: "Manual DEVTEST: unclear qualification state.",
                decision_trace: {
                    docs_used: ["devtest/qualification", "devtest/unclear"],
                },
            };
        }
        if (key === "qualification_unqualified" || key === "unqualified") {
            return {
                reply: "DEVTEST: qualification marked as unqualified so you can verify the red end-of-conversation banner.",
                stage: "closing",
                filled: {
                    needs_handoff: false,
                    qualification_signal: "unqualified",
                    thread_closed: true,
                },
                next_focus: "contact_offer",
                reason_short: "Manual DEVTEST: unqualified closing state.",
                decision_trace: {
                    docs_used: ["devtest/qualification", "devtest/unqualified"],
                },
            };
        }
        if (key === "test" || key === "hello_world") {
            return {
                reply: "Hello world. This is a DEVTEST response with filler metadata so you can inspect the More panel and state-dependent UI.",
                stage: pick(["discovery", "mid_qualification", "closing_prep"]),
                filled: {
                    needs_handoff: false,
                    qualification_signal: pick([
                        "qualified",
                        "unqualified",
                        "unclear",
                    ]),
                    thread_closed: false,
                },
                next_focus: pick([
                    "budget_fit",
                    "schedule_lock",
                    "pain_clarity",
                ]),
                reason_short: pick([
                    "Filler reason: testing dense metadata rendering.",
                    "Filler reason: validating detail panel spacing.",
                    "Filler reason: checking visual balance and labels.",
                ]),
                decision_trace: {
                    docs_used: [
                        "devtest/randomized_preview",
                        pick(["crm_snapshot", "qa_fixture", "demo_source"]),
                        pick(["calendar_probe", "lead_router", "intent_model"]),
                    ],
                },
            };
        }
        return {
            reply: "Unknown DEVTEST. Try: DEVTEST: commands to see the full list.",
            stage: "devtest",
            filled: {
                needs_handoff: false,
                qualification_signal: "unclear",
                thread_closed: false,
            },
            next_focus: "devtest_command",
            reason_short: "Manual DEVTEST: unknown test name.",
            decision_trace: {
                docs_used: ["devtest/help"],
            },
        };
    }
    function startTypewriter(fullText, meta, debug) {
        // Cancel any prior typing loop
        typingCancelRef.current.cancelled = true;
        typingCancelRef.current = { cancelled: false };
        setIsTyping(true);
        const msgId = uid();
        setMessages((prev) => [
            ...prev,
            { id: msgId, role: "assistant", text: "", meta, debug },
        ]);
        const cps = clamp(typeSpeedCps, 10, 140);
        const baseDelay = Math.round(1000 / cps);
        let i = 0;
        const punctPause = (ch) => {
            if (ch === "." ||
                ch === "," ||
                ch === "?" ||
                ch === "!" ||
                ch === ":")
                return 90;
            return 0;
        };
        const step = () => {
            if (typingCancelRef.current.cancelled)
                return;
            i = Math.min(i + 1, fullText.length);
            const ch = fullText.charAt(i - 1);
            setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, text: fullText.slice(0, i) } : m));
            if (i >= fullText.length) {
                setIsTyping(false);
                window.setTimeout(() => inputRef.current?.focus(), 0);
                return;
            }
            const extra = punctPause(ch);
            window.setTimeout(step, baseDelay + extra);
        };
        window.setTimeout(step, baseDelay);
    }
    const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));
    function toApiMessages(ms) {
        // Don’t send your “system intro pill” to the model; it’s just UI.
        return ms
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role, content: m.text }));
    }
    async function fetchLiveResponse(nextMessages, userText) {
        // If no API URL is set, fall back to mocks.
        if (!apiUrl || !apiUrl.trim()) {
            return { data: getMockResponse(userText), debug: latestIds };
        }
        // Cancel prior in-flight request
        if (abortRef.current)
            abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        // --- timeout (0 = no abort)
        const raw = Number(apiTimeoutMs);
        const timeoutMs = Number.isFinite(raw) ? raw : 0;
        console.log("[chat] apiUrl=", apiUrl, "timeoutMs=", timeoutMs);
        let timeout = null;
        if (timeoutMs > 0) {
            timeout = window.setTimeout(() => {
                abortReasonRef.current = "timeout";
                controller.abort();
            }, clamp(timeoutMs, 2000, 600000));
        }
        try {
            const storedIds = getStoredThreadIds();
            const requestHeaders = {
                "Content-Type": "application/json",
            };
            if (storedIds.lead_id) {
                requestHeaders["X-Inflow-Lead-Id"] = storedIds.lead_id;
            }
            if (storedIds.conversation_id) {
                requestHeaders["X-Inflow-Conversation-Id"] =
                    storedIds.conversation_id;
            }
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: requestHeaders,
                signal: controller.signal,
                body: JSON.stringify({
                    demo,
                    ui_version: UI_VERSION,
                    messages: toApiMessages(nextMessages),
                }),
            });
            const debug = {
                tenant_id: normalizeId(res.headers.get("X-Inflow-Tenant-Id")),
                lead_id: normalizeId(res.headers.get("X-Inflow-Lead-Id")),
                conversation_id: normalizeId(res.headers.get("X-Inflow-Conversation-Id")),
                run_id: normalizeId(res.headers.get("X-Inflow-Run-Id")),
            };
            try {
                if (debug.lead_id) {
                    window.localStorage.setItem(LEAD_ID_KEY, debug.lead_id);
                }
                if (debug.conversation_id) {
                    window.localStorage.setItem(CONVERSATION_ID_KEY, debug.conversation_id);
                }
            }
            catch { }
            setLatestIds(debug);
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = data?.error || data?.message || `HTTP ${res.status}`;
                throw new Error(msg);
            }
            return { data: data, debug };
        }
        finally {
            if (timeout)
                window.clearTimeout(timeout);
            abortRef.current = null;
        }
    }
    async function onSend() {
        const trimmed = input.trim();
        if (!trimmed || isThinking || isTyping || handoffHit || !demo)
            return;
        if (sendingRef.current)
            return;
        sendingRef.current = true;
        const userMsg = { id: uid(), role: "user", text: trimmed };
        const nextMessages = [...messages, userMsg];
        try {
            setMessages(nextMessages);
            setInput("");
            setIsThinking(true);
            startThinkingSequence(lastAssistantMeta);
            const started = Date.now();
            const devCmdMatch = trimmed.match(/^DEVTEST:\s*(.+)$/i);
            const devCmdRaw = (devCmdMatch?.[1] || "").trim().toLowerCase();
            try {
                if (devCmdRaw === "enable") {
                    clearThinkingSequence();
                    setIsThinking(false);
                    setDevTestEnabled(true);
                    const msg = "DEVTEST enabled.";
                    startTypewriter(msg, { reply: msg, stage: "devtest" }, latestIds);
                    return;
                }
                if (devCmdRaw === "disable") {
                    clearThinkingSequence();
                    setIsThinking(false);
                    setDevTestEnabled(false);
                    const msg = "DEVTEST disabled.";
                    startTypewriter(msg, { reply: msg, stage: "devtest" }, latestIds);
                    return;
                }
                if (devCmdRaw === "status") {
                    clearThinkingSequence();
                    setIsThinking(false);
                    const msg = `DEVTEST is ${devTestEnabled ? "ON" : "OFF"}.`;
                    startTypewriter(msg, { reply: msg, stage: "devtest" }, latestIds);
                    return;
                }
                const devTest = getDevTestResponse(trimmed);
                if (devTest && !devTestEnabled) {
                    clearThinkingSequence();
                    setIsThinking(false);
                    const msg = "DEVTEST is disabled. Type DEVTEST: enable.";
                    startTypewriter(msg, { reply: msg, stage: "devtest" }, latestIds);
                    return;
                }
                if (devTest && devTestEnabled) {
                    const minMs = clamp(minThinkingMs || 0, 0, 5000);
                    const targetMs = Math.max(minMs, clamp(demoLatencyMs || 240, 120, 1200));
                    const elapsed = Date.now() - started;
                    if (elapsed < targetMs)
                        await sleep(targetMs - elapsed);
                    clearThinkingSequence();
                    setIsThinking(false);
                    startTypewriter(devTest.reply || "...", devTest, latestIds);
                    return;
                }
                const live = await fetchLiveResponse(nextMessages, trimmed);
                const minMs = clamp(minThinkingMs || 0, 0, 5000);
                const elapsed = Date.now() - started;
                if (elapsed < minMs)
                    await sleep(minMs - elapsed);
                clearThinkingSequence();
                setIsThinking(false);
                startTypewriter(live.data.reply || "...", live.data, live.debug);
            }
            catch (err) {
                // Abort = user navigated / hit Change / stopAll
                clearThinkingSequence();
                if (err?.name === "AbortError") {
                    setIsThinking(false);
                    const msg = ` Request aborted (timeout=${apiTimeoutMs}ms).`;
                    startTypewriter(msg, { reply: msg, stage: "error" });
                    return;
                }
                setIsThinking(false);
                const msg = `Request failed: ${err?.message || String(err)}`;
                startTypewriter(msg, { reply: msg, stage: "error" });
            }
        }
        finally {
            sendingRef.current = false;
        }
    }
    // Global capture stops Framer canvas from stealing keys/focus.
    const stopCapture = (e) => e.stopPropagation();
    // Which chat message is the last one? (System pill doesn't count.)
    const lastChatIdx = React.useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role !== "system")
                return i;
        }
        return -1;
    }, [messages]);
    const outcomeTime = React.useMemo(() => {
        const filled = lastAssistantMeta?.filled;
        if (!filled)
            return "";
        if (filled.confirmed_day && filled.confirmed_time) {
            return `${filled.confirmed_day} ${filled.confirmed_time}`;
        }
        if (filled.confirmed_time)
            return filled.confirmed_time;
        if (filled.booked_time)
            return filled.booked_time;
        if (filled.call_time)
            return filled.call_time;
        return "";
    }, [lastAssistantMeta]);
    if (!demo) {
        return (<div className="inflowChatDemoRoot" style={styles.root(outerPadding, C.fontFamily)} onKeyDownCapture={stopCapture} onKeyUpCapture={stopCapture}>
                <StyleTag />
                <button
                    type="button"
                    style={styles.versionTagButton}
                    onClick={() => onResetToConsent?.()}
                >
                    {UI_VERSION}
                    {devTestEnabled ? " | DEVTEST ON" : ""}
                </button>
                <div style={styles.shell(radius)}>
                    <div style={styles.topBar()}>
                        <div style={styles.landingHeader}>
                            <div style={styles.landingTitle(C.text, C.scale)}>
                                INFLOW AI
                            </div>
                            <div style={styles.landingSubtitle(C.muted, C.scale)}>
                                The future of sales
                            </div>
                        </div>
                    </div>

                    <div style={styles.pickerGrid(pickerLayout)}>
                        {demoCards.map(({ key, label, desc, lottie, lottieScale, locked, }, i) => (<button key={key} type="button" onClick={() => {
                    if (!locked)
                        onSelectDemo?.(key);
                }} onPointerEnter={() => setHoveredCard(key)} onPointerLeave={() => setHoveredCard((current) => current === key ? null : current)} onFocus={() => setHoveredCard(key)} onBlur={() => setHoveredCard((current) => current === key ? null : current)} style={{
                    ...styles.demoCard(C.border, radius, locked, i, !cardsHoverReady, pickerLayout),
                    background: styles.cardGradient(key),
                    ["--cardGlow"]: styles.cardGlowColor(key),
                    ["--cardAccent"]: styles.cardAccentColor(key),
                    ["--cardAccentSoft"]: styles.cardAccentSoftColor(key),
                    ["--cardShineTintSoft"]: styles.cardShineTintSoft(key),
                    ["--cardShineTint"]: styles.cardShineTint(key),
                    ["--cardBorderBaseSolid"]: styles.cardBorderBaseSolid(key),
                    ["--cardBorderTopBottom"]: styles.cardBorderTopBottom(key),
                    ["--cardBorderBase"]: styles.cardBorderBase(key),
                    ["--cardBorderHighlight"]: styles.cardBorderHighlight(key),
                }} className={`demoCard ${locked ? "is-locked" : ""}`} disabled={locked}>
                                    <div style={styles.cardBorderShell}>
                                        <div className="demoCardBorderCorner corner-top-left" style={styles.cardBorderCornerTopLeft}/>
                                        <div className="demoCardBorderCorner corner-top-right" style={styles.cardBorderCornerTopRight}/>
                                        <div className="demoCardBorderCorner corner-bottom-right" style={styles.cardBorderCornerBottomRight}/>
                                        <div className="demoCardBorderCorner corner-bottom-left" style={styles.cardBorderCornerBottomLeft}/>
                                        <div className="demoCardBorderRail rail-top" style={styles.cardBorderRailTop}/>
                                        <div className="demoCardBorderRail rail-right" style={styles.cardBorderRailRight}>
                                            <div className="demoCardBorderShine" style={styles.cardBorderShine}/>
                                        </div>
                                        <div className="demoCardBorderRail rail-bottom" style={styles.cardBorderRailBottom}/>
                                        <div className="demoCardBorderRail rail-left" style={styles.cardBorderRailLeft}>
                                            <div className="demoCardBorderShine" style={styles.cardBorderShine}/>
                                        </div>
                                    </div>
                                    <div style={styles.cardContentWrap}>
                                        <div style={styles.cardCrystalWrap}>
                                        <div style={{
                    ...styles.cardCrystal,
                    background: styles.cardCrystalGradient(key),
                }}/>
                                    </div>
                                    <LottieHoverIcon src={lottie} scale={lottieScale} isActive={hoveredCard === key}/>
                                    <div style={styles.cardMetaWrap(locked)}>
                                        <div style={styles.cardEyebrow(C.muted, locked)}>
                                            {locked ? "Coming Soon" : "Live Demo"}
                                        </div>
                                        <div style={styles.cardLabel(C.text, C.scale)}>
                                            {label}
                                        </div>
                                        <div style={styles.cardDescCentered(C.muted, C.scale)}>
                                            {desc}
                                        </div>
                                        {locked && (<div style={styles.cardLockPill(C.border, C.muted)}>
                                                Locked
                                            </div>)}
                                    </div>
                                    {false && locked && (<div style={styles.cardLockPill(C.border, C.muted)}>
                                            <span style={styles.lockIcon}>
                                                🔒
                                            </span>
                                            Locked
                                        </div>)}
                                    </div>
                                </button>))}
                    </div>

                    <div style={styles.footer(C.muted, C.scale)}>
                        Inflow AI Demo Service. Mocked programs and situations.
                    </div>
                </div>
            </div>);
    }
    const demoInfo = getDemoMeta(demo);
    const hasChatContent = messages.some((m) => m.role !== "system");
    const starters = [starter1, starter2, starter3].filter((s) => (s || "").trim());
    return (<div className="inflowChatDemoRoot" style={styles.root(outerPadding, C.fontFamily)} onKeyDownCapture={stopCapture} onKeyUpCapture={stopCapture} onPointerDownCapture={stopCapture} onMouseDownCapture={stopCapture}>
            <StyleTag />
            <button
                type="button"
                style={styles.versionTagButton}
                onClick={() => onResetToConsent?.()}
            >
                {UI_VERSION}
                {devTestEnabled ? " | DEVTEST ON" : ""}
            </button>

            <div style={styles.shell(radius)}>
                <div style={styles.chatTopSpacer}/>
                <div style={styles.topBar()}>
                    <div style={styles.headerRow}>
                        <div style={styles.demoLeft}>
                            <div style={styles.dot(C.accent)}/>
                            <div style={styles.demoLabel(C.text, C.scale)}>
                                Demo
                            </div>
                        </div>

                        <div style={styles.headerCenter}>
                            <div style={styles.title(C.text, C.scale)}>
                                {demoInfo.title}
                            </div>
                        </div>

                        <button type="button" onClick={() => {
            stopAll();
            onExitChat?.();
        }} style={styles.backBtn(C.border, radius, C.text, C.scale)}>
                            Change
                        </button>
                    </div>
                </div>

                <div ref={scrollerRef} style={styles.scroller}>
                    {!hasChatContent && (<div style={styles.watermarkWrap}>
                            <div style={styles.watermarkInner}>
                                {watermarkImageUrl ? (<img src={watermarkImageUrl} alt="Inflow AI" style={styles.watermarkImg} draggable={false}/>) : (<div style={styles.watermarkFallback}>
                                        <BotBlobAvatar mode="static" size={140} border={C.border}/>
                                    </div>)}
                                <div style={styles.watermarkText(C.text, C.scale)}>
                                    {watermarkLabel || "Inflow AI"}
                                </div>
                            </div>
                        </div>)}

                    <div style={styles.contentWrap()}>
                        {messages.map((m, idx) => {
            const isChat = m.role !== "system";
            const isLastChat = isChat && idx === lastChatIdx;
            const showDivider = isChat && (!isLastChat || isThinking);
            return (<React.Fragment key={m.id}>
                                    <MessageBubble msg={m} border={C.border} radius={radius} text={C.text} muted={C.muted} avatarSize={avatarSize} accent={C.accent} assistantAvatarUrl={assistantAvatarUrl || watermarkImageUrl} scale={C.scale} devTestEnabled={devTestEnabled} onRetry={() => {
                    if (demo)
                        resetConversation(demo);
                }}/>
                                    {showDivider && (<div style={styles.msgDivider(C.border, avatarSize * 2)}/>)}
                                </React.Fragment>);
        })}

                        {isThinking && (<div style={styles.msgRow(avatarSize * 2)}>
                                <div style={styles.avatarCol}>
                                    <BotBlobAvatar mode="thinking" size={avatarSize * 2} border={C.border}/>
                                </div>
                                <div style={styles.msgCol}>
                                    <div style={styles.thinkingLine(C.muted, C.scale)}>
                                        <span key={thinkingNote} style={styles.thinkingNote}>
                                            {thinkingNote}
                                        </span>
                                        <span style={styles.dotWrap}>
                                            <span style={styles.dot1}>.</span>
                                            <span style={styles.dot2}>.</span>
                                            <span style={styles.dot3}>.</span>
                                        </span>
                                    </div>
                                </div>
                            </div>)}

                        {threadClosed && (<div style={styles.outcomeWrap(avatarSize * 2)}>
                                <div style={styles.outcomeCard(lastQualSignal, C.scale)}>
                                    <div style={styles.outcomeTitle(lastQualSignal, C.scale)}>
                                        {lastQualSignal === "unqualified"
                ? "Not qualified"
                : lastQualSignal === "qualified"
                    ? "Qualified"
                    : "Conversation ended"}
                                    </div>
                                    <div style={styles.outcomeBody(C.scale)}>
                                        {lastQualSignal === "unqualified"
                ? "The AI analyzed this user as not being qualified right now. If you'd like a personalized demo, contact us."
                : lastQualSignal === "qualified"
                    ? `The AI marked this user as qualified.${outcomeTime
                        ? ` Scheduled time: ${outcomeTime}.`
                        : ""} If you'd like a personalized demo, contact us.`
                    : "This conversation has ended. If you'd like a personalized demo, contact us."}
                                    </div>
                                    <a href={contactHref ||
                "https://inflowai.net/#contact-us"} style={styles.outcomeBtn(lastQualSignal, C.scale)}>
                                        Contact us
                                    </a>
                                </div>
                            </div>)}
                    </div>

                    {showJump && (<div style={styles.jumpWrap}>
                            <button style={styles.jumpBtn(C.border, C.text, C.scale)} onClick={() => {
                scrollToBottom();
                window.setTimeout(() => inputRef.current?.focus(), 0);
            }}>
                                Jump to latest
                            </button>
                        </div>)}
                </div>

                {/* Only the chatbox has a background */}
                <div style={styles.composer()} onKeyDownCapture={stopCapture} onKeyUpCapture={stopCapture}>
                    {!hasChatContent &&
            !isThinking &&
            !isTyping &&
            !handoffHit && (<div style={styles.starterSection}>
                                <div style={styles.starterTitle(C.muted)}>
                                    Get Started
                                </div>
                                <div style={styles.starterWrap}>
                                    {starters.map((s, i) => (<button key={`${s}-${i}`} className="starterChip" style={{
                    ...styles.starterChip(C.border, C.text),
                    ["--starterHover"]: i % 3 === 0
                        ? "rgba(255,160,220,0.18)"
                        : i % 3 === 1
                            ? "rgba(170,140,255,0.18)"
                            : "rgba(140,200,255,0.18)",
                }} onClick={() => sendPreset(s)}>
                                            {s}
                                        </button>))}
                                </div>
                            </div>)}
                    <div style={styles.inputWrap(C.border)} onPointerDownCapture={stopCapture} onMouseDownCapture={stopCapture} onKeyDownCapture={stopCapture} onKeyUpCapture={stopCapture}>
                        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
            }
        }} placeholder="Message Inflow..." style={styles.textarea(C.text, C.scale)} disabled={isThinking || isTyping} autoComplete="off" autoCorrect="off" spellCheck={false} rows={1}/>
                        <button onClick={onSend} style={styles.sendBtn(C.accent, C.border, shouldDisableSend)} disabled={shouldDisableSend} aria-label="Send">
                            <span style={styles.sendIcon()}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>);
}
