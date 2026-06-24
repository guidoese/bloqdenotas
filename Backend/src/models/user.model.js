import mongoose from "mongoose";
/* 
Definir el esquema que tendra un usuario dentro de nuestra aplicacion.
*/

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fecha_creacion: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    required: true,
    default: true,
  },
  email_verificado: {
    type: Boolean,
    required: true,
    default: false,
  },
});
export const USER_COLLECTION_NAME = "User";
const User = mongoose.model(USER_COLLECTION_NAME, userSchema);

export default User;
