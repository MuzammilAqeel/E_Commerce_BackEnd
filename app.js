const express = require("express");
const authRouter = require("./routes/authRoutes");
const projectsRouter = require("./routes/projectsRoutes");
const cors = require('cors');

const app = express();


//middleware
app.use(express.json());
app.use(express.static('public'))
app.use(cors({
    origin: true
}));



//routers
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/project", projectsRouter)


module.exports = app;