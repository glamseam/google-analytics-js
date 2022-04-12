export interface SendEventOptions {
    category?: string
    label?: string
    value?: number
}

export interface GoogleAnalyticsOptions {
    measurementIdSecondary?: string
    isForceEnabled?: boolean
    forceEnabledKey?: string
    stateKey?: string
    scriptId?: string
}

export type GoogleAnalyticsJs = ReturnType<typeof googleAnalyticsJs>

const gtagScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}`

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
    measurementIds: string[],
    {
        isForceEnabled = false,
        stateKey = 'isEnabledGa',
        scriptId = 'googleTagManagerScript'
    }: GoogleAnalyticsOptions = {}
) => {
    const init = () => {
        if (
            (isForceEnabled || localStorage.getItem(stateKey) === 'true')
            && measurementIds.length !== 0
        ) {
            loadScript(
                'https://www.googletagmanager.com/gtag/js',
                scriptId
            )
                .then(() => {
                    setTimeout(() => {
                        const gtagScriptEl = document.createElement('script')
                        gtagScriptEl.text = gtagScript
                        document.body.appendChild(gtagScriptEl)

                        window.gtag('js', new Date())
                        measurementIds.forEach((id) => {
                            window.gtag('config', id)
                        })
                    }, 1000)
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

        return localStorage.getItem(stateKey) === 'true'
    }

    const getApprovalStatus = () => {
        if (isForceEnabled || localStorage.getItem(stateKey) === 'true') {
            return 'agree'
        }

        if (localStorage.getItem(stateKey) === 'false') {
            return 'disagree'
        }

        return 'pending'
    }

    const reset = () => {
        localStorage.removeItem(stateKey)
        const script = document.getElementById(scriptId)

        if (script) {
            script.remove()
        }
    }

    const sendEvent = (
        eventName: Gtag.EventNames | string & {},
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
            window.gtag('event', eventName, event)
        }
    }

    return {
        init,
        agree,
        disagree,
        isEnabled,
        getApprovalStatus,
        reset,
        sendEvent
    }
}
