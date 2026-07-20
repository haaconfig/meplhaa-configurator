// Configurador HAA v12 (MEPLHAA) - construido desde cero
// Esquema basado en: wiki oficial RavenSystem/esp-homekit-devices
// (Migration-Guide-for-HAA-V12-Merlin, HAA-Templates, Service-Types).
// Campos con formulario dedicado solo para Switch(1) y Outlet(2); el resto
// de tipos (lista completa de Service-Types) se selecciona por nombre pero
// se configura con el editor "JSON avanzado", para no inventar claves de
// campos que no están verificadas.

const ACCESSORY_TYPES = [
  { id: 1, label: "Interruptor (Switch)", labelEn: "Switch" },
  { id: 2, label: "Enchufe (Outlet)", labelEn: "Outlet" },
  { id: 3, label: "Botón sin estado", labelEn: "Stateless Button" },
  { id: 4, label: "Cerradura", labelEn: "Lock" },
  { id: 5, label: "Sensor de contacto", labelEn: "Contact Sensor" },
  { id: 6, label: "Sensor de ocupación", labelEn: "Occupancy Sensor" },
  { id: 7, label: "Sensor de fugas", labelEn: "Leak Sensor" },
  { id: 8, label: "Sensor de humo", labelEn: "Smoke Sensor" },
  { id: 9, label: "Sensor de monóxido de carbono", labelEn: "Carbon Monoxide Sensor" },
  { id: 10, label: "Sensor de dióxido de carbono", labelEn: "Carbon Dioxide Sensor" },
  { id: 11, label: "Sensor de cambio de filtro", labelEn: "Filter Change Sensor" },
  { id: 12, label: "Sensor de movimiento", labelEn: "Motion Sensor" },
  { id: 13, label: "Botón sin estado + Timbre", labelEn: "Stateless Button + Doorbell" },
  { id: 15, label: "Calidad del aire", labelEn: "Air Quality" },
  { id: 20, label: "Válvula de agua", labelEn: "Water Valve" },
  { id: 21, label: "Calefactor/Refrigerador (HeaterCooler)", labelEn: "Heater/Cooler" },
  { id: 22, label: "Termómetro", labelEn: "Thermometer" },
  { id: 23, label: "Sensor de humedad", labelEn: "Humidity Sensor" },
  { id: 24, label: "Termómetro y sensor de humedad", labelEn: "Thermometer & Humidity Sensor" },
  { id: 25, label: "HeaterCooler con sensor de humedad", labelEn: "HeaterCooler with Humidity Sensor" },
  { id: 26, label: "Humidificador", labelEn: "Humidifier" },
  { id: 27, label: "Humidificador con sensor de temperatura", labelEn: "Humidifier with Temperature Sensor" },
  { id: 30, label: "Bombilla", labelEn: "Lightbulb" },
  { id: 40, label: "Puerta de garaje", labelEn: "Garage Door" },
  { id: 45, label: "Toldo/Persiana (Window Covering)", labelEn: "Window Covering" },
  { id: 50, label: "Sensor de luz", labelEn: "Light Sensor" },
  { id: 55, label: "Sistema de seguridad", labelEn: "Security System" },
  { id: 60, label: "Televisor", labelEn: "TV" },
  { id: 65, label: "Ventilador", labelEn: "Fan" },
  { id: 70, label: "Batería", labelEn: "Battery" },
  { id: 75, label: "Medidor de potencia", labelEn: "Power Monitor" },
  { id: 80, label: "Monitor libre (Free Monitor)", labelEn: "Free Monitor" },
  { id: 81, label: "Monitor libre acumulativo", labelEn: "Free Monitor Accumulative" },
  { id: 95, label: "Historial de datos", labelEn: "Data History" },
  { id: 99, label: "HAA iAirZoning", labelEn: "HAA iAirZoning" },
];

function typeLabel(id) {
  const x = ACCESSORY_TYPES.find((a) => a.id === Number(id));
  if (!x) return null;
  return currentLang === "en" ? x.labelEn : x.label;
}

// Campos dedicados para tipos de accesorio con patrón verificado en
// dispositivos reales (RavenSystem Devices-Database). El resto de tipos
// (Sensores binarios, Puerta de garaje, Toldo, Ventilador, Medidor de
// potencia, Termostato, Sistema de seguridad...) usan el editor "JSON
// avanzado" porque tienen esquemas más complejos que no están confirmados
// con suficiente detalle como para construir un formulario fiable.
const TYPE_FIELD_DEFS = {
  3: [{ key: "gpio", label: "GPIO del botón", labelEn: "Button GPIO", type: "number" }],
  4: [
    { key: "gpio", label: "GPIO del relé (cerradura)", labelEn: "Relay GPIO (lock)", type: "number" },
    { key: "autoRelock", label: "Auto-cierre tras (segundos, opcional)", labelEn: "Auto-relock after (seconds, optional)", type: "number" },
  ],
  20: [{ key: "gpio", label: "GPIO de la válvula", labelEn: "Valve GPIO", type: "number" }],
  22: [
    { key: "gpio", label: "GPIO del sensor", labelEn: "Sensor GPIO", type: "number" },
    {
      key: "sensorType",
      label: "Tipo de sensor",
      labelEn: "Sensor type",
      type: "select",
      options: [
        { value: 2, label: "DHT22" },
        { value: 3, label: "DS18B20" },
      ],
    },
  ],
  23: [
    { key: "gpio", label: "GPIO del sensor", labelEn: "Sensor GPIO", type: "number" },
    { key: "sensorType", label: "Tipo de sensor", labelEn: "Sensor type", type: "select", options: [{ value: 2, label: "DHT22" }] },
  ],
  24: [
    { key: "gpio", label: "GPIO del sensor", labelEn: "Sensor GPIO", type: "number" },
    { key: "sensorType", label: "Tipo de sensor", labelEn: "Sensor type", type: "select", options: [{ value: 2, label: "DHT22" }] },
  ],
  30: [
    {
      key: "gpios",
      label: "GPIOs PWM (coma)",
      labelEn: "PWM GPIOs (comma)",
      type: "text",
      hint: "ej: 12,13,14 (canales R,G,B o blanco/cálido)",
      hintEn: "e.g.: 12,13,14 (R,G,B or white/warm channels)",
    },
  ],
};

function tfLabel(f) {
  return currentLang === "en" ? f.labelEn : f.label;
}
function tfHint(f) {
  return currentLang === "en" ? f.hintEn || f.hint || "" : f.hint || "";
}

function buildTypeFields(acc) {
  const t = Number(acc.t);
  const d = acc.typeData || {};
  const extra = {};
  const hasGpio = d.gpio !== undefined && d.gpio !== "" && !Number.isNaN(Number(d.gpio));
  if (t === 3 && hasGpio) {
    const g = Number(d.gpio);
    extra.f0 = [[g]];
    extra.f1 = [[g, 2]];
    extra.f2 = [[g, 3]];
  } else if (t === 4 && hasGpio) {
    const g = Number(d.gpio);
    extra["1"] = { r: [[g]] };
    extra["0"] = { r: [[g, 1, 1]] };
    if (d.autoRelock !== undefined && d.autoRelock !== "") extra.i = Number(d.autoRelock);
  } else if (t === 20 && hasGpio) {
    const g = Number(d.gpio);
    extra.w = 1;
    extra["0"] = { r: [[g]] };
    extra["1"] = { r: [[g, 1]] };
  } else if (t === 22 || t === 23 || t === 24) {
    if (hasGpio) extra.g = Number(d.gpio);
    if (d.sensorType !== undefined && d.sensorType !== "") extra.n = Number(d.sensorType);
  } else if (t === 30) {
    const gpios = parseGpioList(d.gpios);
    if (gpios.length) extra.g = gpios;
  }
  return extra;
}

function parseTypeFields(t, accObj) {
  const rest = { ...accObj };
  const data = {};
  if (t === 3) {
    if (rest.f0 && rest.f0[0]) {
      data.gpio = rest.f0[0][0];
      delete rest.f0;
      delete rest.f1;
      delete rest.f2;
    }
  } else if (t === 4) {
    if (rest["1"] && rest["1"].r && rest["1"].r[0]) {
      data.gpio = rest["1"].r[0][0];
      delete rest["1"];
      delete rest["0"];
      if (rest.i !== undefined) {
        data.autoRelock = rest.i;
        delete rest.i;
      }
    }
  } else if (t === 20) {
    if (rest["1"] && rest["1"].r && rest["1"].r[0]) {
      data.gpio = rest["1"].r[0][0];
      delete rest["1"];
      delete rest["0"];
      delete rest.w;
    }
  } else if (t === 22 || t === 23 || t === 24) {
    if (rest.g !== undefined) {
      data.gpio = rest.g;
      delete rest.g;
    }
    if (rest.n !== undefined) {
      data.sensorType = rest.n;
      delete rest.n;
    }
  } else if (t === 30) {
    if (rest.g !== undefined) {
      data.gpios = (rest.g || []).join(", ");
      delete rest.g;
    }
  }
  return { data, rest };
}

// Convierte un objeto de accesorio del JSON MEPLHAA (formato "a": [...]) al
// modelo de estado interno del formulario. Se reutiliza tanto al cargar un
// dispositivo/JSON completo como al desagrupar servicios extra ("es") en
// accesorios independientes.
function accessoryObjectToState(acc) {
  const t = acc.t !== undefined ? acc.t : 1;
  const known = t === 1 || t === 2;
  const buttons = (acc.b || []).map((b) => ({ gpio: b[0], type: b[1] !== undefined ? b[1] : 1 }));
  let relayGpio = null;
  if (known && acc["1"] && Array.isArray(acc["1"].r) && acc["1"].r.length) {
    relayGpio = acc["1"].r[0][0];
  }
  // Comprueba si "0"/"1" son EXACTAMENTE el patrón simple de un relé único
  // (el que genera el formulario). Si el dispositivo real es más complejo
  // (multi-relé, servicios "es", etc.), se conserva todo en rawExtra para
  // no perder nada al regenerar el JSON.
  const simplePattern =
    known &&
    relayGpio !== null &&
    JSON.stringify(acc["0"]) === JSON.stringify({ r: [[relayGpio, 0]] }) &&
    JSON.stringify(acc["1"]) === JSON.stringify({ r: [[relayGpio, 1]] });
  let rawExtra = "";
  const rest = { ...acc };
  delete rest.t;
  delete rest.nm;
  delete rest.b;
  if (simplePattern) {
    delete rest["0"];
    delete rest["1"];
  }
  const { data: typeData, rest: restAfterType } = parseTypeFields(t, rest);
  if (Object.keys(restAfterType).length) rawExtra = JSON.stringify(restAfterType, null, 2);
  return {
    id: nextId(),
    t,
    custom: !known && !TYPE_FIELD_DEFS[t],
    nm: acc.nm || "",
    relayGpio,
    buttons,
    typeData,
    rawExtra,
  };
}

