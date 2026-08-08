const mongoose = require("mongoose");


const ticketSchema = new mongoose.Schema(

{

    titulo: {

        type: String,

        required: [true, "El título es obligatorio"],

        trim: true,

        minlength: 3

    },


    descripcion: {

        type: String,

        required: [true, "La descripción es obligatoria"],

        trim: true,

        minlength: 5

    },


    categoria: {

        type: String,

        required: [true, "La categoría es obligatoria"],

        enum: [

            "Hardware",
            "Software",
            "Red",
            "Impresora",
            "Sistema"

        ]

    },


    prioridad: {

        type: String,

        required: [true, "La prioridad es obligatoria"],

        enum: [

            "Alta",
            "Media",
            "Baja"

        ]

    },


    estado: {

        type: String,

        default: "Abierto",

        enum: [

            "Abierto",
            "En Proceso",
            "Cerrado"

        ]

    },


    usuario: {

        type: String,

        required: [true, "El usuario es obligatorio"],

        trim: true

    }


},

{

    timestamps:true

}

);



module.exports = mongoose.model(
    "Ticket",
    ticketSchema
);