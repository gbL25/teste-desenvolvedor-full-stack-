// Middleware para tratamento de rotas não encontradas (Erro 404)

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method,
  });
};

// Middleware global para tratamento de erros (Captura erros 400, 500 e outros.)

const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Requisição inválida. O corpo do JSON está malformatado.",
    });
  }

  console.error("Erro interno:", err.message);
  console.error("Stack:", err.stack);

  // Define o código HTTP: usa a propriedade existente no erro ou assume 500 (Erro Interno) como padrão
  const statusCode = err.status || err.statusCode || 500;

  const message = statusCode !== 500 ? err.message : "Erro interno do servidor";

  res.status(statusCode).json({
    error: message,

    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
