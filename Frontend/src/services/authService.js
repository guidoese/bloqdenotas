export async function login(email, password) {
  try {
    const response_http = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const response = await response_http.json();
    return response;
  } catch (error) {
    throw new Error("Error al hacer el login");
  }
}
//el error  CORS Cross Origin Resourse Sharing de la consulta salta cuando el origen de la consulta difiere de a donde se consulta
//ej: si consulto desde localhost:5173 y tengo ladireccion en el localhost:8080
