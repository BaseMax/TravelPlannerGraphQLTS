import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Model, model } from "mongoose";
import { AppModule } from "src/app.module";
import { User } from "src/user/entities/user.entity";
import * as request from "supertest";
import { getFakeUser } from "./fakeData/user.fake";
import { getModelToken } from "@nestjs/mongoose";
import * as argon2 from "argon2";
import { TripDocument } from "src/trip/interfaces/trip.document";
import { JwtService } from "@nestjs/jwt";
import { CreateTripInput } from "src/trip/dto/create-trip.input";
import { getFakeTrips } from "./fakeData/trip.fake";
import { JwtPayload } from "src/auth/interfaces/jwt.payload";
describe("Trip", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let fakeUser: User;
  let tripModel: Model<any>;
  let userModel: Model<any>;

  async function login(): Promise<string> {
    const loginMutation = `mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              token
              name
            }
          }`;

    const response = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: loginMutation,
        variables: {
          loginInput: {
            email: fakeUser.email,
            password: fakeUser.password,
          },
        },
      });

    return response.body.data.login.token as string;
  }
  async function createTrip(token: string): Promise<TripDocument> {
    const createTripMutation = `mutation CreateTrip($createTripInput: CreateTripInput!) {
      createTrip(createTripInput: $createTripInput) {
        toDate
        fromDate
        destination
        _id
      }
    }`;

    const response = await request(app.getHttpServer())
      .post("/graphql")
      .set("authorization", token)
      .send({
        query: createTripMutation,
        variables: {
          createTripInput: {
            destination: "France",
            fromDate: "Sat Aug 05 2023 06:34:25 GMT+0330",
            toDate: "Sat dec 07 2023 06:34:25 GMT+0330 ",
          },
        },
      });

    return response.body.data.createTrip;
  }
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot()],
    }).compile();

    const configService = new ConfigService();
    app = moduleRef.createNestApplication();
    jwtService = new JwtService({ secret: configService.get("SECRET_KEY") });

    tripModel = app.get<Model<any>>(getModelToken("Trip"));

    userModel = app.get<Model<any>>(getModelToken("User"));

    app.useGlobalPipes(new ValidationPipe());

    fakeUser = getFakeUser();

    await tripModel.deleteMany({});
    await userModel.deleteMany();
    await userModel.create({
      ...fakeUser,
      password: await argon2.hash(fakeUser.password),
    });

    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  describe("create trip", () => {
    let token: string;

    beforeAll(async () => {
      token = await login();
    });

    const createTripMutation = `mutation CreateTrip($createTripInput: CreateTripInput!) {
      createTrip(createTripInput: $createTripInput) {
        toDate
        fromDate
        destination
        _id
      }
    }`;
    it("should give authentication error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: createTripMutation,
          variables: {
            createTripInput: {
              destination: "France",
              fromDate: "2022-10-2",
              toDate: "2022-12-0",
              collaborators: [""],
            },
          },
        });

      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "you must login to get this feather"
      );
    });

    it("should give validation error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: createTripMutation,
          variables: {
            createTripInput: {
              destination: "France",
              fromDate: "2022-10-2",
              toDate: "2022-9-0",
              collaborators: [""],
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "toDate date isn't correct with fromDate"
      );
      expect(response.body.errors[0].message).toContain(
        "collaborators must be an array of valid MongoDB ObjectIDs"
      );

      expect(response.body.errors[0].message).toContain(
        "date must have a valid form"
      );
    });

    it("should create trip", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: createTripMutation,
          variables: {
            createTripInput: {
              destination: "France",
              fromDate: "Sat Aug 05 2023 06:34:25 GMT+0330",
              toDate: "Sat dec 07 2023 06:34:25 GMT+0330 ",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createTrip.destination).toBe("France");
    });
  });

  describe("get a specific tripe by Id", () => {
    let trip: TripDocument;
    let token: string;

    beforeAll(async () => {
      token = await login();
      trip = await createTrip(token);
    });
    it("should get validation error", async () => {
      const findOneQuery = ` query Trip($tripId: String!) {
        trip(id: $tripId) {
          _id
          destination
          fromDate
          toDate
          collaborators
        }
  
      }`;
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: findOneQuery,
          variables: {
            tripId: "121212",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "id must be a valid objectId"
      );
    });
    it("should get not found error", async () => {
      const findOneQuery = `query Trip($tripId: String!) {
        trip(id: $tripId) {
          _id
          destination
          fromDate
          toDate
          collaborators
        }
      }`;
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: findOneQuery,
          variables: {
            tripId: "64cdde0c580b92480b8fe8b1",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toBe(
        "trip with this id doesn't exist"
      );
    });
    it("should get the trip", async () => {
      const findOneQuery = `query Trip($tripId: String!) {
        trip(id: $tripId) {
          _id
          destination
          fromDate
          toDate
          collaborators
        }
      }`;
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: findOneQuery,
          variables: {
            tripId: trip._id.toString(),
          },
        });

      const { _id, destination, collaborators } = response.body.data.trip;

      expect(response.status).toBe(200);
      expect(destination).toBe(trip.destination);
      expect(_id).toBe(trip._id.toString());
      expect(collaborators.length).toBeGreaterThanOrEqual(1);
    });
    it("should get validation error for get collaborators", async () => {
      const getCollaborators = `query Query($collaboratorsInTripId: String!) {
        collaboratorsInTrip(id: $collaboratorsInTripId)
      }`;

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: getCollaborators,
          variables: {
            collaboratorsInTripId: "12O1JQDSAKD2NA",
          },
        });

      expect(response.status).toBe(200);

      expect(response.body.errors[0].message).toContain(
        "id must be a valid objectId"
      );
    });
    it("should get not found for getting  collaborators", async () => {
      const getCollaborators = `query Query($collaboratorsInTripId: String!) {
        collaboratorsInTrip(id: $collaboratorsInTripId)
      }`;

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: getCollaborators,
          variables: {
            collaboratorsInTripId: "64cdde0c580b92480b8fe8b1",
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toBe(
        "trip with this id doesn't exist"
      );
    });
    it("should get a specific trip's collaborators", async () => {
      const getCollaborators = `query Query($collaboratorsInTripId: String!) {
        collaboratorsInTrip(id: $collaboratorsInTripId)
      }`;

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: getCollaborators,
          variables: {
            collaboratorsInTripId: trip._id.toString(),
          },
        });

      expect(response.status).toBe(200);
      expect(
        response.body.data.collaboratorsInTrip.length
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe("search trips", () => {
    let token: string;
    let userId: string;
    let fakeTrips: CreateTripInput[];
    beforeAll(async () => {
      token = await login();
      const { sub } = jwtService.decode(token);
      userId = sub;
      fakeTrips = getFakeTrips(userId);
      await tripModel.insertMany(fakeTrips);
    });

    const getUserTripsQuery = `query UserTrips {
      userTrips {
        _id
        destination
        toDate
        collaborators
      }
    }`;

    it("should give authentication error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: getUserTripsQuery,
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "you must login to get this feather"
      );
    });

    it("should get user trips", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: getUserTripsQuery,
        });

      const collaboratorsId = response.body.data.userTrips[0].collaborators;

      expect(response.status).toBe(200);
      expect(response.body.data.userTrips.length).toBeGreaterThanOrEqual(4);
      expect(collaboratorsId).toContain(userId);
    });

    const searchTripQuery = `query SearchTrip($searchInput: SearchTripInput!) {
      searchTrip(searchInput: $searchInput) {
        _id
        destination
        fromDate
        toDate
        collaborators
      }
    }`;

    it("should search based on destination", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: searchTripQuery,
          variables: {
            searchInput: {
              destination: "France",
            },
          },
        });

      const trip = response.body.data.searchTrip[0];
      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(trip.destination).toBe("France");
    });

    it("should search based on from date", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: searchTripQuery,
          variables: {
            searchInput: {
              destination: "France",
              fromDate: "2020-12-07T03:04:25.000+00:00",
            },
          },
        });

      const trip = response.body.data.searchTrip[0];
      expect(response.status).toBe(200);
      expect(new Date(trip.fromDate).getTime()).toBeGreaterThanOrEqual(
        new Date("2020-12-07T03:04:25.000+00:00").getTime()
      );
    });

    it("should search based on both from date and to date", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: searchTripQuery,
          variables: {
            searchInput: {
              destination: "France",
              fromDate: "2020-12-07T03:04:25.000+00:00",
              toDate: "2024-12-07T03:04:25.000+00:00",
            },
          },
        });

      const trip = response.body.data.searchTrip[0];
      expect(response.status).toBe(200);
      expect(new Date(trip.fromDate).getTime()).toBeGreaterThanOrEqual(
        new Date("2020-12-07T03:04:25.000+00:00").getTime()
      );
      expect(new Date(trip.toDate).getTime()).toBeLessThanOrEqual(
        new Date("2024-12-07T03:04:25.000+00:00").getTime()
      );
    });
  });
});
