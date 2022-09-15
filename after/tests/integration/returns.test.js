const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach(() => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Shaikh Usama Bin Naeem",
        phone: "0324xxxxxxx",
      },
      movie: {
        _id: movieId,
        title: "Taare Zameen Par",
        dailyRentalRate: 2,
      },
    });
    rental.save();
  });
  afterEach(async () => {
    server.close();
    await Rental.remove({});
  });

  test("Should Work!", async () => {
    const result = await Rental.findById(rental._id);

    expect(result).not.toBeNull();
  });
});
