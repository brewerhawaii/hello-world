# Inactivity Reset Logic (Android)

- Global idle timer starts from any user touch event.
- Threshold: 90 seconds (configurable per tenant).
- On timeout:
  1. Cancel checkout/payment intents not finalized
  2. Clear in-memory assessment/cart/session state
  3. Remove local temporary PII (phone/email draft)
  4. Navigate to attract screen
  5. Emit analytics event `kiosk_session_timeout_reset`

`SessionTimeoutManager` exposes:
- `onUserInteraction()`
- `pause()` / `resume()`
- `onTimeout(callback)`
