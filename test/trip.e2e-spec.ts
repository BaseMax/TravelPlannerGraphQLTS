import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Model, model } from "mongoose";
import { AppModule } from "src/app.module";
import { User } from "src/user/entities/user.entity";
import * as request from "supertest";
import { getFakeUsers } from "./fakeData/user.fake";
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
  let fakeUsers: User[];
  let tripModel: Model<any>;
  let userModel: Model<any>;

  async function login(userNumber: number): Promise<string> {
    const fakeUser = getFakeUsers()[userNumber];
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

    fakeUsers = getFakeUsers();

    await tripModel.deleteMany({});
    await userModel.deleteMany();
    await userModel.create({
      ...fakeUsers[0],
      password: await argon2.hash(fakeUsers[0].password),
    });
    await userModel.create({
      ...fakeUsers[1],
      password: await argon2.hash(fakeUsers[1].password),
    });

    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  describe("create trip", () => {
    let token: string;

    beforeAll(async () => {
      token = await login(0);
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
      token = await login(0);
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

  describe("e2e test on inserted trips", () => {
    let token: string;
    let userId: string;
    let user2Id: string;
    let trip: TripDocument;
    let fakeTrips: CreateTripInput[];
    beforeAll(async () => {
      token = await login(0);
      const { sub } = jwtService.decode(token);
      userId = sub;
      fakeTrips = getFakeTrips(userId);
      await tripModel.insertMany(fakeTrips);
      trip = await createTrip(token);
    });

    const getUserTripsQuery = `query UserTrips {
      userTrips {
        _id
        destination
        toDate
        collaborators
      }
    }`;

    describe("search based user", () => {
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
    });

    describe("search bases destination and dates", () => {
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

      it("should search based on destination and both from date and to date", async () => {
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

      it("should search trips based on just dates", async () => {
        const searchBasedDates = `query GetTripsByDateRange($dateRange: SearchTripInput!) {
  getTripsByDateRange(dateRange: $dateRange) {
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
            query: searchBasedDates,
            variables: {
              dateRange: {
                fromDate: "2020-12-07T03:04:25.000+00:00",
                toDate: "2024-12-07T03:04:25.000+00:00",
              },
            },
          });

        const trip = response.body.data.getTripsByDateRange[0];
        expect(response.status).toBe(200);
        expect(new Date(trip.fromDate).getTime()).toBeGreaterThanOrEqual(
          new Date("2020-12-07T03:04:25.000+00:00").getTime()
        );
        expect(new Date(trip.toDate).getTime()).toBeLessThanOrEqual(
          new Date("2024-12-07T03:04:25.000+00:00").getTime()
        );
      });
      it("should give error for bad input dates", async () => {
        const searchBasedDates = `query GetTripsByDateRange($dateRange: SearchTripInput!) {
        getTripsByDateRange(dateRange: $dateRange) {
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
            query: searchBasedDates,
            variables: {
              dateRange: {
                toDate: "2020-12-07T03:04:25.000+00:00",
                fromDate: "2024-12-07T03:04:25.000+00:00",
              },
            },
          });

        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toContain(
          "toDate date isn't correct with fromDate"
        );
      });
    });

    describe("popular destination", () => {
      it("should get popular destination", async () => {
        const getPopularDestinationQuery = `query PopularDestination {
          PopularDestination {
            tripsCount
            destination
          }
        }`;
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .send({
            query: getPopularDestinationQuery,
          });

        const mostPopularDestination = response.body.data.PopularDestination[0];
        const secondMostPopularDestination =
          response.body.data.PopularDestination[1];

        expect(response.status).toBe(200);
        expect(response.body.data.PopularDestination).toBeDefined();
        expect(mostPopularDestination.tripsCount).toBeGreaterThanOrEqual(
          secondMostPopularDestination.tripsCount
        );
      });
    });

    describe("add collaborators", () => {
      const addCollaboratorMutation = `mutation AddCollaborator($tripId: String!, $userId: String!) {
        addCollaborator(tripId: $tripId, userId: $userId) {
          _id
          destination
          fromDate
          toDate
          collaborators
        }
      }
      `;

      beforeAll(async () => {
        token = await login(1);
        const { sub } = jwtService.decode(token);
        user2Id = sub;
      });
      it("should get authentication error", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .send({
            query: addCollaboratorMutation,
            variables: {
              tripId: "64cdde0c580b92480b8fe8b0",
              userId: "64cdde0c580b92480b8fe8b2",
            },
          });

        expect(response.body.date).toBeUndefined();
        expect(response.body.errors[0].message).toBe(
          "you must login to get this feather"
        );
      });

      it("should get validation error", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: addCollaboratorMutation,
            variables: {
              tripId: "WrongMongoId",
              userId: "WrongMongoId",
            },
          });

        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toContain(
          "id must be a valid objectId"
        );
      });

      it("should get  not found trip", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: addCollaboratorMutation,
            variables: {
              tripId: "594ced02ed345b2b049222c0",
              userId: "594ced02ed345b2b049222c3",
            },
          });

        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toBe(
          "trip with this id doesn't exist"
        );
      });

      it("should get user not found", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: addCollaboratorMutation,
            variables: {
              tripId: trip._id.toString(),
              userId: "594ced02ed345b2b049222c3",
            },
          });

        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toBe(
          "there is no user with this id exists"
        );
      });

      it("should add the user in the trip", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: addCollaboratorMutation,
            variables: {
              tripId: trip._id.toString(),
              userId: user2Id,
            },
          });

        const collaborators = response.body.data.addCollaborator.collaborators;
        expect(response.status).toBe(200);
        expect(response.body.data).toBeTruthy();
        expect(collaborators).toContain(user2Id);
        expect(collaborators).toContain(userId);
        expect(response.body.data.addCollaborator.destination).toBe(
          trip.destination
        );
      });
    });

    describe("remove trip", () => {
      let trip: TripDocument;
      beforeAll(async () => {
        trip = await createTrip(token);
      });

      const removeTripMutation = `    mutation RemoveTrip {
        removeTrip(id:"64d08726a580a984fb673d64" ) {
            _id
            destination
            fromDate
            toDate
            collaborators
        }  }`;
      it("should give authentication error", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .send({
            query: removeTripMutation,
          });

        expect(response.status).toBe(200);
        expect(response.body.date).toBeUndefined();
        expect(response.body.errors[0].message).toBe(
          "you must login to get this feather"
        );
      });

      it("should get validation error", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: `    mutation RemoveTrip {
              removeTrip(id:"wrongMongo" ) {
                  _id
                  destination
                  fromDate
                  toDate
                  collaborators
              }  }`,
          });

        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toContain(
          "id must be a valid objectId"
        );
      });

      it("should get not found error", async () => {
        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: removeTripMutation,
          });

        expect(response.status).toBe(200);
        expect(response.status).toBe(200);
        expect(response.body.errors[0].message).toBe(
          "trip with this id doesn't exist"
        );
      });
      it("should delete trip softly", async () => {
        const correctRemoveMutation = `  mutation RemoveTrip {
          removeTrip(id: "${trip._id.toString()}" ) {
              _id
              destination
              fromDate
              toDate
              collaborators
          }
      }`;

        const response = await request(app.getHttpServer())
          .post("/graphql")
          .set("authorization", token)
          .send({
            query: correctRemoveMutation,
          });

        const deletedTrip = response.body.data.removeTrip;
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(deletedTrip._id).toBe(trip._id.toString());
      });
    });
  });

  describe("remove collaborator", () => {
    let trip: TripDocument;
    let userId: string;
    let token: string;
    beforeAll(async () => {
      token = await login(0);
      const { sub } = jwtService.decode(token);
      userId = sub;
      trip = await createTrip(token);
    });

    it("should give authentication error", async () => {
      const removeCollaboratorMutation = `mutation RemoveCollaborator {
        removeCollaborator(userId: "${trip._id.toString()}", tripId:"${trip._id.toString()}" ) {
            _id
            destination
            fromDate
            toDate
            collaborators
        }
    }
    `;

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: removeCollaboratorMutation,
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "you must login to get this feather"
      );
    });

    it("should get validation error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: `
          mutation RemoveCollaborator {
            removeCollaborator(userId: "wrongMongoId", tripId:"wrongMongoId" ) {
                _id
                destination
                fromDate
                toDate
                collaborators
            }
        }
        
      `,
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();

      expect(response.body.errors[0].message).toContain(
        "id must be a valid objectId"
      );
    });

    it("should get not found trip", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: `
        mutation RemoveCollaborator {
          removeCollaborator(userId: "${userId}", tripId:"64d0e011857198a1433b7b6d" ) {
              _id
              destination
              fromDate
              toDate
              collaborators
          }
      }
      
    `,
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "trip with this id doesn't exist"
      );
    });

    it("should get not found user", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: `
        mutation RemoveCollaborator {
          removeCollaborator(userId: "64d0e011857198a1433b7b6d"  tripId:"${trip._id.toString()}" ) {
              _id
              destination
              fromDate
              toDate
              collaborators
          }
      }
      
    `,
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "there is no user with this id exists"
      );
    });

    it("should remove a collaborator softly", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: `
        mutation RemoveCollaborator {
          removeCollaborator(userId: "${userId}", tripId:"${trip._id.toString()}" ) {
              _id
              destination
              fromDate
              toDate
              collaborators
          }
      }
      
    `,
        });

      const { collaborators, _id } = response.body.data.removeCollaborator;
      expect(response.status).toBe(200);
      expect(collaborators.length).toBe(0);
      expect(_id).toBe(trip._id.toString());
    });
  });
});
