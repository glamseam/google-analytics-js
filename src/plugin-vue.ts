import { inject } from 'vue'
import type { InjectionKey, Plugin } from 'vue'
import { useRouter } from 'vue-router'
import { googleAnalyticsJs } from './index'
import type { GoogleAnalyticsJs, GoogleAnalyticsOptions } from './index'

export interface PluginOptions {
    measurementId: string
    options: GoogleAnalyticsOptions
}

const googleAnalyticsJsKey: InjectionKey<GoogleAnalyticsJs> = Symbol('GoogleAnalyticsJs')

export const useGoogleAnalytics = () => {
    const injected = inject(googleAnalyticsJsKey)

    if (!injected) {
        throw new Error(`${googleAnalyticsJsKey} is not provided`)
    }

    return injected
}

export const pluginGoogleAnalytics: Plugin = {
    install: (app, options: PluginOptions) => {
        app.provide(googleAnalyticsJsKey, googleAnalyticsJs(options.measurementId, options.options))
    }
}

export const sendPageView = () => {
    const googleAnalytics = useGoogleAnalytics()
    useRouter().beforeEach((to) => {
        googleAnalytics.toNext(to.fullPath)

        return true
    })
}
