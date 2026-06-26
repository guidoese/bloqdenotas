import noteRepository from "../repositories/notes.repository.js";
import ServerError from "../helpers/serverError.helper.js"; // ajustá la ruta real

class NoteController {
  async getAll(request, response) {
    try {
      const notes = await noteRepository.getAllByUserId(request.user.id);

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Notas obtenidas exitosamente",
        data: notes,
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }

  async create(request, response) {
    try {
      const { titulo, contenido } = request.body;

      if (!titulo) {
        throw new ServerError("El título es obligatorio", 400);
      }

      const new_note = await noteRepository.create(
        titulo,
        contenido,
        request.user.id,
      );

      return response.status(201).json({
        ok: true,
        status: 201,
        message: "Nota creada exitosamente",
        data: new_note,
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const { titulo, contenido } = request.body;

      const note_found = await noteRepository.getById(id);

      if (!note_found) {
        throw new ServerError("Nota no encontrada", 404);
      }

      // Verificamos que la nota le pertenezca al usuario logueado
      if (note_found.user_id.toString() !== request.user.id) {
        throw new ServerError("No tenés permiso para modificar esta nota", 403);
      }

      const updated_note = await noteRepository.updateById(id, {
        titulo,
        contenido,
      });

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Nota actualizada exitosamente",
        data: updated_note,
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      const note_found = await noteRepository.getById(id);

      if (!note_found) {
        throw new ServerError("Nota no encontrada", 404);
      }

      if (note_found.user_id.toString() !== request.user.id) {
        throw new ServerError("No tenés permiso para eliminar esta nota", 403);
      }

      await noteRepository.deleteById(id);

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Nota eliminada exitosamente",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }
}

const noteController = new NoteController();

export default noteController;
