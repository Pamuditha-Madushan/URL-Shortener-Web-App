import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import urlRoutes from "./routes/urlRoutes";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/url", urlRoutes);

app.use(errorHandler);

const port = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(
      `[Server]: The server is listening at http://localhost:${port} ...`
    );
  });
};

startServer().catch((error) => {
  console.error("Server is failed to start: ", error);
  process.exit(1);
});