// Tabla de modos y pull-up/down según la wiki oficial ("Configuración de GPIO")
const MODE_LABELS = {
  es: {
    0: "0 - Deshabilitar",
    1: "1 - Entrada",
    2: "2 - Salida",
    3: "3 - Salida (drenaje abierto)",
    4: "4 - Entrada y salida (drenaje abierto)",
    5: "5 - Salida y entrada",
    6: "6 - Entrada binaria (botón/interruptor)",
    7: "7 - PWM software (salida)",
    8: "8 - PWM software (drenaje abierto)",
    9: "9 - PWM hardware (salida)",
    10: "10 - Entrada ADC",
  },
  en: {
    0: "0 - Disable",
    1: "1 - Input",
    2: "2 - Output",
    3: "3 - Output (open drain)",
    4: "4 - Input and output (open drain)",
    5: "5 - Output and input",
    6: "6 - Binary input (button/switch)",
    7: "7 - Software PWM (output)",
    8: "8 - Software PWM (open drain)",
    9: "9 - Hardware PWM (output)",
    10: "10 - ADC input",
  },
};

const PULL_LABELS = {
  es: {
    "-2": "-2 - Sin config. (según el SoC)",
    "-1": "-1 - Flotante + filtro de fallas",
    "0": "0 - Flotante (predeterminado)",
    "1": "1 - Pull-up interna",
    "2": "2 - Pull-down interna",
    "10": "10 - Flotante + filtro de fallas",
    "11": "11 - Pull-up + filtro de fallas",
    "12": "12 - Pull-down + filtro de fallas",
  },
  en: {
    "-2": "-2 - No config (depends on SoC)",
    "-1": "-1 - Floating + glitch filter",
    "0": "0 - Floating (default)",
    "1": "1 - Internal pull-up",
    "2": "2 - Internal pull-down",
    "10": "10 - Floating + glitch filter",
    "11": "11 - Pull-up + glitch filter",
    "12": "12 - Pull-down + glitch filter",
  },
};

const OUTPUT_MODES = [2, 3, 4, 5, 7, 8, 9];
const INPUT_MODES = [0, 1, 6];

// Parámetros que van DESPUÉS del pull-up/down en el array "io"
const PARAM_HINTS = {
  es: {
    0: "",
    1: "",
    2: "valorInicial (0=BAJO, 1=ALTO)",
    3: "valorInicial (0=BAJO, 1=ALTO)",
    4: "valorInicial (0=BAJO, 1=ALTO)",
    5: "valorInicial (0=BAJO, 1=ALTO)",
    6: "modoBoton, filtro, pulsoMaxUs",
    7: "valorInicial, modoPWM, dithering",
    8: "valorInicial, modoPWM, dithering",
    9: "valorInicial, modoPWM, timer",
    10: "atenuación (0-3)",
  },
  en: {
    0: "",
    1: "",
    2: "initialValue (0=LOW, 1=HIGH)",
    3: "initialValue (0=LOW, 1=HIGH)",
    4: "initialValue (0=LOW, 1=HIGH)",
    5: "initialValue (0=LOW, 1=HIGH)",
    6: "buttonMode, filter, maxPulseUs",
    7: "initialValue, pwmMode, dithering",
    8: "initialValue, pwmMode, dithering",
    9: "initialValue, pwmMode, timer",
    10: "attenuation (0-3)",
  },
};

function modeLabels() {
  return MODE_LABELS[currentLang] || MODE_LABELS.es;
}
function pullLabels() {
  return PULL_LABELS[currentLang] || PULL_LABELS.es;
}
function paramHint(mode) {
  return (PARAM_HINTS[currentLang] || PARAM_HINTS.es)[mode] || "";
}

let uid = 1;
const nextId = () => uid++;

const state = {
  general: {
    hostname: "",
    log: 0,
    ledGpio: null,
    ledInvert: true,
    setupButtons: "",
    rawExtra: "",
    deviceHint: null, // { source: "detected"|"declared", category, model, example? }
  },
  io: [],
  accessories: [{ id: nextId(), t: 1, custom: false, nm: "", relayGpio: null, buttons: [], typeData: {}, rawExtra: "" }],
};

function parseGpioList(str) {
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
}

function parseParamsList(str) {
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
}

function parseButtonPairs(str) {
  return String(str)
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [gpio, type] = pair.split(":").map((s) => s.trim());
      return [Number(gpio), type !== undefined && type !== "" ? Number(type) : 1];
    })
    .filter(([gpio]) => !Number.isNaN(gpio));
}

function declaredGpios(modes) {
  const set = new Set();
  state.io.forEach((g) => {
    if (modes.includes(Number(g.mode))) {
      parseGpioList(g.gpios).forEach((gpio) => set.add(gpio));
    }
  });
  return set;
}

function buildConfig() {
  const c = {};
  const io = state.io
    .map((g) => {
      const gpios = parseGpioList(g.gpios);
      if (!gpios.length) return null;
      const extra = parseParamsList(g.params);
      const pull = Number(g.pull) || 0;
      const parts = [gpios, Number(g.mode)];
      // El pull-up/down solo se escribe si no es el valor por defecto (0), o si
      // hacen falta parámetros posteriores (el array es posicional: para llegar
      // al 4º hueco hay que rellenar el 3º aunque sea con el valor por defecto).
      if (pull !== 0 || extra.length > 0) {
        parts.push(pull);
        if (extra.length > 0) parts.push(...extra);
      }
      return parts;
    })
    .filter(Boolean);
  if (io.length) c.io = io;

  if (state.general.hostname.trim()) c.n = state.general.hostname.trim();
  if (Number(state.general.log) !== 0) c.o = Number(state.general.log);
  if (state.general.ledGpio !== null && state.general.ledGpio !== "") {
    c.l = Number(state.general.ledGpio);
    c.i = state.general.ledInvert ? 1 : 0;
  }
  const setupButtons = parseButtonPairs(state.general.setupButtons);
  if (setupButtons.length) c.b = setupButtons;
  if (state.general.rawExtra && state.general.rawExtra.trim()) {
    try {
      Object.assign(c, JSON.parse(state.general.rawExtra));
    } catch (e) {
      // se ignora si no es JSON válido; se avisa en validate()
    }
  }

  const a = state.accessories.map((acc) => {
    const obj = { t: Number(acc.t) };
    if (acc.nm.trim()) obj.nm = acc.nm.trim();
    if (acc.buttons.length) {
      obj.b = acc.buttons
        .filter((b) => b.gpio !== null && b.gpio !== "")
        .map((b) => [Number(b.gpio), Number(b.type)]);
    }
    let extra = buildTypeFields(acc);
    if (acc.rawExtra && acc.rawExtra.trim()) {
      try {
        Object.assign(extra, JSON.parse(acc.rawExtra));
      } catch (e) {
        // se ignora si no es JSON válido; se avisa en validate()
      }
    }
    const extraHasActions = Object.prototype.hasOwnProperty.call(extra, "0") || Object.prototype.hasOwnProperty.call(extra, "1");
    if (
      !extraHasActions &&
      (Number(acc.t) === 1 || Number(acc.t) === 2) &&
      acc.relayGpio !== null &&
      acc.relayGpio !== ""
    ) {
      obj["0"] = { r: [[Number(acc.relayGpio), 0]] };
      obj["1"] = { r: [[Number(acc.relayGpio), 1]] };
    }
    Object.assign(obj, extra);
    return obj;
  });

  return { c, a };
}

function validate() {
  const warnings = [];
  const outputs = declaredGpios(OUTPUT_MODES);
  const inputs = declaredGpios(INPUT_MODES);
  const notOutput =
    currentLang === "en" ? (g) => `GPIO ${g} is not declared as Output in "io".` : (g) => `El GPIO ${g} no está declarado como Salida en "io".`;
  const notInput =
    currentLang === "en"
      ? (g) => `GPIO ${g} is not declared as Binary Input (mode 6) in "io".`
      : (g) => `El GPIO ${g} no está declarado como Entrada binaria (modo 6) en "io".`;

  if (state.general.ledGpio !== null && state.general.ledGpio !== "") {
    if (!outputs.has(Number(state.general.ledGpio))) {
      warnings.push(currentLang === "en" ? `LED ${notOutput(state.general.ledGpio)}` : `LED: ${notOutput(state.general.ledGpio)}`);
    }
  }

  state.accessories.forEach((acc, idx) => {
    const label = acc.nm.trim() || (currentLang === "en" ? `Accessory #${idx + 1}` : `Accesorio #${idx + 1}`);
    if (acc.relayGpio !== null && acc.relayGpio !== "" && !outputs.has(Number(acc.relayGpio))) {
      warnings.push(`${label}: ${notOutput(acc.relayGpio)}`);
    }
    acc.buttons.forEach((b) => {
      if (b.gpio !== null && b.gpio !== "" && !inputs.has(Number(b.gpio))) {
        warnings.push(`${label}: ${notInput(b.gpio)}`);
      }
    });
    const td = acc.typeData || {};
    const t = Number(acc.t);
    if (td.gpio !== undefined && td.gpio !== "") {
      const g = Number(td.gpio);
      if (t === 3 && !inputs.has(g)) {
        warnings.push(`${label}: ${notInput(g)}`);
      }
      if ((t === 4 || t === 20) && !outputs.has(g)) {
        warnings.push(`${label}: ${notOutput(g)}`);
      }
    }
    if (acc.rawExtra && acc.rawExtra.trim()) {
      try {
        JSON.parse(acc.rawExtra);
      } catch (e) {
        warnings.push(
          currentLang === "en" ? `${label}: the advanced JSON is invalid (${e.message}).` : `${label}: el JSON avanzado no es válido (${e.message}).`
        );
      }
    }
  });

  return warnings;
}

let hideDefaults = false;
let oneLine = true;

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    // Preserva elementos hijos (como <span class="hint">) reemplazando solo
    // el primer nodo de texto, ya que varios labels llevan hints anidados.
    const firstTextNode = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (firstTextNode) {
      firstTextNode.textContent = t(key) + " ";
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.getElementById("lang-es").classList.toggle("active", currentLang === "es");
  document.getElementById("lang-en").classList.toggle("active", currentLang === "en");
}

// Al cambiar de idioma, el texto visible de las opciones del selector de
// dispositivos (categoría/modelo/ejemplo) hay que regenerarlo — pero sin
// perder lo que el usuario ya tenía elegido, así que se guarda y se
// restaura la selección alrededor de repoblar los desplegables.
function refreshDevicePickerLabels() {
  const categorySelect = document.getElementById("device-category");
  const modelSelect = document.getElementById("device-model");
  const exampleSelect = document.getElementById("device-example");
  if (!categorySelect || typeof DEVICE_CATALOG === "undefined") return;
  const prevCategory = categorySelect.value;
  const prevModel = modelSelect.value;
  const prevExample = exampleSelect.value;
  populateDevicePicker();
  if ([...categorySelect.options].some((o) => o.value === prevCategory)) {
    categorySelect.value = prevCategory;
    populateModelSelect();
    if ([...modelSelect.options].some((o) => o.value === prevModel)) {
      modelSelect.value = prevModel;
      populateExampleSelect();
      if ([...exampleSelect.options].some((o) => o.value === prevExample)) {
        exampleSelect.value = prevExample;
        updateDeviceDescription();
      }
    }
  }
}

function setLanguage(lang) {
  currentLang = lang;
  applyStaticTranslations();
  document.getElementById("btn-simplify").textContent = hideDefaults ? t("showDefaultsBtn") : t("hideDefaultsBtn");
  document.getElementById("btn-oneline").textContent = oneLine ? t("multiLineBtn") : t("oneLineBtn");
  refreshDevicePickerLabels();
  render();
  renderWizard();
  renderSavedList();
}

