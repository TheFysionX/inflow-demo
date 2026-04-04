export default function StyleTag() {
    return (<style>{`
      .inflowChatDemoRoot { color-scheme: dark; }
      .inflowChatDemoRoot, .inflowChatDemoRoot * { box-sizing: border-box; }

      button { -webkit-tap-highlight-color: transparent; }
      button:not(:disabled):hover { filter: brightness(1.04); }
      button:not(:disabled):active { transform: translateY(1px) scale(0.99); }

      .demoCard {
        will-change: transform, box-shadow;
        --railPulseDuration: 3.83s;
        --verticalShineDuration: 5s;
      }
      .demoCardBorderRail {
        position: absolute;
        overflow: hidden;
        background: var(--cardBorderBaseSolid, rgba(255,255,255,0.2));
        opacity: 0.96;
      }
      .demoCardBorderCorner {
        position: absolute;
        background: var(--cardBorderTopBottom, rgba(255,255,255,0.14));
        opacity: 0.96;
      }
      .demoCardBorderRail.rail-top,
      .demoCardBorderRail.rail-bottom {
        background: var(--cardBorderTopBottom, rgba(255,255,255,0.14));
      }
      .demoCardBorderRail.rail-left,
      .demoCardBorderRail.rail-right {
        background: var(--cardBorderTopBottom, rgba(255,255,255,0.14));
      }
      .demoCardBorderShine {
        position: absolute;
        left: 10%;
        width: 80%;
        height: 54%;
        border-radius: inherit;
        background:
          linear-gradient(180deg,
            rgba(255,255,255,0.00) 0%,
            var(--cardShineTintSoft, rgba(255,255,255,0.24)) 20%,
            var(--cardShineTint, rgba(255,255,255,0.82)) 50%,
            rgba(255,255,255,0.08) 78%,
            rgba(255,255,255,0.00) 100%);
        filter: blur(0.15px);
        mix-blend-mode: screen;
        opacity: 0;
      }
      .demoCard:not(.is-locked):hover {
        box-shadow:
          0 18px 42px rgba(0,0,0,0.28),
          0 0 0 1px var(--cardAccentSoft, rgba(255,255,255,0.12)),
          0 28px 70px var(--cardGlow, rgba(255,255,255,0.18));
        animation: softCardPulse 2.6s ease-in-out infinite;
      }
      .demoCard:not(.is-locked):hover .demoCardBorderRail.rail-left,
      .demoCard:not(.is-locked):hover .demoCardBorderRail.rail-right {
        box-shadow:
          0 0 18px rgba(255,255,255,0.08),
          0 0 26px var(--cardAccentSoft, rgba(255,255,255,0.14));
        animation: sideBorderPulse 3.4s cubic-bezier(0.42, 0, 0.22, 1) infinite;
      }
      .demoCard:not(.is-locked):hover .demoCardBorderRail.rail-left .demoCardBorderShine,
      .demoCard:not(.is-locked):hover .demoCardBorderRail.rail-right .demoCardBorderShine {
        animation: verticalBorderShine 3.4s linear infinite;
      }
      .starterChip:hover {
        transform: translateY(-2px) scale(1.04);
        background: var(--starterHover);
        border-color: rgba(255,255,255,0.22);
        box-shadow: 0 12px 28px rgba(0,0,0,0.25);
      }
      .demoCard.is-locked {
        filter: grayscale(0.35);
      }

      @media (max-width: 920px) {
        .starterChip:hover {
          transform: translateY(-1px);
        }
      }

      @keyframes outerPulse {
        0%   { transform: scale(0.84); opacity: 0.70; border-radius: 48% 52% 62% 38% / 55% 40% 60% 45%; }
        50%  { transform: scale(1.12); opacity: 0.95; border-radius: 58% 42% 52% 48% / 45% 58% 42% 55%; }
        100% { transform: scale(0.84); opacity: 0.70; border-radius: 48% 52% 62% 38% / 55% 40% 60% 45%; }
      }
      @keyframes floaty {
        0%   { transform: translateY(-4px) scale(1.01); }
        50%  { transform: translateY(-10px) scale(1.03); }
        100% { transform: translateY(-4px) scale(1.01); }
      }
      @keyframes cardEnter {
        0% {
          opacity: 0;
          transform: translate3d(0, 18vh, 0) scale(0.98);
        }
        55% {
          opacity: 1;
        }
        100% {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @keyframes glowPulse {
        0%   { filter: drop-shadow(0 0 0 rgba(255,255,255,0.0)); }
        50%  { filter: drop-shadow(0 0 12px rgba(255,255,255,0.35)); }
        100% { filter: drop-shadow(0 0 0 rgba(255,255,255,0.0)); }
      }
      @keyframes softCardPulse {
        0%, 100% {
          transform: translateY(-5px) scale(1.004);
          box-shadow:
            0 18px 42px rgba(0,0,0,0.24),
            0 0 0 1px var(--cardAccentSoft, rgba(255,255,255,0.10)),
            0 24px 56px var(--cardGlow, rgba(255,255,255,0.14));
        }
        50% {
          transform: translateY(-7px) scale(1.013);
          box-shadow:
            0 22px 48px rgba(0,0,0,0.3),
            0 0 0 1px var(--cardAccentSoft, rgba(255,255,255,0.14)),
            0 30px 78px var(--cardGlow, rgba(255,255,255,0.22));
        }
      }
      @keyframes sideBorderPulse {
        0%   { filter: brightness(0.96); opacity: 0.96; }
        12%  { filter: brightness(1.22); opacity: 1; }
        20%  { filter: brightness(1.04); opacity: 0.98; }
        100% { filter: brightness(0.96); opacity: 0.96; }
      }
      @keyframes verticalBorderShine {
        0%   { transform: translateY(180%); opacity: 0; }
        10%  { transform: translateY(150%); opacity: 0; }
        24%  { opacity: 0.92; }
        76%  { opacity: 0.92; }
        90%  { transform: translateY(-150%); opacity: 0; }
        100% { transform: translateY(-180%); opacity: 0; }
      }
      @keyframes detailOpen {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes detailClose {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-4px); }
      }
      @keyframes dotJump {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.8; }
        40% { transform: translateY(-4px); opacity: 1; }
      }
      @keyframes thinkingSwap {
        from { opacity: 0; transform: translateY(2px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes blobMorph {
        0%   { border-radius: 48% 52% 62% 38% / 55% 40% 60% 45%; }
        25%  { border-radius: 62% 38% 44% 56% / 40% 62% 38% 60%; }
        50%  { border-radius: 40% 60% 58% 42% / 62% 36% 64% 38%; }
        75%  { border-radius: 55% 45% 35% 65% / 48% 58% 42% 52%; }
        100% { border-radius: 48% 52% 62% 38% / 55% 40% 60% 45%; }
      }
      @keyframes colorShift {
        0%   { filter: hue-rotate(0deg)   saturate(1.05) brightness(1.02); }
        25%  { filter: hue-rotate(35deg)  saturate(1.10) brightness(1.03); }
        50%  { filter: hue-rotate(85deg)  saturate(1.15) brightness(1.04); }
        75%  { filter: hue-rotate(180deg) saturate(1.10) brightness(1.03); }
        100% { filter: hue-rotate(0deg)   saturate(1.05) brightness(1.02); }
      }
      @keyframes innerPulse {
        0%   { transform: scale(0.86); opacity: 0.90; border-radius: 52% 48% 46% 54% / 50% 60% 40% 50%; }
        50%  { transform: scale(1.10); opacity: 1.00; border-radius: 46% 54% 56% 44% / 58% 44% 56% 42%; }
        100% { transform: scale(0.86); opacity: 0.90; border-radius: 52% 48% 46% 54% / 50% 60% 40% 50%; }
      }
      @keyframes outerPulseVar {
        0%   { transform: scale(0.84); opacity: 0.68; }
        22%  { transform: scale(1.12); opacity: 0.95; }
        48%  { transform: scale(0.92); opacity: 0.78; }
        72%  { transform: scale(1.04); opacity: 0.86; }
        100% { transform: scale(0.84); opacity: 0.68; }
      }
      @keyframes innerPulseVar {
        0%   { transform: scale(0.86); opacity: 0.90; }
        28%  { transform: scale(1.10); opacity: 1.00; }
        52%  { transform: scale(0.90); opacity: 0.92; }
        78%  { transform: scale(1.02); opacity: 0.96; }
        100% { transform: scale(0.86); opacity: 0.90; }
      }
      @keyframes glow {
        0% { filter: saturate(1.05) brightness(1.02); }
        50% { filter: saturate(1.25) brightness(1.08); }
        100% { filter: saturate(1.05) brightness(1.02); }
      }
      @keyframes glowShift {
        0% {
          filter: hue-rotate(0deg) saturate(1.1) brightness(1.02);
        }
        50% {
          filter: hue-rotate(25deg) saturate(1.35) brightness(1.08);
        }
        100% {
          filter: hue-rotate(0deg) saturate(1.1) brightness(1.02);
        }
      }
    `}</style>);
}
