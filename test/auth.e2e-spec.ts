import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "src/app.module";

describe("Auth", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
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

    it("should give user already exists", async () => {
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
      console.log(response.body.errors);

      expect(response.status).toBe(200);
      expect(response.body.errors[0].message).toContain(
        "user with this email already exists, please try to login"
      );
    });
  });
});
