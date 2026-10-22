# Proyectos de Arduino

Repositorio con tres proyectos independientes para Arduino: una interfaz web para controlar un LED, ejemplos con Johnny-Five y un sketch de secuencias con LEDs y pulsador.

## Contenido

| Carpeta | Qué contiene | Qué necesitas |
| --- | --- | --- |
| [`Interfaz gráfica`](./Interfaz%20gr%C3%A1fica/) | Página web y servidor Node.js para encender y apagar el LED integrado y recibir mensajes de texto. | Node.js, npm, Arduino IDE y una placa con StandardFirmata. |
| [`Arduino`](./Arduino/) | Ejemplos Johnny-Five: parpadeo y control manual desde una consola. | Node.js, npm, Arduino IDE y una placa con StandardFirmata. |
| [`L10_Secuencias_Arduino`](./L10_Secuencias_Arduino/) | Sketch para recorrer secuencias en ocho LEDs con un pulsador. | Arduino IDE, Arduino Uno, ocho LEDs, resistencias y un pulsador. |

Los apuntes y experimentos que no están completos se conservan en [`Arduino/borradores`](./Arduino/borradores/); no hace falta instalarlos ni ejecutarlos.

## Instalaciones necesarias

### Para los proyectos con Node.js

1. Instala **Node.js LTS** desde [nodejs.org](https://nodejs.org/). npm se incluye con Node.js; no hace falta instalarlo por separado.
2. Comprueba la instalación en una terminal:

   ```sh
   node --version
   npm --version
   ```

3. Instala **Git** si vas a clonar el repositorio con `git clone`. Si descargaste el ZIP desde GitHub, puedes omitir Git.

No instales Express, Johnny-Five ni Socket.IO globalmente: los comandos `npm install` de cada proyecto descargan sus dependencias locales usando `package.json` y `package-lock.json`.

### Para cargar los programas en la placa

1. Instala **Arduino IDE** desde [arduino.cc/en/software](https://www.arduino.cc/en/software/).
2. Conecta la placa con un cable USB que permita transferencia de datos. Si el sistema operativo no reconoce la placa, instala el controlador USB correspondiente al modelo de la placa.
3. En Arduino IDE, selecciona el modelo de placa y el puerto serial correcto.
4. Para los proyectos Johnny-Five, carga **StandardFirmata** desde `Archivo > Ejemplos > Firmata > StandardFirmata` y deja la placa conectada mientras uses la aplicación.

El sketch de secuencias se carga directamente en la placa desde Arduino IDE; no necesita Node.js ni StandardFirmata.

## Proyecto 1: interfaz web

Desde una terminal, entra a la carpeta y descarga las dependencias:

```sh
cd "Interfaz gráfica"
npm install
npm start
```

Abre <http://localhost:3000> en el navegador. La interfaz controla el LED integrado del pin 13 por defecto. El campo de mensaje envía el texto al servidor y lo imprime en la terminal; para mostrarlo en un LCD u OLED habría que añadir y cablear ese modelo de pantalla.

Johnny-Five intenta encontrar el puerto serial automáticamente. Si no detecta la placa, inicia el servidor indicando el puerto. En Linux:

```sh
ARDUINO_PORT=/dev/ttyACM0 npm start
```

En Windows PowerShell:

```powershell
$env:ARDUINO_PORT="COM3"
npm start
```

Si el LED está en otro pin, configura `LED_PIN` antes de `npm start` (por ejemplo `LED_PIN=12 npm start` en Linux o `$env:LED_PIN="12"` en PowerShell).

## Proyecto 2: ejemplos Johnny-Five

Abre otra terminal en la carpeta `Arduino` e instala las dependencias:

```sh
cd Arduino
npm install
```

Para iniciar el parpadeo del LED:

```sh
npm run blink
```

Para controlarlo manualmente desde la consola interactiva:

```sh
npm run led
```

En la consola de Johnny-Five puedes usar `led.on()`, `led.off()` y `led.blink(500)`. Para salir, presiona `Ctrl+C`.

Las variables `ARDUINO_PORT` y `LED_PIN` también funcionan aquí. En Linux, por ejemplo: `ARDUINO_PORT=/dev/ttyACM0 LED_PIN=13 npm run blink`. En Windows PowerShell:

```powershell
$env:ARDUINO_PORT="COM3"
$env:LED_PIN="13"
npm run blink
```

## Proyecto 3: secuencias de LEDs

Abre `L10_Secuencias_Arduino/L10_Secuencias_Arduino.ino` en Arduino IDE, selecciona Arduino Uno y el puerto serial, y pulsa **Subir**. El archivo [`LEEME.txt`](./L10_Secuencias_Arduino/LEEME.txt) describe el cableado: ocho LEDs en D2–D9, cada uno con una resistencia de 330 Ω, y un pulsador entre D10 y GND.

## Solución de problemas

- **No aparece el puerto:** revisa el cable USB, los controladores de la placa y el puerto seleccionado en Arduino IDE. Cierra el Monitor Serial mientras Johnny-Five usa la placa.
- **Johnny-Five no encuentra Arduino:** confirma que la placa tenga cargado StandardFirmata y configura `ARDUINO_PORT` con el puerto correcto.
- **El servidor arranca, pero los botones están desactivados:** espera a que la página muestre la placa como conectada; el servidor habilita los botones al recibir el evento `ready` de Johnny-Five.
- **Cambiaste el código y algo dejó de funcionar:** ejecuta `npm install` desde la carpeta del proyecto Node correspondiente para restaurar sus dependencias.
