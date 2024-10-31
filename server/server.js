// load env-vars
require('dotenv').config();

// requiring dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require("crypto");

// initialize express
const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');
const uploadRouter = require('./routes/uploadRouter');
const userRoutes =  require('./routes/userRouter.js')

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// require db configs
const connectToDb = require('./config/db');
const axios = require("axios")
// require cloudinary configs
const cloudinary = require('./config/cloudinary');
const bodyParser = require('body-parser');

// uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shutting down due to uncaught exception`);
  process.exit(1);
});

// connect to db
connectToDb();

// using middlewares
app.use(
  cors({
    origin: [/netlify\.app$/, /localhost:\d{4}$/],
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());





// basic api route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service running 🚀',
  });
});


let salt_key = '96434309-7796-489d-8924-ab56988a6076'
let merchant_id = 'PGTESTPAYUAT86'

app.post("/api/payment", async (req, res) => {

  try {
      console.log(req.body)

      const merchantTransactionId = req.body.transactionId;
      const data = {
          merchantId: merchant_id,
          merchantTransactionId: merchantTransactionId,
          name: req.body.name,
          merchantUserId: req.body.MUID,
          amount: req.body.amount * 100,
          redirectUrl: `http://localhost:8000/api/payment/status/?id=${merchantTransactionId}`,
          redirectMode: 'POST',
          mobileNumber: req.body.phone,
          paymentInstrument: {
              type: 'PAY_PAGE'
          }
      };
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + salt_key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
      // const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
      const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
      // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

      const options = {
          method: 'POST',
          url: prod_URL,
          headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'X-VERIFY': checksum
          },
          data: {
              request: payloadMain
          }
      };

      await axios.request(options).then(function (response) {
              console.log(response.data)

              return res.json(response.data)
          })
          .catch(function (error) {
              console.error(error);
          });

  } catch (error) {
      res.status(500).send({
          message: error.message,
          success: false
      })
  }

})


app.post("/api/payment/status", async (req, res) => {

  const merchantTransactionId = req.query.id
  const merchantId = merchant_id

  const keyIndex = 1;
  const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + "###" + keyIndex;

  const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': `${merchantId}`
      }
  };

  // CHECK PAYMENT TATUS
  axios.request(options).then(async (response) => {
          if (response.data.success === true) {
              const url = `http://localhost:3000/success`
              return res.redirect(url)
          } else {
              const url = `http://localhost:3000/failure`
              return res.redirect(url)
          }
      })
      .catch((error) => {
          console.error(error);
      });

})

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use("/api/user", userRoutes);
// using other middlewares
app.use(errorMiddleware);

// starting server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});

// unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shutting down due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
