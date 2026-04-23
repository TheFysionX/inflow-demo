export const HOME_URL = "https://inflowai.net";
export const CONTACT_URL = "https://inflowai.net/#contact-us";
export const CONSENT_SESSION_KEY = "inflow_demo_consent_v1";
export const ACCESS_TERMS_PATH = "/access-terms";
const DEFAULT_API_URL = "https://inflow-demo.theo-lupescu.workers.dev/chat";
export const chatConfig = {
    headerTitle: "Inflow",
    contactHref: CONTACT_URL,
    accent: "#7C5CFF",
    bg: "#242323",
    surface: "#292728",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.72)",
    border: "rgba(255,255,255,0.10)",
    apiUrl: import.meta.env.VITE_INFLOW_API_URL || DEFAULT_API_URL,
    apiTimeoutMs: 0,
    minThinkingMs: 450,
    radius: 22,
    outerPadding: 0,
    demoLatencyMs: 900,
    typeSpeedCps: 40,
    avatarSize: 32,
    assistantAvatarUrl: "/inflow-favicon.png",
    watermarkImageUrl: "/inflow-favicon.png",
    watermarkLabel: "Inflow AI",
    dayTradingLottieUrl: "https://lottie.host/cc9c92f2-2d30-4484-9369-a3204aa8f76b/1nQD604WiQ.json",
    fitnessLottieUrl: "https://lottie.host/e86e94b2-d3ff-486f-9452-e752ccc2cc7c/akWRXz5lr0.json",
    selfImprovementLottieUrl: "https://lottie.host/bfe4a0a3-d5d5-449b-8e7a-e14e92465c82/ephTdyQ3ot.json",
    dayTradingLottieScale: 1.25,
    fitnessLottieScale: 0.85,
    selfImprovementLottieScale: 0.5,
    fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    textScale: 1.1,
    starter1: "Hey man, saw your videos on Daytrading and I've wanted to get into that",
    starter2: "It said to DM you TRADE on one of your ig videos",
    starter3: "Can trading really make me a full time income?",
};
