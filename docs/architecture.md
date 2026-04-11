# TORUS by VINOVA - System Architecture (Phase 1)

## High-Level Components

1. **Android Kiosk App (Jetpack Compose)**
   - Runs in immersive kiosk mode
   - Attract loop + guided conversion funnel
   - Offline cache for catalog, assessments, pricing snapshots
   - Session reset on inactivity

2. **Backend API (NestJS)**
   - JWT + refresh token auth
   - RBAC and tenant isolation
   - Rule engine for deterministic recommendations
   - AI explanation service that cannot override rules
   - Orders, bookings, leads, analytics, audit logs

3. **Admin Portal (React/TypeScript)**
   - Multi-role dashboards
   - Catalog, memberships, questionnaires, rules editor
   - Kiosk monitoring and media management
   - Conversion analytics and export

4. **Data + Infra**
   - PostgreSQL via Prisma
   - Redis cache + rate limiting + queue hooks
   - Stripe for payment intents and webhooks
   - Twilio + SendGrid/SES notifications
   - S3-compatible storage for media assets

## Request Flow

- Kiosk obtains device token (`/auth/device-login`)
- Kiosk session starts (`/kiosk-sessions/start`)
- Assessment answers posted (`/questionnaires/:id/submit`)
- Recommendation generated:
  1. Rules engine classifies + filters
  2. AI explanation layer narrates reasons and next steps
- User books, checks out, or sends results to phone/email
- Lead is scored and routed by location and urgency
- All sensitive actions logged into `audit_logs`

## Multi-Tenant Boundaries

All business records include `tenantId`. API access uses:
- JWT claims: `sub`, `tenantId`, `roleIds`, `channel`
- Guards enforce tenant + role + channel constraints
- Super Admin can cross-tenant query with explicit scope

## Channel Separation

- `KIOSK`: anonymous assisted conversion flow
- `STAFF`: assisted kiosk operations
- `CLINICIAN`: flagged recommendation review
- `ADMIN`: tenant operations
- `SUPER_ADMIN`: platform controls
