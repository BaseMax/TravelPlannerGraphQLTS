import { Model } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { getFakeUsers } from "./fakeData/user.fake";
import * as request from "supertest";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "src/app.module";
import { Test } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { TripDocument } from "src/trip/interfaces/trip.document";
import * as argon2 from "argon2";
describe("Note e2e test", () => {
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

    app.useGlobalPipes(new ValidationPipe());

    jwtService = new JwtService({ secret: configService.get("SECRET_KEY") });
    fakeUsers = getFakeUsers();
    tripModel = app.get<Model<any>>(getModelToken("Trip"));
    userModel = app.get<Model<any>>(getModelToken("User"));

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
    await app.close();
  });

  describe("create note", () => {
    let token: string;
    let trip: TripDocument;
    const createNoteMutation = `mutation CreateNote($CreateNoteInput:CreateNoteInput!) {
        createNote(createNoteInput: $CreateNoteInput) {
            _id
            notes {
                _id
                collaboratorId
                content
                createdAt
            }
            collaborators
            toDate
            fromDate
            destination
        }
    }
    `;
    beforeAll(async () => {
      token = await login(0);
      trip = await createTrip(token);
    });

    it("should get authentication error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: createNoteMutation,
          variables: {
            CreateNoteInput: {
              content: "test",
              tripId: "Eaaas",
            },
          },
        });


      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toBe(
        "you must login to get this feather"
      );
    });

    it("should get validation error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: createNoteMutation,
          variables: {
            CreateNoteInput: {
              content: "test",
              tripId: "Eaaas",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toContain(
        "tripId must be a valid id"
      );
    });

    it("should get not found trip", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: createNoteMutation,
          variables: {
            CreateNoteInput: {
              content: "test",
              tripId: "64d0e011857198a1433b7b6d",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.date).toBeUndefined();
      expect(response.body.errors[0].message).toBe(
        "trip with this id doesn't exist"
      );
    });
    it("should get not being collaborator error", async () => {
      const user2Token = await login(1);
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", user2Token)
        .send({
          query: createNoteMutation,
          variables: {
            CreateNoteInput: {
              content: "test",
              tripId: trip._id.toString(),
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toBe(
        "you aren't collaborator in this trip"
      );
    });

    it("should create note successfully", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .set("authorization", token)
        .send({
          query: createNoteMutation,
          variables: {
            CreateNoteInput: {
              content: "test",
              tripId: trip._id.toString(),
            },
          },
        });

      const { content } = response.body.data.createNote.notes[0];

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data).toBeDefined();
      expect(content).toBe("test");
    });
  });
});
