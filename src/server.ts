import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

// express app
const app = express();
const port = process.env.PORT || 3000;

// middleware and static files
app.use(express.static("public"));

app.use(router);

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
