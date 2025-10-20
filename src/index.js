import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

const app = express();

// Middleware para parsear JSON y datos de formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta "public" como estática
app.use(express.static(path.join(__dirname, "public")));


// Rutas frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/clientes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "clientes.html"));
});

// entradas de la api

// GET /api/numeros - Obtener todos los números
app.get("/api/numeros", (req, res) => {
  db.query("SELECT * FROM numeros", (err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// POST /api/numeros - Agregar un nuevo número
app.post("/api/numeros", (req, res) => {
  const { nombre, numero, red_social, categoria } = req.body;
  db.query("INSERT INTO numeros (nombre, numero, red_social, categoria) VALUES (?, ?, ?, ?)", [nombre, numero, red_social, categoria], (err, results) => {
    if (err) {
      console.error("Error adding contact:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId, nombre: nombre, numero: numero, red_social: red_social, categoria: categoria });
  });
});


// GET /api/numeros/:id - Obtener un número por ID
app.get("/api/numeros/:id", (req, res) => {
  const contactId = req.params.id;
  db.query("SELECT * FROM numeros WHERE id = ?", [contactId], (err, results) => {
    if (err) {
      console.error("Error fetching contact:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }
    res.json(results);
  });
});

app.delete("/api/numeros/:id", (req, res) => {
  const contactId = req.params.id;
  db.query("DELETE FROM numeros WHERE id = ?", [contactId], (err, results) => {
    if (err) {
      console.error("Error deleting contact:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  });
}
);

// GET /api/clientes - Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// POST /api/clientes - Agregar un nuevo cliente
app.post("/api/clientes", (req, res) => {
  const { nombre, numero, red_social, categoria, descripcion, fecha_inicial, fecha_final, plan, precio } = req.body;
  db.query("INSERT INTO clientes (nombre, numero, red_social, categoria, descripcion, fecha_inicial, fecha_final, plan, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [nombre, numero, red_social, categoria, descripcion, fecha_inicial, fecha_final, plan, precio], (err, results) => {
    if (err) {
      console.error("Error adding client:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId, nombre, numero, red_social, categoria, descripcion, fecha_inicial, fecha_final, plan, precio });
  });
});




// arrancar el servidor
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
