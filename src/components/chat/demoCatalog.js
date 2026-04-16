export const DEMO_ORDER = [
    "day_trading",
    "fitness_health",
    "self_improvement",
]

export const DEMO_CATALOG = {
    day_trading: {
        slug: "day-trading",
        title: "Day Trading",
        locked: false,
        selectorLabel: "Day Trading",
        selectorDesc:
            "Qualification, rapport, and pain-point discovery.",
        subtitle: "DM-style qualifier + next-step framing",
        intro: "This is a **demo conversation**. Responses are generated from pre-filled example parameters to showcase flow, tone, and structure - not real trading advice.",
        lottieSrcKey: "dayTradingLottieUrl",
        lottieScaleKey: "dayTradingLottieScale",
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
                reason_short:
                    "They came from content and want to start trading, so we need their intent first.",
                reason_long:
                    "This is the first message, so the main job is to understand what they actually want from trading. They said they want to get into it, but that can mean a few different things. A simple intent question keeps it DM native and sets up the next steps clean.",
            },
            {
                reply: "Got you. Quick one - are you trying to learn it for extra income, replace your income, or just understand the markets?",
                stage: "opening",
                missing_required: ["entry_intent"],
                next_focus: "entry_intent",
            },
            {
                reply: "Makes sense. What's your starting point right now - brand new, paper trading, or already taking small live trades?",
                stage: "opening",
                missing_required: ["baseline_experience"],
                next_focus: "baseline_experience",
            },
        ],
    },
    fitness_health: {
        slug: "fitness-health",
        title: "Fitness / Health",
        locked: true,
        selectorLabel: "Fitness / Health",
        selectorDesc: "Goal capture and tailored follow-up.",
        subtitle: "Goal intake and next-step routing",
        intro: "This is a **demo conversation**. Responses are mocked to demonstrate how the assistant collects goals, constraints, and adherence signals - not medical advice.",
        lottieSrcKey: "fitnessLottieUrl",
        lottieScaleKey: "fitnessLottieScale",
        canned: [
            {
                reply: "Alright - what's the main goal right now: fat loss, muscle gain, or just feeling better day-to-day?",
                stage: "opening",
                missing_required: ["primary_goal"],
                next_focus: "primary_goal",
            },
            {
                reply: "What's your current routine like? Even if it's inconsistent - workouts per week plus what you usually eat in a normal day.",
                stage: "opening",
                missing_required: ["baseline_routine"],
                next_focus: "baseline_routine",
            },
            {
                reply: "What's the biggest thing that keeps throwing you off - time, motivation, cravings, or not knowing what to do?",
                stage: "opening",
                missing_required: ["main_constraint"],
                next_focus: "main_constraint",
            },
        ],
    },
    self_improvement: {
        slug: "self-improvement",
        title: "Self-Improvement",
        locked: true,
        selectorLabel: "Self-Improvement",
        selectorDesc: "Intent clarity, friction, and next-step planning.",
        subtitle: "Clarify the issue, then define the next step",
        intro: "This is a **demo conversation**. Responses are mocked to show how the assistant narrows intent, identifies friction, and proposes a simple plan.",
        lottieSrcKey: "selfImprovementLottieUrl",
        lottieScaleKey: "selfImprovementLottieScale",
        canned: [
            {
                reply: "Real question - what are you trying to change first: discipline, confidence, focus, or consistency?",
                stage: "opening",
                missing_required: ["change_target"],
                next_focus: "change_target",
            },
            {
                reply: "What does a 'good week' look like for you right now - like, what would be noticeably different?",
                stage: "opening",
                missing_required: ["success_definition"],
                next_focus: "success_definition",
            },
            {
                reply: "Where do you get stuck most - starting, staying consistent, or bouncing back after you slip?",
                stage: "opening",
                missing_required: ["friction_point"],
                next_focus: "friction_point",
            },
        ],
    },
}

export function getDemoMeta(demoKey) {
    return DEMO_CATALOG[demoKey] || null
}

export function getDemoKeyFromSlug(slug) {
    return (
        DEMO_ORDER.find((demoKey) => DEMO_CATALOG[demoKey].slug === slug) ||
        null
    )
}

export function getDemoPath(demoKey) {
    const demo = getDemoMeta(demoKey)
    return demo ? `/demo/${demo.slug}` : "/demo"
}

export function getDemoCards(config) {
    return DEMO_ORDER.map((demoKey) => {
        const demo = DEMO_CATALOG[demoKey]
        return {
            key: demoKey,
            label: demo.selectorLabel,
            desc: demo.selectorDesc,
            lottie: config[demo.lottieSrcKey],
            lottieScale: config[demo.lottieScaleKey],
            locked: demo.locked === true,
        }
    })
}
