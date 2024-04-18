const express = require("express");
const cors = require("cors");
const { Preference } = require("mercadopago");
const { MercadoPagoConfig } = require("mercadopago");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const API_KEY = process.env.API_KEY;

const client = new MercadoPagoConfig({
  accessToken: ACCESS_TOKEN,
});

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/create-preference", (req, res) => {
  const preference = new Preference(client);
  preference
    .create({
      body: {
        items: [
          {
            title: "Donation",
            unit_price: 1,
            quantity: 1,
            currency_id: "USD",
          },
        ],
        back_urls: {
          success: "https://store-app-pink.vercel.app/",
          failure: "https://store-app-pink.vercel.app/",
          pending: "https://store-app-pink.vercel.app/",
        },
        auto_return: "approved",
        payer: {
          name: req.body.firstName,
          surname: req.body.lastName,
          email: req.body.email,
          address: {
            zip_code: req.body.zipCode,
          },
        },
      },
    })
    .then((response) => {
      res.json(response.id);
    })
    .catch((e) => console.log(e));
});

app.get("/api", (req, res) => {
  return res.json(API_KEY);
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));

module.exports = app;
