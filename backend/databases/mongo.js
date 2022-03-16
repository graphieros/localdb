import mongoose from "mongoose";

const mongoPwd = import.meta.env.VITE_MONGO_PWD;

const ambient = (process.env.NODE_ENV || "development") + "Db";

const dbUrl = `mongodb+srv://aleclloydprobert:${mongoPwd}@cluster0.tvsst.mongodb.net/${ambient}?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once("open", () => {
  console.log(`Conectado ao banco ${ambient} com sucesso!`);
});
