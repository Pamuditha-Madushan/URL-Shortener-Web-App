import { Router } from "express";
import { RequestHandler } from "express";
import urlController from "../controllers/urlController";

const urlRoutes = Router();

urlRoutes.post("/generate", urlController.generateShortUrl as RequestHandler);

urlRoutes.get(
  "/analytics/:shortenUrl",
  urlController.handleAnalytics as RequestHandler
);

urlRoutes.get(
  "/redirect/:shortenUrl",
  urlController.handleRedirect as RequestHandler
);

export default urlRoutes;
