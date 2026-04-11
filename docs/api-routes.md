# API Routes (Phase 1)

## Auth
- `POST /auth/device-login`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

## Tenants / Locations / Kiosks
- `GET /tenants/me`
- `GET /locations`
- `GET /kiosks/:id/health`
- `POST /kiosks/:id/refresh-content`

## Catalog
- `GET /products`
- `GET /services`
- `GET /programs`
- `GET /memberships`

## Questionnaire + Recommendations
- `GET /questionnaires/active`
- `POST /questionnaires/:id/submit`
- `POST /recommendations/generate`
- `GET /recommendations/:id`

## Commerce
- `POST /orders`
- `POST /orders/:id/items`
- `POST /payments/stripe/intent`
- `POST /payments/stripe/webhook`
- `POST /checkout/mobile-handoff`

## Booking
- `GET /bookings/slots`
- `POST /bookings`

## Leads
- `POST /leads`
- `POST /leads/:id/score`
- `POST /leads/:id/route`

## Analytics + Audit
- `POST /analytics/events`
- `GET /analytics/dashboard`
- `GET /audit-logs`
