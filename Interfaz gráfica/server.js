const path = require("node:path");
const express = require("express");
const http = require("node:http");
const { Server } = require("socket.io");
const five = require("johnny-five");

const hostname = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8081);
const ledPin = Number(process.env.LED_PIN || 13);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static(__dirname));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "interfaz.html"));
});

const boardOptions = { repl: false, debug: false };
if (process.env.ARDUINO_PORT) boardOptions.port = process.env.ARDUINO_PORT;

const board = new five.Board(boardOptions);
let led;
let boardReady = false;
let powerOn = false;
let boardMessage = "Esperando conexión con Arduino…";

function enviarEstado(ready, message) {
  boardReady = ready;
  boardMessage = message;
  io.emit("board-status", { ready, message });
}

function cambiarLed(encender, socket) {
  if (!boardReady || !led) {
    socket.emit("board-status", {
      ready: false,
      message: "Arduino todavía no está listo."
    });
    return;
  }

  powerOn = encender;
  if (powerOn) led.on();
  else led.off();
  io.emit("board-state", powerOn);
}

board.on("ready", () => {
  led = new five.Led(ledPin);
  console.log(`Arduino conectado. LED controlado en el pin ${ledPin}.`);
  enviarEstado(true, "Arduino listo para recibir comandos.");
});

board.on("error", (error) => {
  console.error("Error de Arduino:", error.message);
  enviarEstado(false, `ERROR DE CONEXIÓN CON ARDUINO: ${error.message}`);
});

board.on("close", () => {
  enviarEstado(false, "ARDUINO DESCONECTADO");
});

io.on("connection", (socket) => {
  socket.emit("board-status", {
    ready: boardReady,
    message: boardMessage
  });
  socket.emit("board-state", powerOn);

  // Eventos que usa la interfaz NEON//LINK.
  socket.on("power", (encender) => cambiarLed(Boolean(encender), socket));

  // Compatibilidad con los nombres del ejemplo original.
  socket.on("Encender", () => cambiarLed(true, socket));
  socket.on("Apagar", () => cambiarLed(false, socket));

  socket.on("send-message", (texto) => {
    if (typeof texto !== "string" || !texto.trim() || texto.length > 240) {
      socket.emit("message-result", {
        ok: false,
        message: "Mensaje vacío o demasiado largo."
      });
      return;
    }

    const mensaje = texto.trim();
    console.log("Mensaje recibido desde la interfaz:", mensaje);
    socket.emit("message-result", {
      ok: true,
      message: "Mensaje recibido por el servidor."
    });
  });
});

httpServer.listen(port, hostname, () => {
  console.log(`Interfaz abierta en http://${hostname}:${port}`);
});
