import express from "express";
import controllers from "../controllers/controllers";

const router = express.Router();

router.get("/", controllers.index);

export default router;
