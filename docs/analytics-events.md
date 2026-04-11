# Analytics Event Schema

```json
{
  "event": "assessment_completed",
  "timestamp": "2026-04-11T12:00:00Z",
  "tenant_id": "uuid",
  "location_id": "uuid",
  "kiosk_id": "uuid",
  "session_id": "uuid",
  "user_channel": "KIOSK",
  "properties": {
    "assessment_id": "uuid",
    "duration_sec": 134,
    "main_goal": "Recovery & Performance",
    "recommended_membership": "Performance"
  }
}
```

Core events:
- `attract_cta_tapped`
- `session_started`
- `assessment_started`
- `assessment_completed`
- `recommendation_viewed`
- `product_clicked`
- `cart_started`
- `checkout_started`
- `purchase_completed`
- `booking_completed`
- `membership_joined`
- `lead_submitted`
- `kiosk_session_timeout_reset`
