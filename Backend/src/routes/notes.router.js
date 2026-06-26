import express from "express";
import noteController from "../controllers/note.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const noteRouter = express.Router();

// Todas las rutas de notas requieren estar logueado
noteRouter.use(authMiddleware);

noteRouter.get("/", noteController.getAll);
noteRouter.post("/", noteController.create);
noteRouter.put("/:id", noteController.update);
noteRouter.delete("/:id", noteController.delete);

export default noteRouter;
