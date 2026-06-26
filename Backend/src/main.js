import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import notesRouter from "./routes/notes.router.js";
/* SOLO EN LOCAL Y SI TENER PROBLEMAS DE DNS PARA CONECTARTE A MONGODB */
import dns from "dns";
import authMiddleware from "./middlewares/auth.middleware.js";
import cors from "cors";

if (ENVIRONMENT.MODE === "development") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

connectMongoDB();
/* 
Crear una API de express
Route:
     /api/auth
         POST /register
             body:{name, email, password}
             Crear un usuario en la DB
             Validar que el usuario tenga nombre mayor a 2 caracteres,
             Validar Email
             Validar password con al menos 6 caracteres
  Mas adelante...
      POST /login
RECOMENDACION:
    authRouter.posT(
        "/register",
        async(request,response)=>{
          await userRepository.create("pepe")      
}
*/

const app = express();
const port = ENVIRONMENT.PORT;

//Habilitamos las consultas CORS de origen crusado

app.use(cors());

//parse json
app.use(express.json());
//rutas
app.use("/api/auth", authRouter);

app.use("/api/workspace", workspaceRouter);

app.use("/api/notes", notesRouter);

/* 
Ruta: /api/workspace


    controlador: workspaceController
        
        POST '/' post() Debe estar con el authMiddleware (IMPORTANTE)
            Validar nombre y descripcion (opcional)
            Crear un espacio de trabajo
            Crear una membresia de role tipo 'dueño' a nombre del id del cliente consultante.
            
            body: {
                nombre,
                descripcion
            }

        GET '/' getAllByUser() Debe estar con el authMiddleware (IMPORTANTE)
            Buscar todos los espacios de trabajo de los que el cliente consultante es miembro 
            Responder con la lista de espacios de trabajo

        DELETE '/:workspace_id' deleteById() Debe estar con el authMiddleware
            Validar que el espacio de trabajo exista => 404
            Validar que el usuario consultante sea 'dueño' de dicho espacio de trabajo => 403 Forbidden
            Eliminar (Soft o Hard) el espacio de trabajo

        PUT '/:workspace_id' updateById() Debe estar con el authMiddleware
            body: {
                nombre (opcional),
                descripcion (opcional)
            }
            Validar que el espacio de trabajo exista => 404
            Validar que el usuario consultante sea 'dueño' o 'admin' de dicho espacio de trabajo => 403 Forbidden
            Actualizar los campos correspondientes.

    RECOMENDACION:
        Como se repite 
            Validar que el espacio de trabajo exista
            Validar que el cliente consultante sea miembro del espacio de trabajo
        Vendria muy bien usar un middleware que se llame workspaceMiddleware
        Haria:
            - Validar que el espacio de trabajo exista
            - Validar que el cliente consultante sea miembro del espacio de trabajo
            - Guardar en la request la info de:
                workspace
                member
*/

/* 
Un endpoint donde el cliente debera enviarnos por header de autorizacion el access token, en caso de estar presente y ser correcto
Le daremos los datos de la cuenta
*/

app.get(
  "/api/profile",
  /*  (request, response, next) => {
        const random_num = Math.random() 
        console.log('Numero aleatorion generado:', random_num)
        if(random_num > 0.5){
            return response.json({
                message:"Mala suerte campeon ☠"
            })
        }
        else{
            next()
        }
    }, */ authMiddleware,
  (request, response) => {
    console.log("Nombre del cliente:", request.user.nombre);
    return response.json({
      ok: true,
      status: 200,
      message: "Estas autenticando",
    });
  },
);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

/* 

/api/auth => Trabaja todo lo relacionado a autentificacion 
/api/workspace => Trabaja todo lo relacionado a workspaces
    /:workspace_id/members => Todo lo relacionado a membresias
    /:workspace_id/channels => Todo lo relacionado a canales
        /:channel_id/messages => Todo lo relacionado a mensajes
    /:workspace_id/contacts


Crear mensaje: 
    POST /api/workspaces/:workspace_id/channels/:channel_id/messages
    authMiddleware
    verifyWorkspaceMiddleware
    verifyChannelMiddleware
    messagesController.create()
*/
