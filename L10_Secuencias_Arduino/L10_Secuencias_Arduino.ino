#include <Arduino.h>

const byte leds[8] = {2, 3, 4, 5, 6, 7, 8, 9};
const byte boton = 10;
const byte secuencia06[8] = {0x01, 0x04, 0x10, 0x40, 0x80, 0x20, 0x08, 0x02};
const byte secuencia07[6] = {0x18, 0x24, 0x42, 0x81, 0x42, 0x24};

byte modo = 0;
byte paso = 0;
byte faseCarga = 0;
byte parpadeos = 0;
byte bitCarga = 0;
byte carga = 0;
byte lecturaAnterior = HIGH;
byte estadoBoton = HIGH;
unsigned long tiempoPaso = 0;
unsigned long tiempoRebote = 0;

void mostrar(byte valor) {
  for (byte i = 0; i < 8; i++) {
    digitalWrite(leds[i], bitRead(valor, i));
  }
}

byte pasoL05(byte n) {
  if (n < 8) return 1 << n;
  return 1 << (14 - n);
}

byte cantidadPasos() {
  if (modo == 0) return 14;
  if (modo == 1) return 8;
  return 6;
}

byte patron(byte n) {
  if (modo == 0) return pasoL05(n);
  if (modo == 1) return secuencia06[n];
  return secuencia07[n];
}

void reiniciar() {
  paso = 0;
  faseCarga = 0;
  parpadeos = 0;
  bitCarga = 0;
  carga = 0;
  tiempoPaso = millis();
  mostrar(0);
  if (modo < 3) {
    mostrar(patron(paso));
    paso = 1;
  }
}

void revisarBoton() {
  byte lectura = digitalRead(boton);
  unsigned long ahora = millis();

  if (lectura != lecturaAnterior) tiempoRebote = ahora;

  if (ahora - tiempoRebote >= 35 && lectura != estadoBoton) {
    estadoBoton = lectura;
    if (estadoBoton == LOW) {
      modo = (modo + 1) % 4;
      reiniciar();
    }
  }

  lecturaAnterior = lectura;
}

void actualizarSecuencia(unsigned long ahora) {
  if (ahora - tiempoPaso < 200) return;
  tiempoPaso = ahora;
  mostrar(patron(paso));
  paso++;
  if (paso >= cantidadPasos()) paso = 0;
}

void actualizarCarga(unsigned long ahora) {
  unsigned long espera = (faseCarga == 2) ? 200 : (faseCarga == 3 ? 2000 : 150);
  if (ahora - tiempoPaso < espera) return;
  tiempoPaso = ahora;

  if (faseCarga == 0) {
    mostrar(carga | (1 << bitCarga));
    faseCarga = 1;
  } else if (faseCarga == 1) {
    parpadeos++;
    if (parpadeos < 3) {
      mostrar(carga);
      faseCarga = 0;
    } else {
      carga |= (1 << bitCarga);
      mostrar(carga);
      faseCarga = 2;
    }
  } else if (faseCarga == 2) {
    if (bitCarga < 7) {
      bitCarga++;
      parpadeos = 0;
      faseCarga = 0;
    } else {
      faseCarga = 3;
    }
  } else {
    carga = 0;
    bitCarga = 0;
    parpadeos = 0;
    mostrar(0);
    faseCarga = 0;
  }
}

void setup() {
  for (byte i = 0; i < 8; i++) {
    pinMode(leds[i], OUTPUT);
  }
  pinMode(boton, INPUT_PULLUP);
  reiniciar();
}

void loop() {
  revisarBoton();
  unsigned long ahora = millis();
  if (modo < 3) actualizarSecuencia(ahora);
  else actualizarCarga(ahora);
}
