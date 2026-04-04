const HELYX_LETTERS = ["H", "E", "L", "Y", "X"]
const HELYX_SUBTITLE_WORDS = ["Our", "most", "advanced", "AI", "model", "yet"]

export default function HelixLaunchOverlay() {
    return (
        <div className="helix-launch-overlay" aria-hidden="true">
            <div className="helix-launch-stage">
                <div className="helix-vector-mark">
                    <div className="helix-axis helix-axis-horizontal" />
                    <div className="helix-axis helix-axis-vertical" />
                    <div className="helix-axis helix-axis-diagonal-left" />
                    <div className="helix-axis helix-axis-diagonal-right" />
                    <div className="helix-axis helix-axis-shallow-left" />
                    <div className="helix-axis helix-axis-shallow-right" />
                    <div className="helix-frame helix-frame-one" />
                    <div className="helix-frame helix-frame-two" />
                    <div className="helix-frame helix-frame-three" />
                    <div className="helix-core" />
                </div>
                <div className="helix-launch-copy">
                    <div className="helix-launch-kicker">Introducing</div>
                    <div className="helix-launch-title" aria-label="HELYX">
                        {HELYX_LETTERS.map((letter, index) => (
                            <span
                                key={`${letter}-${index}`}
                                className="helix-letter"
                                style={{
                                    "--helix-letter-delay": `${260 + index * 90}ms`,
                                }}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>
                    <div
                        className="helix-launch-subtitle"
                        aria-label="Our most advanced AI model yet"
                    >
                        {HELYX_SUBTITLE_WORDS.map((word, index) => (
                            <span
                                key={`${word}-${index}`}
                                className="helix-word"
                                style={{
                                    "--helix-word-delay": `${940 + index * 110}ms`,
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
