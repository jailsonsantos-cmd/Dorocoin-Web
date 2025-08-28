const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Banco de dados SQLite
const db = new sqlite3.Database("./database.db");

// Criar tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    turma TEXT NOT NULL,
    saldo INTEGER DEFAULT 0
  )`);

  // Inserir a Bethéia Nubia só se não existir
  db.get("SELECT * FROM alunos WHERE nome = ?", ["Bethéia Nubia"], (err, row) => {
    if (!row) {
      db.run("INSERT INTO alunos (nome, turma, saldo) VALUES (?, ?, ?)", [
        "Bethéia Nubia",
        "1ºA",
        100
      ]);
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint para pegar alunos
app.get("/api/alunos", (req, res) => {
  db.all("SELECT * FROM alunos", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint para atualizar saldo
app.post("/api/alunos/:id", (req, res) => {
  const { id } = req.params;
  const { saldo } = req.body;

  db.run("UPDATE alunos SET saldo = ? WHERE id = ?", [saldo, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Saldo atualizado com sucesso" });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
