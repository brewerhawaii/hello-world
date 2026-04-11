export class GenerateRecommendationDto {
  tenantId!: string;
  locationId!: string;
  kioskSessionId!: string;
  answers!: Record<string, string | string[]>;
}

export class RecommendationResponseDto {
  wellness_profile!: string;
  recommended_services!: string[];
  recommended_products!: string[];
  recommended_membership!: string;
  consultation_required!: boolean;
  reasons!: string[];
  flags!: string[];
  disclaimers!: string[];
  primary_cta!: string;
  secondary_cta!: string;
  ai_explanation?: string;
}
