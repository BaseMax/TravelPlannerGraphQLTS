import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "src/app.module";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { getFakeUser } from "./fakeData/user.fake";
import * as argon2 from "argon2";
describe("Auth", () => {
  let app: INestApplication;
  let userModel: Model<any>;
  const fakeUser = getFakeUser();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userModel = app.get<Model<any>>(getModelToken("User"));

    await userModel.deleteMany();
    await userModel.create({
      ...fakeUser,
      password: await argon2.hash(fakeUser.password),
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("signup", () => {
    const signupMutation = `mutation Signup($signupInput: SignupInput!) {
      signup(SignupInput: $signupInput) {
        token
        name
      }
    }`;

    it("should give validation error", async () => {
      const variables = {
        signupInput: {
          name: "john",
          email: "test",
          confirmPassword: "wrongPassword",
          password: "test",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: signupMutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "email must be an email"
      );

      expect(response.body.errors[0].message).toContain(
        "Passwords do not match!"
      );
    });

    it("should give already exists user error", async () => {
      const variables = {
        signupInput: {
          name: "john",
          email: "test@gmail.com",
          confirmPassword: "test",
          password: "test",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: signupMutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors[0].message).toBe(
        "user with this email exists, please try to login"
      );
    });
    it("should signup successfully", async () => {
      const variables = {
        signupInput: {
          name: "john",
          email: "test2@gmail.com",
          confirmPassword: "test",
          password: "test",
        },
      };
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: signupMutation,
          variables,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.signup).toBeTruthy();
      expect(response.body.data.signup.name).toBe(variables.signupInput.name);
    });
  });

  describe("login", () => {
    const loginMutation = `mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              token
              name
            }
          }`;
    it("should give validation error", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: loginMutation,
          variables: {
            loginInput: {
              email: "wrong email",
              password: "test",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "email must be an email"
      );
    });

    it("should give not exists user", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: loginMutation,
          variables: {
            loginInput: {
              email: "notExistsUser@gmail.com",
              password: "test",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toBe(
        "credentials aren't correct"
      );
    });

    it("should give not valid password", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: loginMutation,
          variables: {
            loginInput: {
              email: fakeUser.email,
              password: "wrongPassword",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toBe(
        "credentials aren't correct"
      );
    });
    it("should login successfully", async () => {
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

      expect(response.status).toBe(200);
      expect(response.body.data.login.name).toBe(fakeUser.name);
      expect(response.body.data.login.token).toBeTruthy();
    });
  });
});
