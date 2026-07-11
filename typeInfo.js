// Información de configuración disponible por tipo de accesorio.
// Extraído de la wiki oficial: github.com/RavenSystem/esp-homekit-devices/wiki
// (páginas Service-Types individuales: Switches, Stateless-Button,
// Lock-Mechanism, Sensors, Air-Quality, Water-Valve,
// Temperature-and-Humidity-Sensors, Lightbulb, Garage-Door,
// Window-Covering, Fan, Power-Monitor, HeaterCooler, Security-System).
// Se muestra como referencia junto al selector de tipo; no todos los campos
// listados tienen aún un input dedicado (ver TYPE_FIELD_DEFS en app.js).

const ACCESSORY_TYPE_INFO = {
  1: {
    keys: [
      { k: '"0", "1"', d: "Acciones (Apagado/Encendido)" },
      { k: '"b"', d: "Entradas binarias (botones) que invocan acciones" },
      { k: '"d"', d: "Tiempo máximo encendido" },
      { k: '"s"', d: "Estado inicial al arrancar" },
      { k: '"xa"', d: "Ejecutar acciones al arrancar (activado por defecto)" },
    ],
  },
  20: {
    keys: [
      { k: '"0", "1"', d: "Acciones (Cerrar/Abrir válvula)" },
      { k: '"b"', d: "Entradas binarias (botones)" },
      { k: '"w"', d: "Tipo de válvula: 0 genérica, 1 riego, 2 ducha, 3 grifo" },
      { k: '"d"', d: "Tiempo máximo abierta" },
      { k: '"s"', d: "Estado inicial al arrancar" },
    ],
  },
  3: {
    keys: [
      { k: '"f0"/"f1"/"f2"', d: "Acciones por pulsación simple / doble / larga" },
      { k: '"ks"', d: "Estado de bloqueo al arrancar" },
      { k: '"m"', d: "Notificaciones enviadas a otro servicio" },
    ],
  },
  4: {
    keys: [
      { k: '"0", "1"', d: "Acciones (Desbloquear/Bloquear)" },
      { k: '"i"', d: "Tiempo antes de re-bloquear automáticamente" },
      { k: '"b"', d: "Entradas binarias (botones)" },
      { k: '"ks"', d: "Estado de bloqueo al arrancar" },
    ],
  },
  5: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/Detectado)" }, { k: '"b"', d: "Entradas binarias" }] },
  6: { keys: [{ k: '"0", "1"', d: "Acciones (Vacío/Ocupado)" }, { k: '"b"', d: "Entradas binarias" }] },
  7: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/Fuga detectada)" }, { k: '"b"', d: "Entradas binarias" }] },
  8: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/Humo detectado)" }, { k: '"b"', d: "Entradas binarias" }] },
  9: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/CO detectado)" }, { k: '"b"', d: "Entradas binarias" }] },
  10: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/CO2 detectado)" }, { k: '"b"', d: "Entradas binarias" }] },
  11: { keys: [{ k: '"0", "1"', d: "Acciones (Normal/Cambiar filtro)" }] },
  12: {
    keys: [
      { k: '"0", "1"', d: "Acciones (Sin movimiento/Movimiento detectado)" },
      { k: '"i"', d: "Tiempo antes de volver a 'sin movimiento'" },
      { k: '"b"', d: "Entradas binarias" },
    ],
  },
  13: {
    keys: [
      { k: '"f0"/"f1"/"f2"', d: "Acciones por pulsación simple / doble / larga" },
      { k: '"0"', d: "Acción del timbre (Doorbell)" },
    ],
  },
  15: {
    keys: [
      { k: '"0".."5"', d: "Calidad: 0 Desconocido, 1 Excelente, 2 Bien, 3 Justo, 4 Inferior, 5 Pobre" },
      { k: '"dt"', d: "Datos adicionales (características extra)" },
      { k: '"m"', d: "Notificaciones de otro servicio" },
    ],
  },
  22: {
    keys: [
      { k: '"g"', d: "GPIO del sensor" },
      { k: '"n"', d: "Tipo de sensor: 1 DHT11, 2 DHT22, 3 DS18B20, 4 Si7021, 5 NTC, 6 PTC, 100 interno ESP32-C/S" },
      { k: '"j"', d: "Frecuencia de lectura (s), por defecto 30" },
      { k: '"z"', d: "Corrección de temperatura" },
      { k: '"u"', d: "Índice de sensor (varios DS18B20 en el mismo bus)" },
    ],
  },
  23: {
    keys: [
      { k: '"g"', d: "GPIO del sensor" },
      { k: '"n"', d: "Tipo de sensor (normalmente 2 DHT22)" },
      { k: '"j"', d: "Frecuencia de lectura (s)" },
      { k: '"k"', d: "Corrección de humedad" },
    ],
  },
  24: {
    keys: [
      { k: '"g"', d: "GPIO del sensor" },
      { k: '"n"', d: "Tipo de sensor: 1 DHT11, 2 DHT22, 4 Si7021" },
      { k: '"j"', d: "Frecuencia de lectura (s)" },
      { k: '"z"', d: "Corrección de temperatura" },
      { k: '"k"', d: "Corrección de humedad" },
    ],
  },
  21: {
    keys: [
      { k: '"w"', d: "Tipo: 1 Calefactor, 2 Refrigerador, 3 Ambos, 4 Ambos sin Auto" },
      { k: '"g"/"n"', d: "GPIO y tipo del sensor de temperatura" },
      { k: '"m"/"x"', d: "Temperatura mínima/máxima permitida" },
      { k: '"st"', d: "Incremento de temperatura objetivo" },
      { k: '"d"', d: "Banda muerta / histéresis" },
      { k: '"0".."14", "40".."43"', d: "Acciones según modo/temperatura alcanzada (avanzado, vía IR normalmente)" },
    ],
  },
  25: {
    keys: [
      { k: '"w"', d: "Tipo: 1 Calefactor, 2 Refrigerador, 3 Ambos, 4 Ambos sin Auto" },
      { k: '"g"/"n"', d: "GPIO y tipo del sensor de temperatura/humedad" },
      { k: '"m"/"x"', d: "Temperatura mínima/máxima permitida" },
      { k: '"k"', d: "Corrección de humedad" },
    ],
  },
  30: {
    keys: [
      { k: '"ty"', d: "Tipo de bombilla: Virtual, PWM, PWM dual, NRZ (direccionable)" },
      { k: '"g"', d: "GPIOs de color/canales" },
      { k: '"n"', d: "Número de canales" },
      { k: '"b"', d: "Entradas binarias (botón)" },
      { k: '"fx"', d: "Efectos de iluminación" },
      { k: '"cm"', d: "Orden de colores (para tiras NRZ)" },
    ],
  },
  40: {
    keys: [
      { k: '"d"/"c"', d: "Tiempo de apertura / cierre" },
      { k: '"e"', d: "Tiempo para detectar obstrucción" },
      { k: '"0".."5"', d: "Acciones: cerrar/abrir/invertir dirección/confirmar apertura-cierre" },
      { k: '"vs"', d: "Simula función de parada desde la app Home" },
    ],
  },
  45: {
    keys: [
      { k: '"o"/"c"', d: "Tiempo de apertura / cierre completo" },
      { k: '"f"', d: "Corrección no lineal para el cálculo de posición" },
      { k: '"w"', d: "Tipo de cobertura" },
      { k: '"m"', d: "Margen (%) para sincronizar al abrir/cerrar del todo" },
      { k: '"vs"', d: "Simula función de parada desde la app Home" },
    ],
  },
  65: {
    keys: [
      { k: '"0", "1"', d: "Acciones (Apagado/Encendido)" },
      { k: '"e"', d: "Escalones de velocidad disponibles (1-100)" },
      { k: '"y[n]"', d: "Acción al alcanzar cada escalón de velocidad" },
      { k: '"b"', d: "Entradas binarias (botón)" },
    ],
  },
  75: {
    keys: [
      { k: '"n"', d: "Tipo de chip de medida" },
      { k: '"dt"', d: "Datos de configuración del chip (pines)" },
      { k: '"j"', d: "Período de lectura (s)" },
      { k: '"vf"/"vo"', d: "Factor / desplazamiento de voltaje" },
      { k: '"cf"/"co"', d: "Factor / desplazamiento de corriente" },
      { k: '"pf"/"po"', d: "Factor / desplazamiento de potencia" },
    ],
  },
  55: {
    keys: [
      { k: '"n"', d: "Modos personalizados a usar (array)" },
      { k: '"0".."3"', d: "Acciones por modo: 0 En casa, 1 Ausente, 2 Noche, 3 Desactivado" },
      { k: '"s"', d: "Estado inicial al arrancar" },
    ],
  },
};

const ACCESSORY_TYPE_WIKI_URL = {
  1: "Switches",
  2: "Switches",
  3: "Stateless-Button",
  4: "Lock-Mechanism",
  5: "Sensors",
  6: "Sensors",
  7: "Sensors",
  8: "Sensors",
  9: "Sensors",
  10: "Sensors",
  11: "Sensors",
  12: "Sensors",
  13: "Stateless-Button",
  15: "Air-Quality",
  20: "Water-Valve",
  21: "HeaterCooler",
  22: "Temperature-and-Humidity-Sensors",
  23: "Temperature-and-Humidity-Sensors",
  24: "Temperature-and-Humidity-Sensors",
  25: "HeaterCooler",
  26: "Humidifier",
  27: "Humidifier",
  30: "Lightbulb",
  40: "Garage-Door",
  45: "Window-Covering",
  50: "Light-Sensor",
  55: "Security-System",
  60: "TV-Service",
  65: "Fan",
  70: "Battery",
  75: "Power-Monitor",
  80: "Free-Monitor",
  81: "Free-Monitor",
  95: "Data-History",
  99: "HAA-iAirZoning",
};
