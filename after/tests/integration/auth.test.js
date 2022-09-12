const request = require("supertest");
const { User } = require("../../models/user");
let server;

describe("Auth Middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
  });

  let token;

  const exec = async() => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "Shaikh Usama Bin Naeem" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  test("Returns 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });
});
