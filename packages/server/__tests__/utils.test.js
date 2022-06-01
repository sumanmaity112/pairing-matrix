import { getPairingMatrixConfig } from "../utils.js";
import fs from "fs";

jest.mock("fs");

describe("Utils", () => {
  const pairingMatrixConfig = {
    repos: ["repo1", "repo2"],
    username: "test-user",
    basePath: "/temp",
    sshIdentityFilePath: "id_rsa",
  };

  let processEnv;

  beforeEach(() => {
    processEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...processEnv };
  });

  it("should read pairing matrix config", () => {
    const configPath = "/abc/hyz.json";

    process.env.CONFIG_PATH = configPath;

    fs.readFileSync.mockReturnValue(JSON.stringify(pairingMatrixConfig));

    expect(getPairingMatrixConfig()).toEqual(pairingMatrixConfig);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(configPath, "utf8");
  });
});
