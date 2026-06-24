import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import workspaceController from "../controllers/workspace.controller.js";

const workspaceRouter = express.Router();

//Configuramos el authMiddleware a nivel de ruta
workspaceRouter.use(authMiddleware);

workspaceRouter.post("/", authMiddleware, workspaceController.create);

workspaceRouter.get("/", authMiddleware, workspaceController.getAllByUser);

export default workspaceRouter;
