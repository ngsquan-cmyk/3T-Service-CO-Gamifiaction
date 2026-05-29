import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gameRouter from "./game";
import managerRouter from "./manager";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gameRouter);
router.use(managerRouter);

export default router;
