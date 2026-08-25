import { Router } from "express";
import { healthRouter } from "./health";
import { chatRouter } from "./chat";
import { projectAIRouter } from "./projectAI";
import { resultsAIRouter } from "./resultsAI";
import { searchRouter } from "./search";
import { adminRouter } from "./admin";
import { compareAIRouter } from "./compareAI";

export const masterRouter = Router();

masterRouter.use(healthRouter);
masterRouter.use(chatRouter);
masterRouter.use(projectAIRouter);
masterRouter.use(resultsAIRouter);
masterRouter.use(searchRouter);
masterRouter.use(adminRouter);
masterRouter.use(compareAIRouter);
