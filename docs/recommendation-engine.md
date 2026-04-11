# Recommendation Engine (Rule First + AI Explanation)

```pseudo
function generateRecommendation(input, tenantId, locationId):
  profile = classifyWellnessProfile(input.answers)

  candidateServices = services.forTenant(tenantId).forLocation(locationId)
  candidateProducts = products.forTenant(tenantId).forLocation(locationId)
  memberships = memberships.forTenant(tenantId)

  rules = loadActiveRules(tenantId, profile)

  filtered = applyHardRules(
    rules,
    input,
    candidateServices,
    candidateProducts,
    memberships
  )

  consultationRequired = filtered.flags.contains('consult_required')
  disclaimers = computeDisclaimers(filtered, input)

  recommendation = {
    wellness_profile: profile,
    recommended_services: rankServices(filtered.services, input.goals),
    recommended_products: rankProducts(filtered.products, input.budget),
    recommended_membership: pickMembership(filtered.memberships, input),
    consultation_required: consultationRequired,
    reasons: filtered.ruleReasons,
    flags: filtered.flags,
    disclaimers: disclaimers,
    primary_cta: choosePrimaryCTA(consultationRequired, input),
    secondary_cta: chooseSecondaryCTA(input)
  }

  aiNarrative = aiExplain(recommendation, guardrails={
    cannot_change_catalog: true,
    cannot_remove_disclaimer: true,
    cannot_flip_consultation_required: true
  })

  persistRecommendation(input.sessionId, recommendation, aiNarrative)
  return merge(recommendation, { ai_explanation: aiNarrative })
```
