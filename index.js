//Importa dependencias
const express = require("express")
const agentes = require('./data/agentes.js')
const app = express()
const jwt = require("jsonwebtoken")
const secretKey = "secKey"
const port = 3000

//Disponibiliza servidor en puerto preespecificado
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`))

//Disponibiliza raiz
app.use(express.static("public"))
app.get("/", (req, res) => {
  res.send(__dirname + "index.html")
})

// Disponibiliza ruta Inicio de sesión
app.get("/SignIn", (req, res) => {
  const { email, password } = req.query
  const user = agentes.results.find(
    (u) => u.email == email && u.password == password
  );
  if (user) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: user,
      },
      secretKey
    );
    res.send(`
      ${email}
      <div style="font-size:24px !important; color:red;">
      <a href="/Secret?token=${token}"> <p> Ruta Restringida &#128272</p> </a>
      <script>localStorage.setItem('token', JSON.stringify("${token}"))</script>
      </div>
      `)
  } else {
    res.send(`<div style="font-size:24px">Verifique credenciales.&#129300\nUsuario(a) y/o password incorrecto(s) &#128683\n<a href="/"> <p>Volver &#128257</p> </a></div>`)
  }
})

// Disponibiliza ruta restringida a usuarios registrados
app.get("/Secret", (req, res) => {
  const { token } = req.query
  jwt.verify(token, secretKey, (err, decoded) => {
    err
      ? res.status(401).send({
          error: "401 Usted no está autorizado.",
          message: err.message,
        })
      : res.send(`<div style="font-size:24px">&#128275 Bienvenido ${decoded.data.email} &#128373\n <a href="/"> <p style="color:green"> Volver al Inicio &#128257 </p> </a></div>`)
  })
})