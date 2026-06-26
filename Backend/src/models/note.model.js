import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    contenido: {
      type: String,
      default: "",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, // agrega createdAt y updatedAt automáticamente
);

export const NOTE_COLLECTION_NAME = "Note";
const Note = mongoose.model(NOTE_COLLECTION_NAME, noteSchema);

export default Note;
