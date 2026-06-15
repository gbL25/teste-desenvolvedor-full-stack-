const express = require("express");
const cors = require("cors");
const atendimentosRoutes = require("./routes/atendimentos");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/atendimentos", atendimentosRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware de rota não encontrada (404)
app.use(notFoundHandler);

// Middleware global de tratamento de erros (500)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
