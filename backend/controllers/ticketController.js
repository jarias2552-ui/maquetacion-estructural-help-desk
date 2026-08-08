const Ticket = require("../models/Ticket");


// =================================
// CREAR TICKET
// =================================

exports.crearTicket = async(req,res)=>{


    try{


        console.log("📩 Datos recibidos:");
        console.log(req.body);



        const nuevoTicket = new Ticket(req.body);



        const ticketGuardado = await nuevoTicket.save();




        console.log(
            "✅ Ticket guardado:",
            ticketGuardado._id
        );





        return res.status(201).json({

            success:true,

            mensaje:"Ticket creado correctamente",

            ticket:ticketGuardado

        });





    }catch(error){



        console.error(
            "❌ Error creando ticket:",
            error
        );



        return res.status(500).json({


            success:false,

            mensaje:"Error al crear ticket",

            error:error.message


        });



    }


};




// =================================
// OBTENER TODOS LOS TICKETS
// =================================


exports.obtenerTickets = async (req,res)=>{


    try{


        const tickets =
        await Ticket.find()
        .sort({
            createdAt:-1
        });




        return res.json(tickets);




    }catch(error){



        console.error(error);



        return res.status(500).json({


            mensaje:
            "Error obteniendo tickets",


            error:
            error.message


        });



    }


};









// =================================
// OBTENER TICKET POR ID
// =================================


exports.obtenerTicketPorId = async(req,res)=>{


    try{


        const ticket =
        await Ticket.findById(
            req.params.id
        );




        if(!ticket){


            return res.status(404).json({

                mensaje:
                "Ticket no encontrado"

            });


        }




        return res.json(ticket);




    }catch(error){



        return res.status(500).json({


            mensaje:
            "Error buscando ticket",


            error:
            error.message


        });



    }


};









// =================================
// ACTUALIZAR TICKET
// =================================


exports.actualizarTicket = async(req,res)=>{


    try{


        const ticketActualizado =
        await Ticket.findByIdAndUpdate(


            req.params.id,


            req.body,


            {
                new:true,
                runValidators:true
            }


        );





        if(!ticketActualizado){


            return res.status(404).json({


                mensaje:
                "Ticket no encontrado"


            });


        }




        return res.json({


            mensaje:
            "Ticket actualizado correctamente",


            ticket:
            ticketActualizado


        });





    }catch(error){



        return res.status(500).json({


            mensaje:
            "Error actualizando ticket",


            error:
            error.message


        });



    }


};









// =================================
// ELIMINAR TICKET
// =================================


exports.eliminarTicket = async(req,res)=>{


    try{


        const ticketEliminado =
        await Ticket.findByIdAndDelete(
            req.params.id
        );





        if(!ticketEliminado){


            return res.status(404).json({


                mensaje:
                "Ticket no encontrado"


            });


        }





        return res.json({


            mensaje:
            "Ticket eliminado correctamente"


        });






    }catch(error){



        return res.status(500).json({


            mensaje:
            "Error eliminando ticket",


            error:
            error.message


        });



    }


};