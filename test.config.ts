import { type Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.e2e-spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/../src/$1",
  },
};

export default config;