document.getElementById("lang-es").addEventListener("click", () => setLanguage("es"));
document.getElementById("lang-en").addEventListener("click", () => setLanguage("en"));

function render() {
  renderIoList();
  renderAccessoryList();
  document.getElementById("gen-hostname").value = state.general.hostname;
  document.getElementById("gen-log").value = state.general.log;
  document.getElementById("gen-led-gpio").value = state.general.ledGpio ?? "";
  document.getElementById("gen-led-invert").checked = state.general.ledInvert;
  document.getElementById("gen-setup-buttons").value = state.general.setupButtons;
  document.getElementById("gen-raw-extra").value = state.general.rawExtra;
  renderDeviceHint("device-hint-box");
  renderJson();
}

// Detecta para qué se usa un GPIO (relé, LED, botón) cruzando los
// accesorios ya configurados, para mostrarlo como pista junto a la fila
// correspondiente en "GPIOs (io)".
// Recorre recursivamente cualquier fragmento de JSON (incluidos servicios
// extra "es" anidados a cualquier profundidad) recolectando qué GPIOs se
// usan como relé/salida ("r") y cuáles como botón/entrada ("b"/"f[n]"),
// para no perder ninguno aunque estén enterrados dentro de un accesorio
// con múltiples servicios agrupados.
function collectGpioRolesFrom(node, relaySet, buttonSet) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectGpioRolesFrom(item, relaySet, buttonSet));
    return;
  }
  if (typeof node !== "object" || node === null) return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "r" && Array.isArray(value)) {
      value.forEach((entry) => {
        if (Array.isArray(entry) && entry.length) relaySet.add(Number(entry[0]));
      });
    } else if ((key === "b" || /^f\d$/.test(key)) && Array.isArray(value)) {
      value.forEach((entry) => {
        if (Array.isArray(entry) && entry.length) buttonSet.add(Number(entry[0]));
      });
    } else {
      collectGpioRolesFrom(value, relaySet, buttonSet);
    }
  }
}

function gpioRoleLabel(gpio) {
  if (gpio === null || gpio === "" || Number.isNaN(Number(gpio))) return null;
  gpio = Number(gpio);
  if (state.general.ledGpio !== null && state.general.ledGpio !== "" && Number(state.general.ledGpio) === gpio) {
    return t("roleLed");
  }
  const relaySet = new Set();
  const buttonSet = new Set();
  for (const acc of state.accessories) {
    const tAcc = Number(acc.t);
    if ((tAcc === 1 || tAcc === 2) && acc.relayGpio !== null && acc.relayGpio !== "") {
      relaySet.add(Number(acc.relayGpio));
    }
    const td = acc.typeData || {};
    if ((tAcc === 4 || tAcc === 20) && td.gpio !== undefined && td.gpio !== "") {
      relaySet.add(Number(td.gpio));
    }
    if (tAcc === 3 && td.gpio !== undefined && td.gpio !== "") {
      buttonSet.add(Number(td.gpio));
    }
    acc.buttons.forEach((b) => {
      if (b.gpio !== null && b.gpio !== "") buttonSet.add(Number(b.gpio));
    });
    if (acc.rawExtra && acc.rawExtra.trim()) {
      try {
        const extra = JSON.parse(acc.rawExtra);
        collectGpioRolesFrom(extra, relaySet, buttonSet);
      } catch (e) {
        // JSON inválido, se ignora aquí (ya se avisa en validate())
      }
    }
  }
  const setupBtns = parseButtonPairs(state.general.setupButtons);
  setupBtns.forEach(([g]) => buttonSet.add(g));

  if (relaySet.has(gpio)) return t("roleRelay");
  if (buttonSet.has(gpio)) return t("roleButton");
  return null;
}

// Resumen legible de los GPIOs del dispositivo cargado, para mostrarlo en el
// asistente (que antes no enseñaba los GPIOs "de un vistazo" como el avanzado).
function wizardGpioSummaryHTML() {
  if (!state.io || !state.io.length) return "";
  const ml = modeLabels();
  const items = state.io
    .map((group) => {
      if (!group.gpios || !String(group.gpios).trim()) return "";
      const first = parseGpioList(group.gpios)[0];
      const role = gpioRoleLabel(first);
      const modeLabel = ml[Number(group.mode)] || `modo ${group.mode}`;
      const roleTag = role ? ` — <strong>${role}</strong>` : "";
      return `<li><code>GPIO ${escapeHtmlSaved(String(group.gpios))}</code> · ${modeLabel}${roleTag}</li>`;
    })
    .filter(Boolean)
    .join("");
  if (!items) return "";
  const title = currentLang === "en" ? "GPIOs this device uses:" : "GPIOs que usa este dispositivo:";
  return `<div class="wiz-gpio-summary"><p class="hint">📌 ${title}</p><ul>${items}</ul></div>`;
}

function renderIoList() {
  const container = document.getElementById("io-list");
  container.innerHTML = "";
  state.io.forEach((group) => {
    const div = document.createElement("div");
    div.className = "io-group";
    const roleLabel = gpioRoleLabel(parseGpioList(group.gpios)[0]);
    div.innerHTML = `
      <div class="io-group-row">
        <label>${t("gpiosLabel")} ${roleLabel ? `<span class="io-role-tag">${roleLabel}</span>` : ""}
          <input type="text" data-field="gpios" value="${group.gpios}" placeholder="ej: 12, 13">
        </label>
        <label>${t("modeLabel")}
          <select data-field="mode">
            ${Object.entries(modeLabels())
              .map(([v, l]) => `<option value="${v}" ${Number(group.mode) === Number(v) ? "selected" : ""}>${l}</option>`)
              .join("")}
          </select>
        </label>
        <label>${t("pullLabel")}
          <select data-field="pull">
            ${Object.entries(pullLabels())
              .map(([v, l]) => `<option value="${v}" ${String(group.pull ?? 0) === v ? "selected" : ""}>${l}</option>`)
              .join("")}
          </select>
        </label>
        <label>${t("paramsLabel")} <span class="hint">(${paramHint(group.mode)})</span>
          <input type="text" data-field="params" value="${group.params}" placeholder="ej: 1">
        </label>
        <button class="remove-btn" data-action="remove-io">${t("removeBtn")}</button>
      </div>
    `;
    div.querySelectorAll("[data-field]").forEach((el) => {
      el.addEventListener("input", (e) => {
        group[e.target.dataset.field] = e.target.value;
        renderJson();
      });
    });
    div.querySelector('[data-action="remove-io"]').addEventListener("click", () => {
      state.io = state.io.filter((g) => g.id !== group.id);
      render();
    });
    container.appendChild(div);
  });
}

function renderTypeInfoHTML(ty) {
  if (typeof ACCESSORY_TYPE_INFO === "undefined") return "";
  const info = ACCESSORY_TYPE_INFO[Number(ty)];
  const wikiSlug = ACCESSORY_TYPE_WIKI_URL[Number(ty)];
  const wikiLink = wikiSlug ? `https://github.com/RavenSystem/esp-homekit-devices/wiki/${wikiSlug}` : null;
  const body = info
    ? `<table class="type-info-table">
         <thead><tr><th>${t("typeInfoKeyCol")}</th><th>${t("typeInfoDescCol")}</th></tr></thead>
         <tbody>${info.keys.map((row) => `<tr><td><code>${row.k}</code></td><td>${row.d}</td></tr>`).join("")}</tbody>
       </table>`
    : `<p class="hint">${t("typeInfoNoData")}</p>`;
  return `
    <details class="type-info">
      <summary>${t("typeInfoSummary")}</summary>
      ${body}
      ${wikiLink ? `<p class="hint">${t("typeInfoSource")}: <a href="${wikiLink}" target="_blank" rel="noopener">wiki HAA — ${wikiSlug}</a></p>` : ""}
    </details>
  `;
}

function extraServicesCount(acc) {
  if (!acc.rawExtra || !acc.rawExtra.trim()) return 0;
  try {
    const parsed = JSON.parse(acc.rawExtra);
    return Array.isArray(parsed.es) ? parsed.es.length : 0;
  } catch (e) {
    return 0;
  }
}

// Si un accesorio agrupa servicios extra ("es"), los separa en accesorios
// independientes editables. Devuelve un array (el propio accesorio si no
// tenía "es", o [accesorio, ...nuevos] si se han extraído). No muta nada
// fuera del objeto que recibe ni llama a render(), para poder reutilizarse
// tanto al cargar un JSON completo como desde el botón manual.
function expandAccessoryEs(accState) {
  if (!accState.rawExtra || !accState.rawExtra.trim()) return [accState];
  let parsed;
  try {
    parsed = JSON.parse(accState.rawExtra);
  } catch (e) {
    return [accState];
  }
  const esList = Array.isArray(parsed.es) ? parsed.es : [];
  if (!esList.length) return [accState];
  const rest = { ...parsed };
  delete rest.es;
  accState.rawExtra = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : "";
  return [accState, ...esList.map((sub) => accessoryObjectToState(sub))];
}

function splitExtraServices(accId) {
  const idx = state.accessories.findIndex((a) => a.id === accId);
  if (idx === -1) return;
  const expanded = expandAccessoryEs(state.accessories[idx]);
  if (expanded.length < 2) return;
  state.accessories.splice(idx, 1, ...expanded);
  render();
}

