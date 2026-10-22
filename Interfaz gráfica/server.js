const path = require("node:path");
const express = require("express");
const http = require("node:http");
const { Server } = require("socket.io");
const five = require("johnny-five");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;
const ledPin = Number(process.env.LED_PIN || 13);

app.use(express.static(__dirname));
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "interfaz.html")));
const boardOptions = { repl: false, debug: false };
if (process.env.ARDUINO_PORT) boardOptions.port = process.env.ARDUINO_PORT;
const board = new five.Board(boardOptions);
let led;
let boardReady = false;
let powerOn = false;

board.on("ready", () => {
  led = new five.Led(ledPin);
  boardReady = true;
  console.log(`Arduino conectado. LED integrado/controlado en pin ${ledPin}.`);
  io.emit("board-status", { ready: true, message: "Arduino listo para recibir comandos." });
});

board.on("error", (error) => {
  console.error("Error de Arduino:", error.message);
  boardReady = false;
  io.emit("board-status", { ready: false, message: "ERROR DE CONEXIÓN CON ARDUINO" });
});

board.on("close", () => {
  boardReady = false;
  io.emit("board-status", { ready: false, message: "ARDUINO DESCONECTADO" });
});

io.on("connection", (socket) => {
  socket.emit("board-status", {
    ready: boardReady,
    message: boardReady ? "Arduino listo para recibir comandos." : "Esperando conexión con Arduino…"
  });
  socket.emit("board-state", powerOn);

  socket.on("power", (encender) => {
    if (!boardReady || !led) {
      socket.emit("board-status", { ready: false, message: "Arduino todavía no está listo." });
      return;
    }
    powerOn = Boolean(encender);
    powerOn ? led.on() : led.off();
    io.emit("board-state", powerOn);
  });

  socket.on("send-message", (texto) => {
    if (typeof texto !== "string" || !texto.trim() || texto.length > 240) {
      socket.emit("message-result", { ok: false, message: "Mensaje vacío o demasiado largo." });
      return;
    }
    // El texto llega correctamente a Node.js. Para mostrarlo en un LCD/OLED
    // hay que añadir el modelo y cableado de esa pantalla.
    console.log("Mensaje recibido desde la interfaz:", texto.trim());
    socket.emit("message-result", {
      ok: true,
      message: "Mensaje recibido por Johnny-Five/Node. Falta configurar la pantalla para mostrarlo."
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Interfaz abierta en http://localhost:${PORT}`);
});
