import { inject } from 'vue'
import type { InjectionKey, Plugin } from 'vue'
import { googleAnalyticsJs } from './index'
import type { GoogleAnalyticsJs, GoogleAnalyticsOptions } from './index'

export interface PluginOptions {
    measurementIds: string[]
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
        app.provide(googleAnalyticsJsKey, googleAnalyticsJs(options.measurementIds, options.options))
    }
}