function renderAccessoryList() {
  const container = document.getElementById("accessory-list");
  container.innerHTML = "";
  state.accessories.forEach((acc, idx) => {
    const friendly = Number(acc.t) === 1 || Number(acc.t) === 2;
    const inCatalog = ACCESSORY_TYPES.some((x) => x.id === Number(acc.t));
    const typeFieldDefs = TYPE_FIELD_DEFS[Number(acc.t)] || null;
    const esCount = extraServicesCount(acc);
    const div = document.createElement("div");
    div.className = "accessory-item";
    const typeInfo = ACCESSORY_TYPES.find((x) => x.id === Number(acc.t));
    const typeLabelText = typeInfo ? `${acc.t} - ${currentLang === "en" ? typeInfo.labelEn : typeInfo.label}` : `${t("manualTypeOption")} (${acc.t})`;
    div.innerHTML = `
      <h3 class="accessory-heading">${t("wizAccessoryLabel")} #${idx + 1} — ${typeLabelText}</h3>
      <div class="accessory-row">
        <label>${t("typeLabel")}
          <select data-field="t">
            ${ACCESSORY_TYPES.map(
              (x) => `<option value="${x.id}" ${Number(acc.t) === x.id ? "selected" : ""}>${x.id} - ${currentLang === "en" ? x.labelEn : x.label}</option>`
            ).join("")}
            <option value="manual" ${!inCatalog ? "selected" : ""}>${t("manualTypeOption")}</option>
          </select>
        </label>
        <label>${t("nameLabel")}
          <input type="text" data-field="nm" value="${acc.nm}" placeholder="${t("namePlaceholder")}">
        </label>
        ${
          friendly
            ? `<label>${t("relayGpioLabel")}
                 <input type="number" data-field="relayGpio" value="${acc.relayGpio ?? ""}" placeholder="ej: 12">
               </label>`
            : !inCatalog
            ? `<label>${t("numericTypeLabel")}
                 <input type="number" data-field="tCustom" value="${acc.t}" placeholder="ej: 100">
               </label>`
            : ""
        }
        <button class="remove-btn" data-action="remove-acc">${t("removeBtn")}</button>
      </div>
      ${renderTypeInfoHTML(acc.t)}
      ${
        typeFieldDefs
          ? `<div class="accessory-row" style="margin-top:10px">
               ${typeFieldDefs
                 .map((f) => {
                   const val = acc.typeData && acc.typeData[f.key] !== undefined ? acc.typeData[f.key] : "";
                   if (f.type === "select") {
                     return `<label>${tfLabel(f)}
                         <select data-typefield="${f.key}">
                           <option value="" ${val === "" ? "selected" : ""}>—</option>
                           ${f.options.map((o) => `<option value="${o.value}" ${String(val) === String(o.value) ? "selected" : ""}>${o.label}</option>`).join("")}
                         </select>
                       </label>`;
                   }
                   return `<label>${tfLabel(f)} ${tfHint(f) ? `<span class="hint">${tfHint(f)}</span>` : ""}
                       <input type="${f.type}" data-typefield="${f.key}" value="${val}">
                     </label>`;
                 })
                 .join("")}
             </div>`
          : ""
      }
      <label style="margin-top:10px">${t("buttonsLabel")} <span class="hint">ej: 0:1, 14:1</span>
        <input type="text" data-field="buttons" value="${acc.buttons.map((b) => `${b.gpio}:${b.type}`).join(", ")}">
      </label>
      ${
        !friendly || (acc.rawExtra && acc.rawExtra.trim())
          ? `<label style="margin-top:10px">${t("rawExtraLabel")}${
              friendly
                ? ` <span class="hint">${t("rawExtraFriendlyHint")}</span>`
                : typeFieldDefs
                ? ` <span class="hint">${t("rawExtraTypeFieldsHint")}</span>`
                : ` <span class="hint">${t("rawExtraGenericHint")}</span>`
            }
               <textarea data-field="rawExtra" placeholder='{"0":{"r":[[12,0]]},"1":{"r":[[12,1]]}}'>${acc.rawExtra}</textarea>
             </label>`
          : ""
      }
      ${
        esCount > 0
          ? `<div class="split-es-box">
               <p class="hint">${t("splitEsHint").replace("{n}", esCount)}</p>
               <button class="btn-secondary" data-action="split-es">${t("splitEsBtn")}</button>
             </div>`
          : ""
      }
    `;
    div.querySelectorAll("[data-typefield]").forEach((el) => {
      const handler = (e) => {
        if (!acc.typeData) acc.typeData = {};
        acc.typeData[e.target.dataset.typefield] = e.target.value;
        renderJson();
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
    div.querySelectorAll("[data-field]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const field = e.target.dataset.field;
        if (field === "t") {
          if (e.target.value === "manual") {
            acc.t = inCatalog ? 100 : acc.t;
          } else {
            acc.t = Number(e.target.value);
          }
          render();
          return;
        }
        if (field === "tCustom") {
          acc.t = Number(e.target.value);
          renderJson();
          return;
        }
        if (field === "buttons") {
          acc.buttons = e.target.value
            .split(",")
            .map((pair) => pair.trim())
            .filter(Boolean)
            .map((pair) => {
              const [gpio, type] = pair.split(":").map((s) => s.trim());
              return { gpio: gpio ?? null, type: type ?? 1 };
            });
          renderJson();
          return;
        }
        acc[field] = e.target.value;
        renderJson();
      });
    });
    div.querySelector('[data-action="remove-acc"]').addEventListener("click", () => {
      state.accessories = state.accessories.filter((a) => a.id !== acc.id);
      render();
    });
    const splitBtn = div.querySelector('[data-action="split-es"]');
    if (splitBtn) {
      splitBtn.addEventListener("click", () => splitExtraServices(acc.id));
    }
    container.appendChild(div);
  });
}

function stripDefaults(config) {
  // elimina claves con valores por defecto conocidos para una salida más compacta
  const clone = JSON.parse(JSON.stringify(config));
  if (clone.c && clone.c.i === 1) delete clone.c.i;
  return clone;
}

function renderJson() {
  const config = buildConfig();
  const output = hideDefaults ? stripDefaults(config) : config;
  document.getElementById("json-output").textContent = oneLine ? JSON.stringify(output) : JSON.stringify(output, null, 2);

  const warnings = validate();
  const warningsEl = document.getElementById("warnings");
  warningsEl.innerHTML = warnings.map((w) => `<div class="warning-item">⚠ ${w}</div>`).join("");
}

// Recorre el texto (ignorando el contenido de las cadenas) llevando una pila
// de "{"/"[" abiertos, para saber exactamente qué apertura falta al principio
// (cierres sin pareja) y qué cierre falta al final (aperturas sin pareja) —
// en vez de solo mirar el primer y último carácter, que no detecta casos
// como "termina en } pero le faltan ]} de otro nivel más arriba".
function analyzeBrackets(text) {
  const stack = [];
  const missingOpens = [];
  let inString = false;
  let escape = false;
  for (const ch of text) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      if (inString) escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{" || ch === "[") {
      stack.push(ch);
    } else if (ch === "}" || ch === "]") {
      const top = stack[stack.length - 1];
      if ((ch === "}" && top === "{") || (ch === "]" && top === "[")) {
        stack.pop();
      } else {
        missingOpens.push(ch === "}" ? "{" : "[");
      }
    }
  }
  const prefix = missingOpens.join("");
  const suffix = stack.map((open) => (open === "{" ? "}" : "]")).reverse().join("");
  return { prefix, suffix };
}

function tryRepairJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const stripTrailingCommas = (s) => s.replace(/,(\s*[}\]])/g, "$1");
  const { prefix, suffix } = analyzeBrackets(trimmed);
  const needsWrap = prefix || suffix;
  const wrapped = prefix + trimmed + suffix;
  const candidates = [];
  if (needsWrap) candidates.push(wrapped);
  candidates.push(stripTrailingCommas(trimmed));
  if (needsWrap) candidates.push(stripTrailingCommas(wrapped));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && ("c" in parsed || "a" in parsed)) {
        return { fixed: JSON.stringify(parsed, null, 2), parsed };
      }
    } catch (e) {
      // sigue probando el siguiente candidato
    }
  }
  return null;
}

// Páginas de la wiki de RavenSystem con fotos/pinout por fabricante
// (Devices-Database es el fallback general si no hay página específica).
const CATEGORY_WIKI_URL = {
  Shelly: "https://github.com/RavenSystem/esp-homekit-devices/wiki/Shelly-Devices",
  Sonoff: "https://github.com/RavenSystem/esp-homekit-devices/wiki/Sonoff-Devices",
  Otros: "https://github.com/RavenSystem/esp-homekit-devices/wiki/Other-Devices",
};

// Quita los campos de texto libre (nombres) que no forman parte de la
// identidad real del dispositivo, para poder comparar configuraciones
// ignorando cómo las haya llamado cada usuario.
function stripFreeTextFields(obj) {
  if (Array.isArray(obj)) return obj.map(stripFreeTextFields);
  if (obj && typeof obj === "object") {
    const copy = {};
    for (const k of Object.keys(obj)) {
      if (k === "nm") continue;
      copy[k] = stripFreeTextFields(obj[k]);
    }
    return copy;
  }
  return obj;
}

function canonicalConfigSignature(config) {
  const c = { ...(config.c || {}) };
  delete c.n; // hostname
  const a = (config.a || []).map(stripFreeTextFields);
  return JSON.stringify({ c: stripFreeTextFields(c), a });
}

// Compara el JSON cargado contra el catálogo (ignorando hostname/nombres)
// para saber si coincide exactamente con un dispositivo conocido. Solo se
// consideran coincidencias reales (mismo "c"/"a" salvo texto libre); no hay
// coincidencia aproximada/parcial para evitar sugerir un dispositivo erróneo.
function detectDeviceFromConfig(parsedJson) {
  if (typeof DEVICE_CATALOG === "undefined") return null;
  const sig = canonicalConfigSignature(parsedJson);
  return DEVICE_CATALOG.find((d) => d.category !== "Personalizado" && canonicalConfigSignature(d.config) === sig) || null;
}

// Blakadder (templates.blakadder.com) tiene la ficha de pinout/esquema por
// modelo exacto que se pidió mostrar, pero no podemos garantizar la URL
// exacta de cada modelo del catálogo sin comprobarlas una a una (los
// nombres varían: Gen3, Mini, Plus, PM...). Para no enlazar nunca una
// página equivocada, se usa un enlace de búsqueda dentro de ese sitio con
// el nombre del modelo, que siempre lleva a la ficha correcta o a los
// resultados más cercanos, en vez de adivinar el slug.
function blakadderSearchUrl(hint) {
  const query = hint.model.toLowerCase().startsWith(hint.category.toLowerCase()) ? hint.model : `${hint.category} ${hint.model}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`site:templates.blakadder.com ${query}`)}`;
}

function renderDeviceHint(containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  const hint = state.general.deviceHint;
  if (hint) {
    const wikiUrl = CATEGORY_WIKI_URL[hint.category];
    const modelLabel = hint.model.toLowerCase().startsWith(hint.category.toLowerCase()) ? hint.model : `${hint.category} ${hint.model}`;
    const exampleText = currentLang === "en" && hint.exampleEn ? hint.exampleEn : hint.example;
    const label = exampleText ? `${modelLabel} — ${exampleText}` : modelLabel;
    const sourceMsg = hint.source === "detected" ? t("deviceHintDetected") : t("deviceHintDeclared");
    const links = [
      `<a href="${blakadderSearchUrl(hint)}" target="_blank" rel="noopener">${t("deviceHintSchemaLink")} ↗</a>`,
      wikiUrl ? `<a href="${wikiUrl}" target="_blank" rel="noopener">${t("deviceHintWikiLink")} ↗</a>` : null,
    ].filter(Boolean);
    box.innerHTML = `
      <p class="hint">🔎 ${sourceMsg}: <strong>${label}</strong> — ${links.join(" · ")}</p>
    `;
    return;
  }
  // Sin dispositivo detectado no mostramos nada aquí: el único selector de
  // dispositivo es el principal de arriba (.device-picker). Así se evita el
  // desplegable duplicado de marca/modelo en Configuración General y en el
  // asistente. El enlace a la ficha se muestra arriba solo cuando hay un
  // dispositivo cargado/detectado (rama anterior de esta función).
  box.innerHTML = "";
}

function hideJsonRepairSuggestion() {
  const box = document.getElementById("json-repair-box");
  box.innerHTML = "";
  box.className = "json-repair-box hidden";
}

function showJsonRepairSuggestion(fixedText) {
  const box = document.getElementById("json-repair-box");
  box.className = "json-repair-box";
  box.innerHTML = `
    <p class="hint">${t("jsonRepairHint")}</p>
    <pre class="json-output">${fixedText.replace(/</g, "&lt;")}</pre>
    <div class="btn-row">
      <button class="btn-primary" id="btn-repair-apply">${t("jsonRepairApplyBtn")}</button>
      <button class="btn-secondary" id="btn-repair-dismiss">${t("jsonRepairDismissBtn")}</button>
    </div>
  `;
  document.getElementById("btn-repair-apply").addEventListener("click", () => {
    document.getElementById("json-input").value = fixedText;
    hideJsonRepairSuggestion();
    loadJsonIntoForm(fixedText);
  });
  document.getElementById("btn-repair-dismiss").addEventListener("click", hideJsonRepairSuggestion);
}

