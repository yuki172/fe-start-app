import { Router } from "express";
import feedsController from "./feeds/controller.js";

const routes = Router().use(feedsController);

export default routes;
