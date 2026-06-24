import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validaciones
      if (!name || name.length <= 2) {
        throw new ServerError("Nombre debe ser mayor a 2 caracteres", 400);
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400);
      }

      if (!password || password.length < 6) {
        throw new ServerError("Password debe tener al menos 6 caracteres", 400);
      }

      const existingUser = await userRepository.getByEmail(email);
      if (existingUser) {
        throw new ServerError("El email ya está registrado", 400);
      }

      //const newUser = await userRepository.create(name, email, password);

      //parametro password Cost factor, entre mas alto mas seguro pero mas lento, 12 es un buen numero para aplicaciones web 1-Costfactor-20
      const hashed_password = await bcrypt.hash(password, 12);

      const newUser = await userRepository.create(name, email, hashed_password);

      const verification_token = jwt.sign(
        {
          email: email,
        },
        ENVIRONMENT.JWT_SECRET,
      );

      await mailer_transport.sendMail({
        to: email,
        from: ENVIRONMENT.GMAIL_USERNAME,
        subject: "Verifica tu mail",
        html: `
                        <h1>Bienvenido a SLACK</h1>
                        <a href='${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}'>Click aqui</a> para verificar tu cuenta
                    `,
      });

      return res.status(201).json({
        message: "Usuario registrado con éxito",
        ok: true,
        status: 201,
        data: {
          user: {
            id: newUser._id,
            name: newUser.nombre,
            email: newUser.email,
          },
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return res.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }
  async verifyEmail(request, response) {
    try {
      const { verification_token } = request.query;
      if (!verification_token) {
        throw new ServerError("Falta el token de verificación0", 400);
      }
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET);
      const { email } = payload;
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new ServerError("Usuario no encontrado", 400);
      }
      if (user.email_verificado) {
        throw new ServerError("Este email ya ha sido verificado", 400);
      }

      await userRepository.updateById(user._id, { email_verificado: true });

      return response.status(200).json({
        message: "Email verificado con éxito",
        ok: true,
        status: 200,
      });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.NotBeforeError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return response.status(401).json({
          message: "Token de verificación inválido",
          ok: false,
          status: 401,
        });
      } else if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return res.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }
  async login(request, response) {
    try {
      const { email, password } = request.body;

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400);
      }

      if (!password || password.length < 6) {
        throw new ServerError("Contraseña invalida", 400);
      }

      const user_found = await userRepository.getByEmail(email);

      if (!user_found) {
        throw new ServerError("Usuario no registrado", 404);
      }

      if (!user_found.email_verificado) {
        throw new ServerError(
          "Usuario con verificacion de mail pendiente",
          401,
        );
      }

      const is_same_password = await bcrypt.compare(
        password,
        user_found.password,
      );

      if (!is_same_password) {
        throw new ServerError("Credenciales invalidas", 401);
      }

      //Ese objeto es el que se guardara dentro del token de authorizacion
      const profile_info = {
        nombre: user_found.nombre,
        email: user_found.email,
        id: user_found._id,
        fecha_creacion: user_found.fecha_creacion,
      };

      //Aca creamos el token
      const access_token = jwt.sign(profile_info, ENVIRONMENT.JWT_SECRET);

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Usuario autentificado exitosamente",
        data: {
          access_token,
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return response.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }
}

const authController = new AuthController();

export default authController;

/* 

COMO VALIDAR UN MAIL?
El usuario se registra con un x mail
El sistema envia un mail con un link tipo 
    <a 
        href='${URL_BACKEND + '/api/auth/verify-email?email=${email}'}'
    >
        click aqui para verificar
    </a>
Cuando el usuario de click a ese link estara emitiendo un GET /api/auth/verify-email?email=pepe@gmail.com desde su navegador
Nosotros recibimos la consulta y cambiamos la propiedad email_verificado a true en la DB

CONSIGNA: 
Agregar la propiedad booleana 'email_verificado' sobre el usuario en el modelo de mongoose.

En el controller de register, luego de crear el usuario, enviar un mail con el link de verificacion.

Crear el endpoint dentro de la ruta api/auth
    GET /verify-email 
        Recibe una querystring llamada email (req.query)
        Valida que el email exista
        Valida que no este verificado aun
        Cambia el verificado a verdadero
        Responde exitosamente
*/

/* 
Como manejar un inicio de sesion?

Vamos a tener un endpoint
POST /api/auth/login
    body:{email,pasword}
    
    -Buscar el usuario por email
    -Validar la contraseña (bcrypt.compare(texto_original,texto_hasheado) esto devolvera un booleano)
    -Crear un jsonwebtoken con los datos de sesion del usuario (username, email, id, created_at)
    -responder con ese token (acces_token)al cliente

*/
