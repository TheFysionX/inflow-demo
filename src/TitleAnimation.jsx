import * as React from "react"
import lottie from "lottie-web"
import animationData from "./assets/inflowai_header.json"
export default function TitleAnimation({ className }) {
    const containerRef = React.useRef(null)
    React.useEffect(() => {
        const container = containerRef.current
        if (!container)
            return

        const animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
            },
        })

        return () => animation.destroy()
    }, [])

    return <div ref={containerRef} className={className} aria-hidden="true" />
}
