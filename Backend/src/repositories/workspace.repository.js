/* 
Crear el repository para manipular espacios de trabajo

- getAll() Obtiene toda la lista de espacios de trabajo activos (Recomendacion: Usen find en vez de findOne, ya que quieren obtener una lista de resultados)
- getById(workspace_id) Obtener un espacio de trabajo por su id
- deleteById(workspace_id) Eliminar un espacio de trabajo por su id (soft delete)
- updateById(workspace_id, update_data) Permite actualizar un espacio de trabajo por su ID
- create(nombre, descripcion) Permite crear un espacio de trabajo en la DB 
*/
import Workspace from "../models/workspace.model.js";
class WorkspaceRepository {
  async getAll() {
    return await Workspace.find({ activo: true });
  }
  async getById(workspace_id) {
    return await Workspace.findById(workspace_id);
  }
  async softDeleteById(workspace_id) {
    //se puede usar
    return await this.updateById(workspace_id, { activo: false });
    //await Workspace.findByIdAndUpdate(workspace_id, {activo: false});
  }
  async deleteById(workspace_id) {
    return await Workspace.findByIdAndDelete(workspace_id);
    // si fuera un hard delete return await Workspace.findByIdAndDelete(workspace_id);

    //se puede usar
    //return await this.updateById(workspace_id, { activo: false });
  }

  async updateById(workspace_id, update_data) {
    return await Workspace.findByIdAndUpdate(workspace_id, update_data);
  }
  async create(nombre, descripcion) {
    return await Workspace.create({
      nombre,
      descripcion,
    });
  }
}
const workspaceRepository = new WorkspaceRepository();
export default workspaceRepository;

/* 
Modelos de mongoose con referencias a otra coleccion
Metodo populate. Que hace? para que sirve?
*/
