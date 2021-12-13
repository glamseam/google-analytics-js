# google-analytics-js

WIP.<br>
This package is available for Google Analytics V4 (gtag).

# Install

```sh
npm i @d-gs/google-analytics-js
```

# Usage

In `some.js(ts)`

```js
import { googleAnalyticsJs } from '@d-gs/google-analytics-js'
const ga = googleAnalyticsJs(
  ['G-XXXXXXXXXX', 'G-XXXXXXXXXX'],  // Your measurement ids (required)
  {  // Options
    isForceEnabled: false,  // (default: false)
    stateKey: 'isEnabledGa',  // localStorage key (default: `isEnabledGa`)
    scriptId: 'googleTagManagerScript'  // gtag script id (default: `googleTagManagerScript`)
  }
)

ga.init()  // Initialize

const sendEvent = () => {
  ga.sendEvent(
    'contact_complete',
    {
      category: 'Contact'
    }
  )
}
```

# When using Vue3
In `app.ts`

```ts
import { pluginGoogleAnalytics } from '@d-gs/google-analytics-js/dist/plugin-vue'
app.use(pluginGoogleAnalytics(
  {
    measurementIds: ['G-XXXXXXXXXX', 'G-XXXXXXXXXX'],
    options: {
        isForceEnabled: true
    }
  }
))
```

In `App.vue`

```vue
<script lang="ts" setup>
import { useGoogleAnalytics } from '@d-gs/google-analytics-js/dist/plugin-vue'

const ga = useGoogleAnalytics()
ga.init()
</script>
```

In `Comp.vue`

```vue
<script lang="ts" setup>
import { useGoogleAnalytics } from '@d-gs/google-analytics-js/dist/plugin-vue'

const ga = useGoogleAnalytics()
const sendEvent = () => {
  ga.sendEvent(
    'contact_complete',
    {
      category: 'Contact'
    }
  )
}
</script>
```

# API

```js
const ga = googleAnalyticsJs(['G-XXXXXXXXXX'], options)

// It must be initialized before it can be used, also mount the gtag script here.
ga.init()

// When `isForceEnabled` is `false`, it can be enabled by this function
ga.agree()

// When `isForceEnabled` is `false`, this function will disable it completely.
ga.disagree()

// Check if the status is currently valid.
ga.isEnabled()

// Reset the current state.
ga.reset()

// Send Google Analytiecs events.
ga.sendEvent(
  'eventName',
  {
    category: 'category',
    label: 'label',
    value: 'value'
  }
)
```

## Warning
When `isForceEnabled` is true, "page_view" will be sent to Google Analytics without the user's permission