function loadJsonIntoForm(text) {
  const statusEl = document.getElementById("load-status");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    statusEl.textContent = `${t("loadJsonInvalid")}: ${e.message}`;
    statusEl.className = "error";
    const repair = tryRepairJson(text);
    if (repair) {
      showJsonRepairSuggestion(repair.fixed);
    } else {
      hideJsonRepairSuggestion();
    }
    return;
  }
  hideJsonRepairSuggestion();

  // Si el JSON pegado es de una versión anterior a v12 "Merlin" (acciones en
  // notación objeto {"g":..} y/o sin "io" central), se convierte a v12
  // automáticamente antes de cargarlo, y se avisa al usuario.
  const convertedObj = convertLegacyToV12(parsed);
  const wasLegacy = JSON.stringify(convertedObj) !== JSON.stringify(parsed);
  if (wasLegacy) parsed = convertedObj;

  const detected = detectDeviceFromConfig(parsed);
  state.general.deviceHint = detected ? { source: "detected", category: detected.category, model: detected.model, example: detected.example, exampleEn: detected.exampleEn } : null;

  const c = parsed.c || {};
  state.general.hostname = c.n || "";
  state.general.log = c.o || 0;
  state.general.ledGpio = c.l !== undefined ? c.l : null;
  state.general.ledInvert = c.i !== undefined ? !!c.i : true;
  state.general.setupButtons = (c.b || []).map((b) => `${b[0]}:${b[1]}`).join(", ");
  const cRest = { ...c };
  delete cRest.io;
  delete cRest.n;
  delete cRest.o;
  delete cRest.l;
  delete cRest.i;
  delete cRest.b;
  state.general.rawExtra = Object.keys(cRest).length ? JSON.stringify(cRest, null, 2) : "";

  // Un grupo GPIO por línea: si el dispositivo declara varios GPIOs juntos
  // en la misma entrada "io" (ej. [[4,5,12,15,13],2]), se separan en una fila
  // por GPIO para que se puedan editar individualmente sin quedar todos
  // apelotonados en un único campo.
  state.io = (c.io || []).flatMap((arr) => {
    const gpios = arr[0] || [];
    const mode = arr[1];
    const pull = arr[2] !== undefined ? arr[2] : 0;
    const params = arr.slice(3).join(", ");
    return gpios.map((gpio) => ({ id: nextId(), gpios: String(gpio), mode, pull, params }));
  });
  if (!state.io.length) {
    state.io = [{ id: nextId(), gpios: "", mode: 2, pull: "0", params: "" }];
  }

  // Los servicios extra ("es") agrupados en un accesorio se separan
  // automáticamente al cargar, para que cada relé/válvula/etc. aparezca
  // como una tarjeta propia y editable desde el primer momento (en vez de
  // quedar oculto hasta pulsar "Separar en accesorios independientes").
  state.accessories = (parsed.a || []).map(accessoryObjectToState).flatMap(expandAccessoryEs);
  if (!state.accessories.length) {
    state.accessories = [{ id: nextId(), t: 1, custom: false, nm: "", relayGpio: null, buttons: [], typeData: {}, rawExtra: "" }];
  }

  render();
  if (wasLegacy) {
    statusEl.textContent = t("loadJsonConverted");
    statusEl.className = "warn";
  } else {
    statusEl.textContent = t("loadJsonOk");
    statusEl.className = "ok";
  }
}

document.getElementById("btn-add-io").addEventListener("click", () => {
  state.io.push({ id: nextId(), gpios: "", mode: 2, pull: "0", params: "" });
  render();
});

document.getElementById("btn-add-accessory").addEventListener("click", () => {
  state.accessories.push({ id: nextId(), t: 1, custom: false, nm: "", relayGpio: null, buttons: [], typeData: {}, rawExtra: "" });
  render();
});

document.getElementById("gen-hostname").addEventListener("input", (e) => {
  state.general.hostname = e.target.value;
  renderJson();
});
document.getElementById("gen-log").addEventListener("change", (e) => {
  state.general.log = e.target.value;
  renderJson();
});
document.getElementById("gen-led-gpio").addEventListener("input", (e) => {
  state.general.ledGpio = e.target.value;
  renderJson();
});
document.getElementById("gen-led-invert").addEventListener("change", (e) => {
  state.general.ledInvert = e.target.checked;
  renderJson();
});
document.getElementById("gen-setup-buttons").addEventListener("input", (e) => {
  state.general.setupButtons = e.target.value;
  renderJson();
});
document.getElementById("gen-raw-extra").addEventListener("input", (e) => {
  state.general.rawExtra = e.target.value;
  renderJson();
});

document.getElementById("btn-copy").addEventListener("click", () => {
  const text = document.getElementById("json-output").textContent;
  navigator.clipboard.writeText(text);
});

document.getElementById("btn-simplify").addEventListener("click", (e) => {
  hideDefaults = !hideDefaults;
  e.target.textContent = hideDefaults ? t("showDefaultsBtn") : t("hideDefaultsBtn");
  renderJson();
});

document.getElementById("btn-oneline").addEventListener("click", (e) => {
  oneLine = !oneLine;
  e.target.textContent = oneLine ? t("multiLineBtn") : t("oneLineBtn");
  renderJson();
});

document.getElementById("btn-load-json").addEventListener("click", () => {
  const text = document.getElementById("json-input").value;
  loadJsonIntoForm(text);
  // Si se cargó bien, muestra el formulario avanzado (donde se ve de golpe
  // la lista de GPIOs y accesorios resultante) en vez de dejar la vista en
  // el asistente, donde el resultado no se aprecia igual de claro.
  const st = document.getElementById("load-status");
  if (st.classList.contains("ok") || st.classList.contains("warn")) {
    setMode("advanced");
  }
});

// ---------- Convertidor MEPLHAA v11 "Peregrine" -> v12 "Merlin" ----------
// Convierte configuraciones antiguas al formato actual siguiendo la guía
// oficial (Migration-Guide-for-HAA-V12-Merlin):
//  - Acciones de relé "r" con GPIOs como objeto {"g":..,"v":..,"i":..} ->
//    array posicional [g, v, i].
//  - Botones "b"/"f[n]" con {"g":..,"t":..} -> array [g, t].
//  - Reconstruye el "io" central (obligatorio en v12) a partir de los GPIOs
//    usados: salidas (las de "r" + el LED "l") como modo 2, entradas (las de
//    "b"/"f[n]") como modo 6. Si el config ya trae "io", se respeta.
// Es idempotente: aplicarlo sobre un config que ya es v12 no lo estropea.
function convertLegacyToV12(cfg) {
  const obj = JSON.parse(JSON.stringify(cfg));
  const outputs = new Set();
  const inputs = new Set();

  function convRelayEntry(el) {
    if (Array.isArray(el)) {
      if (el.length) outputs.add(Number(el[0]));
      return el;
    }
    if (el && typeof el === "object" && el.g !== undefined) {
      outputs.add(Number(el.g));
      const arr = [Number(el.g)];
      const hasV = el.v !== undefined;
      const hasI = el.i !== undefined;
      if (hasI) arr.push(hasV ? Number(el.v) : 0, Number(el.i));
      else if (hasV) arr.push(Number(el.v));
      return arr;
    }
    return el;
  }

  function convButtonEntry(el) {
    if (Array.isArray(el)) {
      if (el.length) inputs.add(Number(el[0]));
      return el;
    }
    if (el && typeof el === "object" && el.g !== undefined) {
      inputs.add(Number(el.g));
      const arr = [Number(el.g)];
      if (el.t !== undefined) arr.push(Number(el.t));
      return arr;
    }
    return el;
  }

  function walk(node) {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;
    Object.keys(node).forEach((key) => {
      const val = node[key];
      if (key === "r" && Array.isArray(val)) {
        node[key] = val.map(convRelayEntry);
      } else if ((key === "b" || /^f\d+$/.test(key)) && Array.isArray(val)) {
        node[key] = val.map(convButtonEntry);
      } else {
        walk(val);
      }
    });
  }

  const c = obj.c || {};
  if (Array.isArray(c.b)) c.b = c.b.map(convButtonEntry);
  if (c.l !== undefined) outputs.add(Number(c.l));
  if (Array.isArray(obj.a)) obj.a.forEach(walk);

  if (c.io === undefined) {
    const outArr = [...outputs].filter((g) => !Number.isNaN(g)).sort((a, b) => a - b);
    const inArr = [...inputs].filter((g) => !Number.isNaN(g) && !outputs.has(g)).sort((a, b) => a - b);
    const io = [];
    if (outArr.length) io.push([outArr, 2]);
    if (inArr.length) io.push([inArr, 6]);
    if (io.length) {
      obj.c = { io, ...c }; // "io" primero, por legibilidad
      return obj;
    }
  }
  obj.c = c;
  return obj;
}

function runConverter() {
  const statusEl = document.getElementById("convert-status");
  const outEl = document.getElementById("convert-output");
  const text = document.getElementById("convert-input").value.trim();
  if (!text) {
    statusEl.textContent = t("convertEmpty");
    statusEl.className = "error";
    outEl.textContent = "";
    return "";
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    statusEl.textContent = `${t("convertInvalid")}: ${e.message}`;
    statusEl.className = "error";
    outEl.textContent = "";
    return "";
  }
  const before = JSON.stringify(parsed);
  const result = JSON.stringify(convertLegacyToV12(parsed));
  outEl.textContent = result;
  statusEl.textContent = result === before ? t("convertOkNoChange") : t("convertOk");
  statusEl.className = "ok";
  return result;
}

document.getElementById("btn-convert").addEventListener("click", runConverter);

document.getElementById("btn-convert-copy").addEventListener("click", () => {
  const out = document.getElementById("convert-output").textContent;
  if (out) navigator.clipboard.writeText(out);
});

document.getElementById("btn-convert-load").addEventListener("click", () => {
  let result = document.getElementById("convert-output").textContent;
  if (!result) result = runConverter();
  if (!result) return;
  document.getElementById("json-input").value = result;
  loadJsonIntoForm(result);
  if (document.getElementById("load-status").classList.contains("ok")) {
    setMode("advanced");
  }
});

// ---------- Modo Asistente (wizard) ----------

// Declara (o corrige el modo de) un GPIO introducido en un campo del
// asistente (LED, salida de un accesorio, botón...). Si se indica
// "source" (un identificador único del campo que llama), primero se
// quita cualquier fila que ese mismo campo hubiera añadido antes —
// así, si cambias o borras el valor, no se queda un GPIO declarado
// para siempre sin usarse (bug reportado por RavenSystem: escribir y
// luego borrar/cambiar un GPIO en el asistente dejaba una fila fantasma).
function ensureIoDeclaration(gpio, mode, source) {
  if (source) {
    state.io = state.io.filter((g) => g.autoSource !== source);
  }
  if (gpio === null || gpio === "" || Number.isNaN(Number(gpio))) return;
  gpio = Number(gpio);
  state.io.forEach((g) => {
    const gpios = parseGpioList(g.gpios);
    const idx = gpios.indexOf(gpio);
    if (idx !== -1 && Number(g.mode) !== mode) {
      gpios.splice(idx, 1);
      g.gpios = gpios.join(", ");
    }
  });
  state.io = state.io.filter((g) => parseGpioList(g.gpios).length > 0);
  const already = state.io.some((g) => Number(g.mode) === mode && parseGpioList(g.gpios).includes(gpio));
  if (!already) {
    state.io.push({ id: nextId(), gpios: String(gpio), mode, pull: "0", params: "", autoSource: source });
  }
}

