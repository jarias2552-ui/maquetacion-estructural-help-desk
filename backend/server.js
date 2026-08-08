require("dotenv").config();


const express = require("express");

const cors = require("cors");

const helmet = require("helmet");


const conectarDB = require("./config/database");


const ticketRoutes = require("./routes/ticketRoutes");



const app = express();





// =========================
// SEGURIDAD
// =========================


app.use(
    helmet()
);





// =========================
// CORS
// =========================


app.use(
    cors({
        origin:"*",
        methods:[
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ]
    })
);





// =========================
// MIDDLEWARES
// =========================


app.use(
    express.json()
);





// =========================
// CONEXIÓN BD
// =========================


conectarDB();






// =========================
// RUTAS
// =========================


app.use(
    "/api/tickets",
    ticketRoutes
);







// =========================
// RUTA PRUEBA
// =========================


app.get(
    "/",
    (req,res)=>{


        res.json({

            sistema:
            "Help Desk API",

            estado:
            "Servidor funcionando correctamente",

            version:
            "1.0.0"

        });


    }
);







// =========================
// MANEJO DE ERRORES
// =========================


app.use(
    (error,req,res,next)=>{


        console.error(error);



        res.status(500).json({

            mensaje:
            "Error interno del servidor"

        });


    }
);







// =========================
// SERVIDOR
// =========================


const PORT =
process.env.PORT || 3000;



app.listen(
    PORT,
    ()=>{


        console.log(
        `🚀 API ejecutándose en puerto ${PORT}`
        );


    }
);