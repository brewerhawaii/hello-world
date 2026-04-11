# Android Kiosk Lock Mode Instructions

## Required Configuration
- Set app as Device Owner via Android Enterprise enrollment.
- Enable Lock Task Mode for package `com.vinova.torus.kiosk`.
- Whitelist only required system intents (camera for QR, payment handoff if needed).

## Behavior
- Force landscape orientation.
- Hide system bars with immersive mode.
- Disable recent apps/home navigation gestures.
- Start app on boot via `BOOT_COMPLETED` receiver.
- Staff unlock path available by long-press hidden hotspot + PIN.

## Operational Safeguards
- Remote config pull every 5 minutes.
- Remote kill-switch and app refresh command support.
- Offline cache fallback when API unavailable.
