import app from "./app.js";

const port = process.env.PORT || "3004"; // string or num ??
const ambient = process.env.NODE_ENV || "development";

app.listen(port, () => {
  console.log(`App no do RA iniciado na porta ${port} no modo ${ambient}`);
});
