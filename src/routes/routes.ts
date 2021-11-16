import express from "express";
import controllers from "../controllers/controllers";

const router = express.Router();

router.get("/", controllers.index);
router.post("/api/params", controllers.getParams);

router.get("/api/model", controllers.getModel);

router.get("/test", controllers.getTest);
router.post("/test", controllers.postTest);

export default router;
