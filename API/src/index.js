// npm i (installs all dependencies)
// *extension*: REST client (for using tester.http)
//to run: npm run dev |OR| node index.js


import express from "express";
import cors from "cors";
import {PORT} from "./config.js";
import routesPrueba from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("API de DataScope activa y funcionando 🚀");
});

app.use('/api', routesPrueba);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API de DataScope corriendo en el puerto ${PORT}`);
});