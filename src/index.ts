interface SendEventOptions {
    category?: string
    label?: string
    value?: number
}

interface GoogleAnalytics {
    measurementIdSecondary?: string
    isForceEnabled?: boolean
    forceEnabledKey?: string
    stateKey?: string
    scriptId?: string
}

const gtagScript = (measurementId: string) => {
    return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`
}

const loadScript = (src: string, scriptId: string): Promise<HTMLScriptElement> => {
    const scriptEl = document.createElement('script')

    return new Promise((resolve, reject) => {
        scriptEl.async = true
        scriptEl.id = scriptId
        scriptEl.src = src
        document.body.appendChild(scriptEl)

        if (scriptEl.hasAttribute('data-loaded')) {
            return resolve(scriptEl)
        }

        scriptEl.addEventListener('error', reject)
        scriptEl.addEventListener('abort', reject)

        return scriptEl.addEventListener('load', () => {
            scriptEl.setAttribute('data-loaded', 'true')

            return resolve(scriptEl)
        })
    })
}


export const googleAnalyticsJs = (
    measurementId: string,
    {
        measurementIdSecondary = undefined,
        isForceEnabled = false,
        stateKey = 'isEnabledGa',
        scriptId = 'googleTagManagerScript'
    }: GoogleAnalytics = {}
) => {
    const init = () => {
        if (
            (isForceEnabled || localStorage.getItem(stateKey) === 'true')
            && measurementId
        ) {
            loadScript(
                `https://www.googletagmanager.com/gtag/js?${measurementId}`,
                scriptId
            )
                .then(() => {
                    const gtagScriptEl = document.createElement('script')
                    gtagScriptEl.text = measurementIdSecondary
                        ? `${gtagScript(measurementId)}gtag('config', '${measurementIdSecondary}');`
                        : gtagScript(measurementId)
                    document.body.appendChild(gtagScriptEl)
                })
        }
    }

    const agree = () => {
        if (!isForceEnabled) {
            localStorage.setItem(stateKey, 'true')
        }

        init()
    }

    const disagree = () => {
        if (!isForceEnabled) {
            localStorage.setItem(stateKey, 'false')
        }
    }

    const isEnabled = () => {
        if (isForceEnabled) {
            return true
        }

        if (localStorage.getItem(stateKey) === 'true') {
            return true
        }

        return false
    }

    const reset = () => {
        localStorage.removeItem(stateKey)
        const script = document.getElementById(scriptId)

        if (script) {
            script.remove()
        }
    }

    const sendEvent = (
        action: string,
        {
            category,
            label,
            value
        }: SendEventOptions = {}
    ) => {
        const event: SendEventOptions = {
            category: category,
            label: label,
            value: value
        }

        Object.entries(event).forEach((v) => v[1] == null ? delete event[v[0]] : 0)

        if (window.gtag) {
            window.gtag('event', action, event)
        }
    }

    const toNext = (pagePath: string) => {
        if (window.gtag) {
            window.gtag('config', measurementId, { page_path: pagePath })

            if (measurementIdSecondary) {
                window.gtag('config', measurementIdSecondary, { page_path: pagePath })
            }
        }
    }

    return {
        init,
        agree,
        disagree,
        isEnabled,
        reset,
        sendEvent,
        toNext
    }
}
