const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'Taare Zameen Par',
      dailyRentalRate: 2,
      genre: { name: 'Shaikh Usama Bin Naeem' },
      numberInStock: 10
    }); 
    await movie.save(); 

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
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  test("Return 400 if the customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  test("Return 400 if the movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  test("Return 404 if no rental found for customerId/movieId", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  test("Return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  test("Return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  test("Should set the returnDate if the input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  test("Should set the rentalFare if the input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  test("Increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
