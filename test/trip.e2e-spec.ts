import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Model, model } from "mongoose";
import { AppModule } from "src/app.module";
import { User } from "src/user/entities/user.entity";
import * as request from "supertest";
import { getFakeUser } from "./fakeData/user.fake";
import { getModelToken } from "@nestjs/mongoose";
import * as argon2 from "argon2";
describe("Trip", () => {
  let app: INestApplication;
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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot()],
    }).compile();

    app = moduleRef.createNestApplication();
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
          _id
          destination
          dates
          calibrators
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
              dates: ["2022-10-2", "2022-12-0"],
              calibrators: [""],
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
              dates: ["2022-10-2", "2022-12-0"],
              calibrators: [""],
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "dates must be an array of valid dates."
      );
      expect(response.body.errors[0].message).toContain(
        "calibrators must be an array of valid MongoDB ObjectIDs"
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
              dates: [
                "Sat Aug 05 2023 06:34:25 GMT+0330",
                "Sat dec 07 2023 06:34:25 GMT+0330 ",
              ],
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createTrip.destination).toBe("France");
    });
  });
});
