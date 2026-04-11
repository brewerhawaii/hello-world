import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { KiosksModule } from './kiosks/kiosks.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { MembershipsModule } from './memberships/memberships.module';
import { QuestionnairesModule } from './questionnaires/questionnaires.module';
import { RecommendationEngineModule } from './recommendation-engine/recommendation-engine.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { BookingsModule } from './bookings/bookings.module';
import { LeadsModule } from './leads/leads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    KiosksModule,
    ProductsModule,
    ServicesModule,
    MembershipsModule,
    QuestionnairesModule,
    RecommendationEngineModule,
    OrdersModule,
    PaymentsModule,
    BookingsModule,
    LeadsModule,
    AnalyticsModule,
    AuditLogsModule,
    FeatureFlagsModule,
  ],
})
export class AppModule {}