function newAccessory() {
  return { id: nextId(), t: 1, custom: false, nm: "", relayGpio: null, buttons: [], typeData: {}, rawExtra: "" };
}

const wizard = {
  step: "intro",
  history: [],
  accIndex: 0,
};

function wizardCurrentAcc() {
  if (!state.accessories[wizard.accIndex]) {
    state.accessories[wizard.accIndex] = newAccessory();
  }
  return state.accessories[wizard.accIndex];
}

function wizardGoTo(step) {
  wizard.history.push(wizard.step);
  wizard.step = step;
  renderWizard();
}

function wizardBack() {
  if (wizard.history.length) {
    wizard.step = wizard.history.pop();
    renderWizard();
  }
}

function stepTitle(step) {
  const map = {
    intro: "wizStepIntro",
    "acc-type": "wizStepAccType",
    "acc-name": "wizStepAccName",
    "acc-output": "wizStepAccOutput",
    "acc-type-fields": "wizStepTypeFields",
    "acc-button": "wizStepAccButton",
    "acc-custom": "wizStepAccCustom",
    "acc-confirm": "wizStepAccConfirm",
    summary: "wizStepSummary",
  };
  return t(map[step] || step);
}

function renderWizardProgress() {
  const acc = state.accessories[wizard.accIndex];
  const accLabel = acc ? ` · ${t("wizAccessoryLabel")} ${wizard.accIndex + 1}` : "";
  document.getElementById("wizard-progress").textContent = `${stepTitle(wizard.step)}${wizard.step.startsWith("acc-") ? accLabel : ""}`;
}

