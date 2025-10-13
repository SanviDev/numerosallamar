import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

const app = express();

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta "public" como estática
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

app.post("/api/numeros", (req, res) => {
  const { name, phone, social_network, category } = req.body;
  db.query("INSERT INTO numeros (nombre, numero, red_social, categoria) VALUES (?, ?, ?, ?)", [name, phone, social_network, category], (err, results) => {
    if (err) {
      console.error("Error adding contact:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId, nombre: name, numero: phone, red_social: social_network, categoria: category });
  });
});

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

app.post("/api/clientes", (req, res) => {
  const { numberId, tipoWeb, fechaLimite } = req.body;
  db.query("INSERT INTO clientes (numberId, tipoWeb, fechaLimite) VALUES (?, ?, ?)", [numberId, tipoWeb, fechaLimite], (err, results) => {
    if (err) {
      console.error("Error adding client:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId, numberId, tipoWeb, fechaLimite });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
