require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const cors = require("cors");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(cookieParser({}));
app.use(express.static("static"));
app.use(fileUpload({}));

// Routes
app.use("/api/event", require("./routes/event.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/booking", require("./routes/booking.route"));
app.use("/api/category", require("./routes/category.route"));
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;

const bootstrap = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Listening on - http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(`Error connecting with DB: ${error}`);
  }
};

bootstrap();
