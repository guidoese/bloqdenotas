import Note from "../models/note.model.js";

class NoteRepository {
  async getAllByUserId(user_id) {
    return await Note.find({ user_id: user_id }).sort({ createdAt: -1 });
  }

  async getById(note_id) {
    return await Note.findById(note_id);
  }

  async create(titulo, contenido, user_id) {
    return await Note.create({
      titulo,
      contenido,
      user_id,
    });
  }

  async updateById(note_id, update_data) {
    return await Note.findByIdAndUpdate(note_id, update_data, { new: true });
  }

  async deleteById(note_id) {
    /* HARD DELETE */
    await Note.findByIdAndDelete(note_id);
  }
}

const noteRepository = new NoteRepository();

export default noteRepository;
