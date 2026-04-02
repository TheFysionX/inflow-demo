import * as React from "react"
import lottie from "lottie-web"
import { clamp } from "./chatUtils"
import { styles } from "./chatStyles"

export default function LottieHoverIcon({ src, scale = 1, isActive = false }) {
    const containerRef = React.useRef(null)
    const animationRef = React.useRef(null)
    const safeScale = clamp(scale || 1, 0.4, 2)

    React.useEffect(() => {
        const container = containerRef.current
        if (!container || !src) return

        const animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: src,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
            },
        })

        const stopAtLastFrame = () => {
            const lastFrame = Math.max(animation.totalFrames - 1, 0)
            animation.goToAndStop(lastFrame, true)
        }

        animationRef.current = animation
        animation.addEventListener("DOMLoaded", stopAtLastFrame)

        return () => {
            animation.removeEventListener("DOMLoaded", stopAtLastFrame)
            animation.destroy()
            if (animationRef.current === animation) {
                animationRef.current = null
            }
        }
    }, [src])

    React.useEffect(() => {
        const animation = animationRef.current
        if (!animation) return

        if (isActive) {
            animation.goToAndStop(0, true)
            animation.play()
            return
        }

        const lastFrame = Math.max(animation.totalFrames - 1, 0)
        animation.goToAndStop(lastFrame, true)
    }, [isActive])

    return (
        <div style={styles.lottieWrap}>
            {src ? (
                <div
                    ref={containerRef}
                    style={{
                        ...styles.lottiePlayer,
                        transform: `scale(${safeScale})`,
                    }}
                />
            ) : (
                <div style={styles.lottieFallback} />
            )}
        </div>
    )
}
