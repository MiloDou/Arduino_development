const five = require("johnny-five");
const options = { repl: false };

if (process.env.ARDUINO_PORT) options.port = process.env.ARDUINO_PORT;

const board = new five.Board(options);

board.on("ready", () => {
  const led = new five.Led(Number(process.env.LED_PIN || 13));
  led.blink(500);
  console.log("Parpadeo iniciado. Presiona Ctrl+C para salir.");
});

board.on("error", (error) => {
  console.error(`No se pudo conectar con Arduino: ${error.message}`);
  process.exitCode = 1;
});
