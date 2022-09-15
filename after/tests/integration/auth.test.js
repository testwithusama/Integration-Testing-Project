const request = require("supertest");
const { User } = require('../../models/user');

describe("auth middleware", () => {
  beforeEach(() => { server = require("../../index"); });
  afterEach(async () => { server.close(); });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'Genre1' });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  test("Return 401 if no token is provided", async () => {
    token = '';

    const res = await exec();
    
    expect(res.status).toBe(401);
  });

  test("Return 400 if token is invalid", async () => {
    token = 'a';

    const res = await exec();
    
    expect(res.status).toBe(400);
  });
});

// const request = require("supertest");
// const { User } = require("../../models/user");
// let server;

// describe("Auth Middleware", () => {
//   beforeEach(() => {
//     server = require("../../index");
//   });
//   afterEach(async () => {
//     server.close();
//   });

//   let token;

//   const exec = async() => {
//     return await request(server)
//       .post("/api/genres")
//       .set("x-auth-token", token)
//       .send({ name: "Shaikh Usama Bin Naeem" });
//   };

//   beforeEach(() => {
//     token = new User().generateAuthToken();
//   });

//   test("Returns 401 if no token is provided", async () => {
//     token = "";

//     const res = await exec();

//     expect(res.status).toBe(401);
//   });
// });
