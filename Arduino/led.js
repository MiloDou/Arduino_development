const five = require("johnny-five");
const options = { repl: true };

if (process.env.ARDUINO_PORT) options.port = process.env.ARDUINO_PORT;

const board = new five.Board(options);

board.on("ready", function () {
  const led = new five.Led(Number(process.env.LED_PIN || 13));
  this.repl.inject({ led });
  console.log("LED listo en el REPL: usa led.on(), led.off() o led.blink(500).");
});

board.on("error", (error) => {
  console.error(`No se pudo conectar con Arduino: ${error.message}`);
  process.exitCode = 1;
});

