# google-analytics-js

WIP.

# Install

```sh
npm i @d-gs/google-analytics-js
```

# Usage

In `some.js(ts)`

```js
import { googleAnalyticsJs } from '@d-gs/google-analytics-js'
const ga = googleAnalyticsJs(
  'G-XXXXXXXXXX',  // Your measurement id (required)
  {  // Options
    measurementIdSecondary: 'G-XXXXXXXXXX',  // Your secondary measurement id (default: undefined)
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
    measurementId: 'G-XXXXXXXXXX',
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

In `App.vue` with vue-router4

```vue
<script lang="ts" setup>
import { useGoogleAnalytics, sendPageView } from '@d-gs/google-analytics-js/dist/plugin-vue'

const ga = useGoogleAnalytics()
ga.init()
sendPageView()
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