const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Shaikh Usama Bin Naeem",
        phone: "12345",
      },

      movie: {
        _id: movieId,
        title: "Testing",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  test("Should Work!", async () => {
    const result = await Rental.findById(rental._id);

    expect(result).not.toBeNull();
  });

  test("Return 401 if the client is logged in", async () => {
    const res = await request(server)
      .post("/api/returns")
      .send({ customerId, movieId });

    expect(res.status).toBe(401);
  });
});
