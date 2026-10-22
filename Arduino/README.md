# Ejemplos Johnny-Five

Estos ejemplos controlan el LED integrado (pin 13 por defecto) mediante Johnny-Five. Instala las dependencias desde esta carpeta:

```sh
npm install
```

Carga **StandardFirmata** en el Arduino antes de ejecutar un ejemplo.

## Parpadeo

```sh
npm run blink
```

## Control manual desde el REPL

```sh
npm run led
```

Cuando la placa esté lista, usa `led.on()`, `led.off()` o `led.blink(500)` en la consola de Johnny-Five.

Johnny-Five intenta detectar el puerto automáticamente. Si hace falta, indica el puerto antes de ejecutar:

```sh
ARDUINO_PORT=/dev/ttyACM0 npm run blink
ARDUINO_PORT=/dev/ttyACM0 npm run led
```

En Windows PowerShell, por ejemplo: `$env:ARDUINO_PORT="COM3"; npm run blink`.
Para una placa con otro pin LED, define también `LED_PIN`, por ejemplo `LED_PIN=12 npm run blink`.

Las notas y pruebas de socket incompletas están en [`borradores`](./borradores/README.md). No se necesitan para estos ejemplos.
