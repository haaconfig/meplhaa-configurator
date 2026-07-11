# Configurador MEPLHAA

Generador visual de configuraciones JSON (script MEPLHAA) para dispositivos con firmware **HAA v12 "Merlin"** ([RavenSystem esp-homekit-devices](https://github.com/RavenSystem/esp-homekit-devices)). Es una web local, sin instalación ni build: solo HTML/CSS/JS.

## Uso rápido

1. Descomprime el zip (o clona/descarga la carpeta `haa-web`).
2. Abre una terminal en esa carpeta y arranca un servidor estático, por ejemplo:
   ```
   python -m http.server 8096
   ```
3. Abre `http://localhost:8096` en el navegador.

También puedes usar cualquier otro servidor estático (Live Server de VS Code, `npx serve`, etc.) — son ficheros planos, no requieren Node ni build.

> Nota: abrir `index.html` con doble clic (`file://`) puede fallar por restricciones del navegador al cargar los ficheros `.js`. Usa siempre un servidor local como el del paso 2.

## ¿Qué puedes hacer con esta web?

- **Elegir un dispositivo de ejemplo** (opcional): arriba del todo hay un selector en 3 pasos — Fabricante → Modelo → Ejemplo/función — con más de 180 configuraciones ya hechas (dispositivos oficiales de la wiki de RavenSystem + ejemplos migrados de la comunidad). Selecciona "Personalizado" para partir de cero, o para explorar todos los ejemplos disponibles en un único desplegable.
- **Asistente paso a paso**: guía por preguntas para ir montando la configuración accesorio por accesorio.
- **Formulario avanzado**: acceso directo a Configuración General, GPIOs y Accesorios, con todos los campos disponibles.
- **Pegar un JSON existente**: en el panel derecho, pega tu script actual y pulsa "Cargar en el formulario" para editarlo visualmente. El formulario y el JSON generado están siempre sincronizados en ambos sentidos.

El asistente y el formulario avanzado comparten el mismo estado: puedes empezar en uno y continuar en el otro sin perder nada.

### Configuración General

Hostname, tipo de salida de log, GPIO y comportamiento del LED de estado, botón(es) de modo configuración, y un campo de JSON avanzado para opciones generales no cubiertas por el formulario (I2C, expansores de GPIO, UART, horarios, acciones de sistema...).

### GPIOs ("io")

Desde HAA v12 Merlin, cada GPIO usado debe declararse antes de que un accesorio lo use: modo (entrada, salida, PWM, ADC...), pull-up/down y parámetros adicionales. Cada GPIO se muestra en su propia fila, con una etiqueta automática (**Relé**, **LED** o **Botón**) que indica cómo lo está usando la configuración actual — incluyendo relés agrupados dentro de servicios extra de otros accesorios.

### Accesorios

Cada accesorio corresponde a un tipo de servicio HomeKit (interruptor, enchufe, sensor, válvula de agua, termostato, bombilla, persiana, cerradura...). Al elegir un tipo verás un panel plegable "¿Qué se puede configurar en este tipo?" con las claves JSON reales disponibles, según la documentación oficial de RavenSystem.

Si un dispositivo agrupa varios relés/sensores en un solo accesorio mediante servicios extra (`es`), la web los separa **automáticamente** en tarjetas independientes y totalmente editables al cargar el dispositivo o pegar el JSON — no hace falta ningún paso manual. (Ten en cuenta que separarlos hace que aparezcan como tarjetas independientes en la app Home, en vez de una sola tarjeta con varios controles).

### JSON generado

Panel derecho, siempre actualizado en vivo. Botones disponibles:
- **Ocultar valores por defecto**: simplifica el JSON quitando claves que ya están en su valor por defecto.
- **Una sola línea**: compacta el JSON para copiar/pegar rápido.
- **Copiar**: copia el JSON al portapapeles.

Debajo se muestran avisos de validación si algo en la configuración no es coherente.

### Idioma

Selector ES/EN arriba a la derecha, para toda la interfaz interactiva. (El catálogo de dispositivos y las tablas de referencia por tipo de accesorio están en español).

## Estructura del proyecto

```
haa-web/
├── index.html      Estructura de la página
├── style.css       Estilos
├── app.js          Lógica de la aplicación (estado, render, generación de JSON)
├── devices.js       Catálogo de dispositivos/ejemplos preconfigurados
├── i18n.js          Textos ES/EN
├── typeInfo.js      Información de referencia por tipo de accesorio (wiki RavenSystem)
├── favicon.svg
└── VERSION.txt      Historial de versiones/cambios
```

No hay dependencias externas ni paso de build: todo es JS vanilla que se ejecuta tal cual en el navegador.

## Referencias

- [Wiki de RavenSystem esp-homekit-devices](https://github.com/RavenSystem/esp-homekit-devices/wiki) — documentación oficial del firmware HAA.
- [Colección de scripts de ejemplo de la comunidad (issue #689)](https://github.com/RavenSystem/esp-homekit-devices/issues/689) — fuente de parte del catálogo incluido aquí (migrado de v11 "Peregrine" a v12 "Merlin").

## Versión

Consulta [`VERSION.txt`](VERSION.txt) para el historial de cambios de esta configuradora.
