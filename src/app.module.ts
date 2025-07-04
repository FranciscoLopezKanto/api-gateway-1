import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comment.module';
import { ActivitiesModule } from './activities/activities.module';
import { VisitsModule } from './visits/visits.module';
import { PatientsModule } from './patients/patients.module';
import { StudiesModule } from './studies/studies.module';
import { FeasibilitiesModule } from './feasibilities/feasibilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),
    AuthModule,
    CommentsModule,
    ActivitiesModule,
    VisitsModule,
    PatientsModule,
    StudiesModule,
    FeasibilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
