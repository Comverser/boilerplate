import express from "express";
import router from "./routes/routes";
import helmet from "helmet";

// express app
const app = express();

// middleware and static files
app.use(helmet());
app.use(express.static("public"));

app.use(router);

app.listen(3000, () => {
  console.log(`Application listening at http://localhost:3000`);
});
