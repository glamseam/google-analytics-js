export interface Options {
    forceEnabled?: boolean
    stateKey?: string
    scriptId?: string
}

export interface SendEventOptions {
    category?: string
    label?: string
    value?: number
}

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
        forceEnabled = false,
        stateKey = 'enabledGa',
        scriptId = 'GoogleTagManagerScript'
    }: Options = {}
) => {
    const init = () => {
        if (
            (forceEnabled || localStorage.getItem(stateKey) === 'true')
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
        if (!forceEnabled) {
            localStorage.setItem(stateKey, 'true')
        }

        init()
    }

    const disagree = () => {
        if (!forceEnabled) {
            localStorage.setItem(stateKey, 'false')
        }
    }

    const getApprovalStatus = () => {
        if (forceEnabled || localStorage.getItem(stateKey) === 'true') {
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

        Object.entries(event).forEach((v) => v[1] == undefined ? delete event[v[0]] : 0)

        if (window.gtag) {
            window.gtag('event', eventName, event)
        }
    }

    return {
        init,
        agree,
        disagree,
        getApprovalStatus,
        reset,
        sendEvent
    }
}
