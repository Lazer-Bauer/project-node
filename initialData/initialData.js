const { Card } = require("../models/cards.models");
const { User } = require("../models/users.models");
const checkFirstRun = async () => {
  if (!(await User.exists())) {
    User.insertMany([
      {
        name: { first: "regular", last: "user" },
        isBusiness: false,
        phone: "050-0000000",
        email: "regular@gmail.com",
        password: "Aa123456!",
        address: {
          country: "israel",
          city: "tel-aviv",
          street: "magnive",
          houseNumber: "5",
        },
        image: { url: "www.jkdjf.com.il", alt: "hdfggfh" },
      },
      {
        name: { first: "business", last: "user" },
        isBusiness: true,
        phone: "050-0000000",
        email: "business@gmail.com",
        password: "Aa123456!",
        address: {
          country: "israel",
          city: "tel-aviv",
          street: "magnive",
          houseNumber: "5",
        },
        image: { url: "www.hdjfh.com.il", alt: "gdfhfdgfh" },
      },
      {
        name: { first: "admin", last: "user" },
        isBusiness: true,
        isAdmin: true,
        phone: "050-0000000",
        email: "admin@gmail.com",
        password: "Abc!123Abc",
        address: {
          country: "israel",
          city: "tel-aviv",
          street: "magnive",
          houseNumber: "5",
        },
        image: { url: "www.hdjhfj.com.il", alt: "dhfghdgfhdg" },
      },
    ]);
  }
  if (!(await Card.exists())) {
    const users = await User.find();
    Card.insertMany([
      {
        title: "first card",
        subtitle: "this is the first card",
        description: "this is the first card in the database",
        phone: "050-0000000",
        email: "firstCard@gmail.com",
        web: "https://www.test.co.il",
        image: {
          url: "www.mjbhhf.com.il",
          alt: "hgfjgh",
        },
        address: {
          state: "rjghrjghj",
          country: "test",
          city: "test",
          street: "test",
          houseNumber: 3,
          zip: "0",
        },
        user_id: users[0]._id,
      },
      {
        title: "second card",
        subtitle: "this is the second card",
        description: "this is the second card in the database",
        phone: "050-0000000",
        email: "secondCard@gmail.com",
        web: "https://www.test.co.il",
        image: {
          url: "www.hgfhdgfh.com.il",
          alt: "njnjfnjgj",
        },
        address: {
          state: "jdhfjhfj",
          country: "test",
          city: "test",
          street: "test",
          houseNumber: 3,
          zip: "0",
        },
        user_id: users[0]._id,
      },
      {
        title: "third card",
        subtitle: "this is the third card",
        description: "this is the third card in the database",
        phone: "050-0000000",
        email: "thirdCard@gmail.com",
        web: "https://www.test.co.il",
        image: {
          url: "www.hbhfghe.com.il",
          alt: "hjehfjeh",
        },
        address: {
          state: "jhfjhgjh",
          country: "test",
          city: "test",
          street: "test",
          houseNumber: 3,
          zip: "0",
        },
        user_id: users[1]._id,
      },
    ]);
  }
};

module.exports = {
  checkFirstRun,
};
