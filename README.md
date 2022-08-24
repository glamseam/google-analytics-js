# google-analytics-js

This package is available for Google Analytics V4 (gtag).

# Install

```sh
npm i @d-gs/google-analytics-js
```

or

```sh
pnpm add @d-gs/google-analytics-js
```

# Usage

In `some.js(ts)`

```js
import { googleAnalyticsJs } from '@d-gs/google-analytics-js'
const ga = googleAnalyticsJs(
  ['G-XXXXXXXXXX', 'G-XXXXXXXXXX'],  // Your measurement ids (required)
  {  // Options
    forceEnabled: boolean,  // (default: false)
    stateKey: string,  // localStorage key (default: `enabledGa`)
    scriptId: string  // gtag script id (default: `GoogleTagManagerScript`)
  }
)

// If you agree, you will be initialized and Google Analytics will be activated.
ga.agree()

// If you disagree, Google Analytics will not work.
ga.disagree()

// Return 'agree' | 'disagree' | 'pending'
ga.getApprovalStatus()

// Return to 'pending' status
ga.reset()

// Send event
ga.sendEvent(
  'contact_complete',
  {
    category: 'Contact'
  }
)
```
## Warning
When `forceEnabled` is `true`, "page_view" will be sent to Google Analytics without the user's permission
