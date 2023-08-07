import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TripModule } from "./trip/trip.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("DATABASE_URL"),
      }),
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      driver: ApolloDriver,
      installSubscriptionHandlers: true,

      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error?.extensions.originalError as any)?.message ||
            (error?.extensions?.exception as any)?.response?.message ||
            error?.message,
        };

        return graphQLFormattedError;
      },
    }),

    AuthModule,

    UserModule,

    TripModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
