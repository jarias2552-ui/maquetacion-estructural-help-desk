require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ticketRoutes = require("./routes/ticketRoutes");
const app = express();

// Verificar variables del archivo .env
console.log("Puerto:", process.env.PORT);
console.log("MongoDB:", process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de tickets
app.use("/api/tickets", ticketRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) => console.error("❌ Error al conectar a MongoDB:", error));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API Help Desk funcionando correctamente"
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});