function renderWizard() {
  renderWizardProgress();
  const content = document.getElementById("wizard-step-content");
  const nav = document.getElementById("wizard-nav");
  nav.style.display = "flex";
  document.getElementById("wizard-back").style.visibility = wizard.history.length ? "visible" : "hidden";

  if (wizard.step === "intro") {
    content.innerHTML = `
      <h3>${t("wizIntroH3")}</h3>
      ${wizardGpioSummaryHTML()}
      <label>${t("hostnameLabel")}
        <input type="text" id="w-hostname" value="${state.general.hostname}" placeholder="${t("hostnamePlaceholder")}">
      </label>
      <label class="checkbox-label"><input type="checkbox" id="w-has-led" ${state.general.ledGpio !== null && state.general.ledGpio !== "" ? "checked" : ""}> ${t("wizIntroLedCheckbox")}</label>
      <div id="w-led-fields" style="${state.general.ledGpio !== null && state.general.ledGpio !== "" ? "" : "display:none"}">
        <label>${t("ledGpioLabel")}
          <input type="number" id="w-led-gpio" value="${state.general.ledGpio ?? ""}" placeholder="ej: 13">
        </label>
        <label class="checkbox-label"><input type="checkbox" id="w-led-invert" ${state.general.ledInvert ? "checked" : ""}> ${t("wizIntroLedInvert")}</label>
      </div>
      <div id="wiz-device-hint-box" class="device-hint-box"></div>
      <p class="hint">${t("wizIntroNextHint")}</p>
    `;
    renderDeviceHint("wiz-device-hint-box");
    document.getElementById("w-hostname").addEventListener("input", (e) => {
      state.general.hostname = e.target.value;
      renderJson();
    });
    document.getElementById("w-has-led").addEventListener("change", (e) => {
      document.getElementById("w-led-fields").style.display = e.target.checked ? "" : "none";
      if (!e.target.checked) {
        state.general.ledGpio = null;
        ensureIoDeclaration(null, 2, "general.led");
      } else if (state.general.ledGpio === null || state.general.ledGpio === "") {
        state.general.ledGpio = "";
      }
      renderJson();
    });
    document.getElementById("w-led-gpio").addEventListener("input", (e) => {
      state.general.ledGpio = e.target.value;
      ensureIoDeclaration(e.target.value, 2, "general.led");
      renderJson();
    });
    document.getElementById("w-led-invert").addEventListener("change", (e) => {
      state.general.ledInvert = e.target.checked;
      renderJson();
    });
  }

  if (wizard.step === "acc-type") {
    const acc = wizardCurrentAcc();
    content.innerHTML = `
      <h3>${t("wizAccTypeH3")}</h3>
      <label>${t("wizAccTypeLabel")}
        <select id="w-acc-type-select">
          ${ACCESSORY_TYPES.map(
            (x) => `<option value="${x.id}" ${Number(acc.t) === x.id ? "selected" : ""}>${x.id} - ${currentLang === "en" ? x.labelEn : x.label}</option>`
          ).join("")}
        </select>
      </label>
      <p class="hint">${t("wizAccTypeHint")}</p>
      <div id="w-type-info">${renderTypeInfoHTML(acc.t)}</div>
    `;
    document.getElementById("w-acc-type-select").addEventListener("change", (e) => {
      acc.t = Number(e.target.value);
      acc.custom = !(acc.t === 1 || acc.t === 2 || TYPE_FIELD_DEFS[acc.t]);
      document.getElementById("w-type-info").innerHTML = renderTypeInfoHTML(acc.t);
      renderJson();
    });
  }

  if (wizard.step === "acc-name") {
    const acc = wizardCurrentAcc();
    content.innerHTML = `
      <h3>${t("wizAccNameH3")}</h3>
      <label>${t("wizAccNameLabel")}
        <input type="text" id="w-acc-name" value="${acc.nm}" placeholder="${t("namePlaceholder")}">
      </label>
    `;
    document.getElementById("w-acc-name").addEventListener("input", (e) => {
      acc.nm = e.target.value;
      renderJson();
    });
  }

  if (wizard.step === "acc-output") {
    const acc = wizardCurrentAcc();
    content.innerHTML = `
      <h3>${t("wizAccOutputH3")}</h3>
      <label>${t("wizAccOutputLabel")}
        <input type="number" id="w-acc-gpio" value="${acc.relayGpio ?? ""}" placeholder="ej: 12">
      </label>
      <p class="hint">${t("wizAccOutputHint")}</p>
    `;
    document.getElementById("w-acc-gpio").addEventListener("input", (e) => {
      acc.relayGpio = e.target.value;
      ensureIoDeclaration(e.target.value, 2, `acc-${acc.id}-relay`);
      renderJson();
    });
  }

  if (wizard.step === "acc-type-fields") {
    const acc = wizardCurrentAcc();
    const defs = TYPE_FIELD_DEFS[Number(acc.t)] || [];
    const label = typeLabel(acc.t);
    content.innerHTML = `
      <h3>${(currentLang === "en" ? "Configuration: " : "Configuración: ") + (label || (currentLang === "en" ? "Accessory" : "Accesorio"))}</h3>
      ${defs
        .map((f) => {
          const val = acc.typeData && acc.typeData[f.key] !== undefined ? acc.typeData[f.key] : "";
          if (f.type === "select") {
            return `<label>${tfLabel(f)}
                <select data-typefield="${f.key}">
                  <option value="" ${val === "" ? "selected" : ""}>—</option>
                  ${f.options.map((o) => `<option value="${o.value}" ${String(val) === String(o.value) ? "selected" : ""}>${o.label}</option>`).join("")}
                </select>
              </label>`;
          }
          return `<label>${tfLabel(f)} ${tfHint(f) ? `<span class="hint">${tfHint(f)}</span>` : ""}
              <input type="${f.type}" data-typefield="${f.key}" value="${val}">
            </label>`;
        })
        .join("")}
      <p class="hint">${t("wizTypeFieldsHint")}</p>
    `;
    content.querySelectorAll("[data-typefield]").forEach((el) => {
      const handler = (e) => {
        if (!acc.typeData) acc.typeData = {};
        acc.typeData[e.target.dataset.typefield] = e.target.value;
        if (e.target.dataset.typefield === "gpio") {
          if (Number(acc.t) === 3) ensureIoDeclaration(e.target.value, 6, `acc-${acc.id}-typefield-gpio`);
          if (Number(acc.t) === 4 || Number(acc.t) === 20) ensureIoDeclaration(e.target.value, 2, `acc-${acc.id}-typefield-gpio`);
        }
        renderJson();
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
  }

  if (wizard.step === "acc-custom") {
    const acc = wizardCurrentAcc();
    const label = typeLabel(acc.t);
    content.innerHTML = `
      <h3>${label || t("wizAccCustomDefaultTitle")}</h3>
      <label>${t("wizAccCustomLabel")}
        <input type="number" id="w-custom-t" value="${acc.t}" placeholder="ej: 3">
      </label>
      <label>${t("wizAccCustomJsonLabel")}
        <textarea id="w-custom-json" placeholder='{"0":{"r":[[12,0]]},"1":{"r":[[12,1]]}}'>${acc.rawExtra}</textarea>
      </label>
    `;
    document.getElementById("w-custom-t").addEventListener("input", (e) => {
      acc.t = Number(e.target.value);
      renderJson();
    });
    document.getElementById("w-custom-json").addEventListener("input", (e) => {
      acc.rawExtra = e.target.value;
      renderJson();
    });
  }

  if (wizard.step === "acc-button") {
    const acc = wizardCurrentAcc();
    const hasButton = acc.buttons.length > 0;
    const gpio = hasButton ? acc.buttons[0].gpio : "";
    content.innerHTML = `
      <h3>${t("wizAccButtonH3")}</h3>
      <label class="checkbox-label"><input type="checkbox" id="w-has-button" ${hasButton ? "checked" : ""}> ${t("wizAccButtonCheckbox")}</label>
      <div id="w-button-fields" style="${hasButton ? "" : "display:none"}">
        <label>${t("wizAccButtonGpioLabel")}
          <input type="number" id="w-button-gpio" value="${gpio}" placeholder="ej: 0">
        </label>
      </div>
    `;
    document.getElementById("w-has-button").addEventListener("change", (e) => {
      document.getElementById("w-button-fields").style.display = e.target.checked ? "" : "none";
      if (!e.target.checked) {
        acc.buttons = [];
        ensureIoDeclaration(null, 6, `acc-${acc.id}-button`);
      } else {
        acc.buttons = [{ gpio: "", type: 1 }];
      }
      renderJson();
    });
    document.getElementById("w-button-gpio").addEventListener("input", (e) => {
      acc.buttons = [{ gpio: e.target.value, type: 1 }];
      ensureIoDeclaration(e.target.value, 6, `acc-${acc.id}-button`);
      renderJson();
    });
  }

  if (wizard.step === "acc-confirm") {
    const acc = wizardCurrentAcc();
    const label = typeLabel(acc.t);
    const typeLabelText = label ? `${acc.t} - ${label}` : `${currentLang === "en" ? "custom type" : "tipo personalizado"} (t=${acc.t})`;
    const typeDataSummary = Object.entries(acc.typeData || {})
      .filter(([, v]) => v !== "" && v !== undefined)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    nav.style.display = "none";
    content.innerHTML = `
      <h3>${t("wizConfirmH3")}</h3>
      <div class="wizard-summary-box">
        <strong>${acc.nm.trim() || t("wizConfirmNoName")}</strong> — ${typeLabelText}<br>
        ${acc.relayGpio !== null && acc.relayGpio !== "" ? `${t("relayGpioLabel")}: ${acc.relayGpio}<br>` : ""}
        ${typeDataSummary ? `${typeDataSummary}<br>` : ""}
        ${acc.buttons.length ? `${t("wizConfirmButtonOn")} ${acc.buttons[0].gpio}` : t("wizConfirmNoButton")}
      </div>
      <p>${t("wizConfirmAsk")}</p>
      <div class="wizard-actions">
        <button class="btn-secondary" id="w-add-another">${t("wizAddAnotherBtn")}</button>
        <button class="btn-primary" id="w-finish">${t("wizFinishBtn")}</button>
      </div>
    `;
    document.getElementById("w-add-another").addEventListener("click", () => {
      state.accessories.push(newAccessory());
      wizard.accIndex = state.accessories.length - 1;
      wizardGoTo("acc-type");
    });
    document.getElementById("w-finish").addEventListener("click", () => {
      wizardGoTo("summary");
    });
  }

  if (wizard.step === "summary") {
    nav.style.display = "none";
    content.innerHTML = `
      <h3>${t("wizSummaryH3")}</h3>
      <p>${t("wizSummaryText")}</p>
      <div class="wizard-actions">
        <button class="btn-secondary" id="w-restart">${t("wizRestartBtn")}</button>
      </div>
    `;
    document.getElementById("w-restart").addEventListener("click", () => {
      state.general.hostname = "";
      state.general.log = 0;
      state.general.ledGpio = null;
      state.general.ledInvert = true;
      state.general.setupButtons = "";
      state.general.rawExtra = "";
      state.io = [];
      state.accessories = [newAccessory()];
      wizard.step = "intro";
      wizard.history = [];
      wizard.accIndex = 0;
      render();
    });
  }
}

document.getElementById("wizard-next").addEventListener("click", () => {
  const acc = wizardCurrentAcc();
  const friendly = Number(acc.t) === 1 || Number(acc.t) === 2;
  const hasTypeFields = !!TYPE_FIELD_DEFS[Number(acc.t)];
  if (wizard.step === "intro") return wizardGoTo("acc-type");
  if (wizard.step === "acc-type") return wizardGoTo("acc-name");
  if (wizard.step === "acc-name") {
    if (friendly) return wizardGoTo("acc-output");
    if (hasTypeFields) return wizardGoTo("acc-type-fields");
    return wizardGoTo("acc-custom");
  }
  if (wizard.step === "acc-output") return wizardGoTo("acc-button");
  if (wizard.step === "acc-type-fields") return wizardGoTo("acc-button");
  if (wizard.step === "acc-custom") return wizardGoTo("acc-button");
  if (wizard.step === "acc-button") return wizardGoTo("acc-confirm");
});
document.getElementById("wizard-back").addEventListener("click", wizardBack);

let currentMode = "wizard";

// Muestra solo el modo elegido (asistente o formulario avanzado) y oculta
// el otro por completo, para no mezclar ambos en la misma pantalla.
// El estado (state/wizard) es el mismo en los dos casos: cambiar de modo
// no pierde nada de lo ya configurado.
function setMode(mode) {
  currentMode = mode;
  document.getElementById("wizard-panel").classList.toggle("hidden", mode !== "wizard");
  document.getElementById("advanced-form").classList.toggle("hidden", mode !== "advanced");
  document.getElementById("mode-wizard").classList.toggle("active", mode === "wizard");
  document.getElementById("mode-advanced").classList.toggle("active", mode === "advanced");
  if (mode === "wizard") {
    renderWizard();
  } else {
    render();
  }
  window.scrollTo({ top: document.getElementById("mode-wizard").getBoundingClientRect().top + window.scrollY - 10, behavior: "smooth" });
}

document.getElementById("mode-wizard").addEventListener("click", () => setMode("wizard"));
document.getElementById("mode-advanced").addEventListener("click", () => setMode("advanced"));

// ---------- Selector de dispositivos y funciones ----------

// Las categorías se guardan siempre en español internamente (se comparan
// por ese valor en varios sitios: category === "Personalizado", etc.) —
// esto solo traduce lo que se ve en el desplegable, no el valor real.
const CATEGORY_LABEL_EN = { Otros: "Other", Personalizado: "Custom" };
function categoryLabel(c) {
  if (c === "__saved__") return currentLang === "en" ? "⭐ My saved" : "⭐ Mis guardados";
  return currentLang === "en" && CATEGORY_LABEL_EN[c] ? CATEGORY_LABEL_EN[c] : c;
}

function populateDevicePicker() {
  const categorySelect = document.getElementById("device-category");
  if (typeof DEVICE_CATALOG === "undefined") return;
  const prev = categorySelect.value;
  const categories = [...new Set(DEVICE_CATALOG.map((d) => d.category))];
  if (getSavedConfigs().length) categories.push("__saved__");
  categorySelect.innerHTML = categories.map((c) => `<option value="${escapeHtmlSaved(c)}">${categoryLabel(c)}</option>`).join("");
  if (prev && [...categorySelect.options].some((o) => o.value === prev)) categorySelect.value = prev;
  // Sugerencias de marca en el formulario de guardar (marcas del catálogo).
  const dl = document.getElementById("saved-marca-list");
  if (dl) dl.innerHTML = [...new Set(DEVICE_CATALOG.map((d) => d.category).filter((c) => c !== "Personalizado"))].map((c) => `<option value="${escapeHtmlSaved(c)}"></option>`).join("");
  populateModelSelect();
}

function populateModelSelect() {
  const category = document.getElementById("device-category").value;
  const modelSelect = document.getElementById("device-model");
  let models;
  if (category === "__saved__") {
    models = [...new Set(getSavedConfigs().map((s) => savedModelLabel(s)))];
  } else {
    models = [...new Set(DEVICE_CATALOG.filter((d) => d.category === category).map((d) => d.model))];
  }
  modelSelect.innerHTML = models.map((m) => `<option value="${escapeHtmlSaved(m)}">${escapeHtmlSaved(m)}</option>`).join("");
  populateExampleSelect();
}

function deviceExampleLabel(d) {
  return currentLang === "en" && d.exampleEn ? d.exampleEn : d.example;
}

function deviceDescriptionText(d) {
  return currentLang === "en" && d.descriptionEn ? d.descriptionEn : d.description;
}

function populateExampleSelect() {
  const category = document.getElementById("device-category").value;
  const model = document.getElementById("device-model").value;
  const exampleSelect = document.getElementById("device-example");

  if (category === "__saved__") {
    const options = getSavedConfigs()
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => savedModelLabel(s) === model)
      .map(({ s, i }) => `<option value="saved:${i}">${escapeHtmlSaved(s.funcion || t("savedNoFunction"))}</option>`);
    exampleSelect.innerHTML = options.join("");
    updateDeviceDescription();
    return;
  }

  if (category === "Personalizado") {
    // En "Personalizado" el desplegable de ejemplo muestra TODAS las
    // plantillas del catálogo (de cualquier fabricante/modelo), para poder
    // curiosear/elegir una sin tener que navegar antes por fabricante.
    // Al elegir una y pulsar "Usar esta configuración", el fabricante y
    // modelo se actualizan solos para reflejar el dispositivo real.
    const blank = DEVICE_CATALOG.map((d, idx) => ({ ...d, idx })).find((d) => d.category === "Personalizado");
    const others = DEVICE_CATALOG.map((d, idx) => ({ ...d, idx })).filter((d) => d.category !== "Personalizado");
    const options = [`<option value="${blank.idx}">${deviceExampleLabel(blank)}</option>`].concat(
      others.map((d) => `<option value="${d.idx}">${d.model} — ${deviceExampleLabel(d)}</option>`)
    );
    exampleSelect.innerHTML = options.join("");
    updateDeviceDescription();
    return;
  }

  const examples = DEVICE_CATALOG.map((d, idx) => ({ ...d, idx })).filter((d) => d.category === category && d.model === model);
  const customLabel = currentLang === "en" ? "🛠 Custom (this model's GPIOs, no preset accessory)" : "🛠 Personalizado (GPIOs de este modelo, sin accesorio predefinido)";
  const options = examples.map((d) => `<option value="${d.idx}">${deviceExampleLabel(d)}</option>`);
  options.push(`<option value="custom">${customLabel}</option>`);
  exampleSelect.innerHTML = options.join("");
  updateDeviceDescription();
}

// Las notas de la comunidad suelen ser largas (varios párrafos, alguna
// viñeta con "*" o "-"), así que en vez de volcarlas como una sola línea
// de "hint" pequeño, se muestran como texto legible: un párrafo <p> por
// cada salto de línea doble, y saltos simples dentro de un párrafo se
// respetan como líneas separadas (por ejemplo, para viñetas sueltas).
function renderDescriptionText(el, text) {
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (!text) {
    el.innerHTML = "";
    return;
  }
  const paragraphs = text.split(/\n\s*\n/);
  el.innerHTML = paragraphs.map((p) => `<p>${escape(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
}

function updateDeviceDescription() {
  const select = document.getElementById("device-example");
  const descEl = document.getElementById("device-description");
  if (select.value === "custom") {
    renderDescriptionText(
      descEl,
      currentLang === "en"
        ? "Loads this model's real GPIO/general config, with an empty accessory list so you configure it yourself."
        : "Carga la configuración general/GPIOs real de este modelo, con la lista de accesorios vacía para que la configures tú."
    );
    return;
  }
  if (typeof select.value === "string" && select.value.indexOf("saved:") === 0) {
    const item = getSavedConfigs()[Number(select.value.slice(6))];
    let text = item ? item.descripcion || "" : "";
    if (item && item.autor) text = (text ? text + "\n\n" : "") + t("savedByAuthor").replace("%s", item.autor);
    renderDescriptionText(descEl, text);
    return;
  }
  const device = DEVICE_CATALOG[Number(select.value)];
  renderDescriptionText(descEl, device ? deviceDescriptionText(device) : "");
}

document.getElementById("device-category").addEventListener("change", populateModelSelect);
document.getElementById("device-model").addEventListener("change", populateExampleSelect);
document.getElementById("device-example").addEventListener("change", updateDeviceDescription);

document.getElementById("btn-use-device").addEventListener("click", () => {
  const select = document.getElementById("device-example");
  if (typeof select.value === "string" && select.value.indexOf("saved:") === 0) {
    const item = getSavedConfigs()[Number(select.value.slice(6))];
    if (!item) return;
    loadJsonIntoForm(item.config);
    setMode("advanced");
    return;
  }
  if (select.value === "custom") {
    const category = document.getElementById("device-category").value;
    const model = document.getElementById("device-model").value;
    const first = DEVICE_CATALOG.find((d) => d.category === category && d.model === model);
    if (!first) return;
    const customConfig = { c: JSON.parse(JSON.stringify(first.config.c || {})), a: [] };
    loadJsonIntoForm(JSON.stringify(customConfig));
    setMode("wizard");
    return;
  }
  const idx = Number(select.value);
  const device = DEVICE_CATALOG[idx];
  if (!device) return;
  loadJsonIntoForm(JSON.stringify(device.config));
  // Si la plantilla se eligió desde el listado plano de "Personalizado",
  // sincroniza fabricante/modelo para que el selector refleje el dispositivo real.
  const categorySelect = document.getElementById("device-category");
  if (categorySelect.value !== device.category) {
    categorySelect.value = device.category;
    populateModelSelect();
    document.getElementById("device-model").value = device.model;
    populateExampleSelect();
    document.getElementById("device-example").value = String(idx);
    updateDeviceDescription();
  }
  setMode("advanced");
});

// ---------- Mis configuraciones guardadas (localStorage) ----------
// Guarda MEPLHAA en el navegador del usuario como una entrada más de la
// galería: marca, dispositivo, función/tipo, descripción y autor (opcional).
// Aparecen en el selector de dispositivos bajo la marca "⭐ Mis guardados".
// Todo local: no hay servidor, no se sube nada a ningún sitio.
const SAVED_KEY = "meplhaa_saved_v2";
const SAVED_KEY_LEGACY = "meplhaa_saved_v1";
const SAVED_CATEGORY_VALUE = "__saved__";

function getSavedConfigs() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    }
    // Migración desde el formato antiguo (v1: solo nombre + config).
    const legacyRaw = localStorage.getItem(SAVED_KEY_LEGACY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (Array.isArray(legacy) && legacy.length) {
        const migrated = legacy.map((x) => ({ marca: "", dispositivo: x.name || "(sin nombre)", funcion: "", descripcion: "", autor: "", config: x.config, ts: x.ts || 0 }));
        setSavedConfigs(migrated);
        return migrated;
      }
    }
    return [];
  } catch (e) {
    return [];
  }
}

function setSavedConfigs(list) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch (e) {
    // localStorage puede estar deshabilitado (modo privado, cuota llena...).
  }
}

function escapeHtmlSaved(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

// Etiqueta del "modelo" dentro de la galería de guardados: "marca — dispositivo".
function savedModelLabel(item) {
  return item.marca && item.marca.trim() ? `${item.marca.trim()} — ${item.dispositivo}` : item.dispositivo;
}

// Compartir con la comunidad: abre una propuesta (issue) pre-rellenada en el
// repositorio de GitHub, con todos los datos + el JSON, para incorporar la
// configuración al catálogo oficial (que ve todo el mundo). Sin servidor.
function shareToGithub(item) {
  const body = [
    "**Aportación de dispositivo para el catálogo MEPLHAA**",
    "",
    "- **Marca:** " + (item.marca || "-"),
    "- **Dispositivo:** " + (item.dispositivo || "-"),
    "- **Función / tipo:** " + (item.funcion || "-"),
    "- **Autor:** " + (item.autor || "-"),
    "",
    "**Descripción:**",
    item.descripcion || "-",
    "",
    "**Configuración MEPLHAA (v12):**",
    "```json",
    item.config,
    "```",
    "",
    "<!-- Enviado desde el Configurador MEPLHAA (https://haaconfig.github.io/meplhaa-configurator/) -->",
  ].join("\n");
  const title = "[Dispositivo] " + savedModelLabel(item) + (item.funcion ? ": " + item.funcion : "");
  const url =
    "https://github.com/haaconfig/meplhaa-configurator/issues/new?title=" +
    encodeURIComponent(title) +
    "&body=" +
    encodeURIComponent(body);
  window.open(url, "_blank", "noopener");
}

function renderSavedList() {
  const ul = document.getElementById("saved-list");
  if (!ul) return;
  const list = getSavedConfigs();
  if (!list.length) {
    ul.innerHTML = `<li class="saved-empty">${t("savedEmpty")}</li>`;
    return;
  }
  ul.innerHTML = list
    .map((item, i) => {
      const sub = [item.funcion, item.autor ? t("savedByAuthor").replace("%s", item.autor) : ""].filter(Boolean).map(escapeHtmlSaved).join(" · ");
      const pendBadge = item.pendiente ? `<span class="saved-pending-badge">⏳ ${currentLang === "en" ? "pending validation" : "pendiente de validar"}</span>` : "";
      return `<li class="saved-item">
        <span class="saved-item-info">
          <span class="saved-item-name" title="${escapeHtmlSaved(savedModelLabel(item))}">${escapeHtmlSaved(savedModelLabel(item))}</span>${pendBadge}
          ${sub ? `<span class="saved-item-sub">${sub}</span>` : ""}
        </span>
        <span class="saved-item-actions">
          <button type="button" class="btn-secondary" data-saved-share="${i}" title="${t("savedShareTitle")}">${t("savedShareBtn")}</button>
          <button type="button" class="btn-secondary" data-saved-load="${i}">${t("savedLoadBtn")}</button>
          <button type="button" class="btn-secondary" data-saved-del="${i}">${t("savedDeleteBtn")}</button>
        </span>
      </li>`;
    })
    .join("");
}

// --- Marca/dispositivo del catálogo para el formulario de guardar ---
function catalogModelsForMarca(marca) {
  if (typeof DEVICE_CATALOG === "undefined" || !marca) return [];
  const m = marca.trim().toLowerCase();
  return [...new Set(DEVICE_CATALOG.filter((d) => d.category !== "Personalizado" && d.category.toLowerCase() === m).map((d) => d.model))];
}
function isDeviceInCatalog(marca, dispositivo) {
  if (!marca || !dispositivo) return false;
  const dev = dispositivo.trim().toLowerCase();
  return catalogModelsForMarca(marca).some((mm) => mm.toLowerCase() === dev);
}
// Rellena el datalist de "Dispositivo" con los modelos de la marca elegida.
function updateSavedDispositivoDatalist() {
  const dl = document.getElementById("saved-dispositivo-list");
  if (!dl) return;
  const marca = document.getElementById("saved-marca").value;
  dl.innerHTML = catalogModelsForMarca(marca).map((m) => `<option value="${escapeHtmlSaved(m)}"></option>`).join("");
}
// Si el dispositivo escrito no está en el catálogo, avisa de que se guardará
// como "pendiente de validar" y ofrece solicitar su alta oficial.
function updateSavedPendingNote() {
  const note = document.getElementById("saved-pending-note");
  if (!note) return;
  const marca = document.getElementById("saved-marca").value.trim();
  const dispositivo = document.getElementById("saved-dispositivo").value.trim();
  if (dispositivo && !isDeviceInCatalog(marca, dispositivo)) {
    const msg = currentLang === "en"
      ? "This device isn't in the catalog. It will be saved as <strong>pending validation</strong>."
      : "Este dispositivo no está en el listado. Se guardará como <strong>pendiente de validar</strong>.";
    const btn = currentLang === "en" ? "Request addition to the catalog ↗" : "Solicitar alta en el catálogo ↗";
    note.innerHTML = `<p class="hint">⏳ ${msg} <button type="button" class="btn-secondary" id="btn-request-alta">${btn}</button></p>`;
    note.classList.remove("hidden");
  } else {
    note.innerHTML = "";
    note.classList.add("hidden");
  }
}

function saveCurrentConfig() {
  const statusEl = document.getElementById("saved-status");
  const marca = document.getElementById("saved-marca").value.trim();
  const dispositivo = document.getElementById("saved-dispositivo").value.trim();
  const funcion = document.getElementById("saved-funcion").value.trim();
  const descripcion = document.getElementById("saved-descripcion").value.trim();
  const autor = document.getElementById("saved-autor").value.trim();
  if (!dispositivo) {
    statusEl.textContent = t("savedNeedName");
    statusEl.className = "error";
    return;
  }
  const config = JSON.stringify(buildConfig());
  // Un dispositivo que no está en el catálogo (para su marca) se guarda como
  // "pendiente de validar", para que luego se pueda solicitar su alta oficial.
  const pendiente = !isDeviceInCatalog(marca, dispositivo);
  const list = getSavedConfigs();
  const idx = list.findIndex((x) => x.marca === marca && x.dispositivo === dispositivo && x.funcion === funcion);
  const updated = idx >= 0;
  const entry = { marca, dispositivo, funcion, descripcion, autor, config, pendiente, ts: Date.now() };
  if (updated) list[idx] = entry;
  else list.push(entry);
  setSavedConfigs(list);
  ["saved-marca", "saved-dispositivo", "saved-funcion", "saved-descripcion", "saved-autor"].forEach((id) => { document.getElementById(id).value = ""; });
  updateSavedPendingNote();
  const label = savedModelLabel(entry) + (funcion ? " · " + funcion : "");
  statusEl.textContent = (updated ? t("savedUpdated") : t("savedOk")).replace("%s", label);
  statusEl.className = "ok";
  renderSavedList();
  populateDevicePicker();
}

document.getElementById("btn-save-config").addEventListener("click", saveCurrentConfig);
// Marca/Dispositivo del formulario de guardar: elegir del catálogo o escribir libremente.
document.getElementById("saved-marca").addEventListener("input", () => { updateSavedDispositivoDatalist(); updateSavedPendingNote(); });
document.getElementById("saved-dispositivo").addEventListener("input", updateSavedPendingNote);
document.getElementById("saved-pending-note").addEventListener("click", (e) => {
  if (!e.target.closest("#btn-request-alta")) return;
  const item = {
    marca: document.getElementById("saved-marca").value.trim(),
    dispositivo: document.getElementById("saved-dispositivo").value.trim(),
    funcion: document.getElementById("saved-funcion").value.trim(),
    descripcion: document.getElementById("saved-descripcion").value.trim(),
    autor: document.getElementById("saved-autor").value.trim(),
    config: JSON.stringify(buildConfig()),
    pendiente: true,
  };
  shareToGithub(item);
});
updateSavedDispositivoDatalist();
document.getElementById("saved-list").addEventListener("click", (e) => {
  const loadBtn = e.target.closest("[data-saved-load]");
  const delBtn = e.target.closest("[data-saved-del]");
  const shareBtn = e.target.closest("[data-saved-share]");
  const list = getSavedConfigs();
  if (shareBtn) {
    const item = list[Number(shareBtn.dataset.savedShare)];
    if (item) shareToGithub(item);
    return;
  }
  if (loadBtn) {
    const item = list[Number(loadBtn.dataset.savedLoad)];
    if (!item) return;
    document.getElementById("json-input").value = item.config;
    loadJsonIntoForm(item.config);
    const st = document.getElementById("load-status");
    if (st.classList.contains("ok") || st.classList.contains("warn")) setMode("advanced");
  } else if (delBtn) {
    const idx = Number(delBtn.dataset.savedDel);
    const item = list[idx];
    if (!item) return;
    if (!confirm(t("savedConfirmDelete").replace("%s", savedModelLabel(item)))) return;
    list.splice(idx, 1);
    setSavedConfigs(list);
    renderSavedList();
    populateDevicePicker();
  }
});

applyStaticTranslations();
document.getElementById("btn-simplify").textContent = hideDefaults ? t("showDefaultsBtn") : t("hideDefaultsBtn");
document.getElementById("btn-oneline").textContent = oneLine ? t("multiLineBtn") : t("oneLineBtn");
populateDevicePicker();
render();
renderWizard();
renderSavedList();
setMode("wizard");
