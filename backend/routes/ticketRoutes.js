const express = require("express");
const router = express.Router();

const {
  crearTicket,
  obtenerTickets,
  obtenerTicketPorId,
  actualizarTicket,
  eliminarTicket
} = require("../controllers/ticketController");


// Crear ticket
router.post("/", crearTicket);

// Obtener todos los tickets
router.get("/", obtenerTickets);

// Obtener un ticket por ID
router.get("/:id", obtenerTicketPorId);

// Actualizar ticket
router.put("/:id", actualizarTicket);

// Eliminar ticket
router.delete("/:id", eliminarTicket);


module.exports = router;