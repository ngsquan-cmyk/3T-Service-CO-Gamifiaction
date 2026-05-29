import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gameRouter from "./game";
import managerRouter from "./manager";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gameRouter);
router.use(managerRouter);
router.use(settingsRouter);

export default router;
