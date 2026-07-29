const Ticket = require("../models/Ticket");

// Crear un ticket
exports.crearTicket = async (req, res) => {
  try {
    const nuevoTicket = new Ticket(req.body);

    await nuevoTicket.save();

    res.status(201).json({
      mensaje: "Ticket creado correctamente",
      ticket: nuevoTicket
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el ticket",
      error: error.message
    });
  }
};


// Obtener todos los tickets
exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();

    res.json(tickets);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener tickets",
      error: error.message
    });
  }
};


// Obtener un ticket por ID
exports.obtenerTicketPorId = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        mensaje: "Ticket no encontrado"
      });
    }

    res.json(ticket);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar ticket",
      error: error.message
    });
  }
};


// Actualizar ticket
exports.actualizarTicket = async (req, res) => {
  try {
    const ticketActualizado = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      mensaje: "Ticket actualizado correctamente",
      ticket: ticketActualizado
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar ticket",
      error: error.message
    });
  }
};


// Eliminar ticket
exports.eliminarTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Ticket eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar ticket",
      error: error.message
    });
  }
};