import mongoose from "mongoose";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import { USER_COLLECTION_NAME } from "./user.model.js";

const WorkspaceMemberSchema = new mongoose.Schema({
  fk_workspace_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: WORKSPACE_COLLECTION_NAME,
  }, //es un id que usamos por buenas practicas
  fk_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION_NAME, // como mongodb no tiene claves foraneas, se hace referencia a la coleccion a la que se refiere, para luego usar el metodo populate y obtener toda la informacion del usuario, en vez de solo el id
  },
  fecha_creacion: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  rol: {
    enum: [
      MEMBER_WORKSPACE_ROLES.USER,
      MEMBER_WORKSPACE_ROLES.OWNER,
      MEMBER_WORKSPACE_ROLES.ADMIN,
    ],
    type: String,
    default: MEMBER_WORKSPACE_ROLES.USER,
  },
});
export const WORKSPACE_MEMBER_MODEL_NAME = "WorkspaceMember";
const WorkspaceMember = mongoose.model(
  WORKSPACE_MEMBER_MODEL_NAME,
  WorkspaceMemberSchema,
);
export default WorkspaceMember;
