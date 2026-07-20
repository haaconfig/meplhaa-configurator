<p align="center"><img src="meplhaa-icono.png" alt="MEPLHAA Configurator" width="180"></p>

🇬🇧 **English** | 🇪🇸 [Español](README.es.md)

# MEPLHAA Configurator

Visual generator of JSON configurations (MEPLHAA script) for devices running the **HAA v12 "Merlin"** firmware ([RavenSystem esp-homekit-devices](https://github.com/RavenSystem/esp-homekit-devices)). It is a local web app — no installation, no build step: just HTML/CSS/JS.

## Quick start

1. Unzip the archive (or clone/download the `haa-web` folder).
2. Open a terminal in that folder and start a static server, for example:
   ```
   python -m http.server 8096
   ```
3. Open `http://localhost:8096` in your browser.

You can also use any other static server (VS Code Live Server, `npx serve`, etc.) — these are plain files, they need neither Node nor a build step.

> Note: opening `index.html` with a double click (`file://`) may fail due to browser restrictions when loading the `.js` files. Always use a local server like the one in step 2.

## What can you do with this web app?

- **Pick an example device** (optional): at the very top there is a 3-step selector — Manufacturer → Model → Example/function — with more than 230 ready-made configurations (official devices from the RavenSystem wiki + examples migrated and contributed by the community). Select "Custom" to start from scratch, or to browse all available examples in a single dropdown.
- **Step-by-step wizard**: a question-driven guide that builds the configuration accessory by accessory.
- **Advanced form**: direct access to General Configuration, GPIOs and Accessories, with every field available.
- **Paste an existing JSON**: in the right-hand panel, paste your current script and click "Load into the form" to edit it visually. If the JSON is from an older version (v11 "Peregrine"), it is **automatically converted to v12** on load (you'll be notified). The form and the generated JSON are always synchronized in both directions.
- **v11 → v12 converter**: a dedicated card where you can paste an old configuration and convert it to the current format without loading it (useful just to convert and copy).
- **Save your configurations and share them**: save your MEPLHAA configs in the browser and get them back whenever you want; you can also propose them to the official catalog so the whole community can use them.

The wizard and the advanced form share the same state: you can start in one and continue in the other without losing anything.

### General Configuration

Hostname, log output type, status LED GPIO and behavior, setup-mode button(s), and an advanced JSON field for general options not covered by the form (I2C, GPIO expanders, UART, schedules, system actions...).

### GPIOs ("io")

Since HAA v12 Merlin, every GPIO used must be declared before an accessory uses it: mode (input, output, PWM, ADC...), pull-up/down and extra parameters. Each GPIO is shown in its own row, with an automatic label (**Relay**, **LED** or **Button**) indicating how the current configuration is using it — including relays grouped inside extra services of other accessories.

### Accessories

Each accessory maps to a HomeKit service type (switch, outlet, sensor, water valve, thermostat, light bulb, window covering, lock...). When you pick a type you'll see a collapsible panel "What can be configured in this type?" listing the real available JSON keys, according to the official RavenSystem documentation.

If a device groups several relays/sensors into a single accessory through extra services (`es`), the web app **automatically** splits them into independent, fully editable cards when you load the device or paste the JSON — no manual step required. (Note that splitting them makes them appear as independent cards in the Home app, instead of a single card with several controls.)

### Generated JSON

Right-hand panel, always updated live. Available buttons:
- **Hide default values**: simplifies the JSON by removing keys that are already at their default value.
- **Single line**: compacts the JSON for quick copy/paste.
- **Copy**: copies the JSON to the clipboard.

Below it, validation warnings are shown if something in the configuration is inconsistent.

### v11 "Peregrine" → v12 "Merlin" converter

Old configurations used actions with GPIOs as objects (`{"g":12,"v":1}`) and did not include the central `io` block. To move them to the current format you have two ways:

- **Automatic**: when you paste an old JSON into "Paste existing JSON" and click "Load", it is detected and converted to v12 on its own (with a notice).
- **Manual**: the "Old MEPLHAA (v11) → v12 converter" card converts it and shows you the result to copy, without loading it into the form.

The conversion turns the relay (`r`) and button (`b`/`f[n]`) actions into array format, and **rebuilds the central `io`** from the GPIOs used (outputs from `r` + the LED as mode 2, inputs from `b`/`f[n]` as mode 6). It is idempotent: if you pass it something that is already v12, it leaves it untouched. Note: buttons are declared as a simple input (mode 6); some physical buttons need a pull-up (`6,1`), check it in the `io`.

### My saved configurations

You can save your own configurations in the browser as another gallery entry, filling in **brand, device, function, description and author** (optional). They appear in the device selector at the top, under the brand **⭐ My saved ones**, and load just like any other example.

- They are stored **only in your browser/device** (localStorage). Nothing is uploaded anywhere; if you clear your browser data, they are lost.
- Each saved config has a **Share** button, which opens a proposal (issue) on GitHub already filled in with all the data and the JSON, to propose it to the **official catalog** for the whole community to use (after a review).

### Language

ES/EN selector in the top right, for the whole interactive interface, including the device catalog (example name and description). The per-accessory-type reference tables ("what can be configured in this type?") are still Spanish-only for now.

## Project structure

```
haa-web/
├── index.html      Page structure
├── style.css       Styles
├── app.js          Application logic (state, render, JSON generation)
├── devices.js       Catalog of preconfigured devices/examples
├── i18n.js          ES/EN texts
├── typeInfo.js      Per-accessory-type reference info (RavenSystem wiki)
├── favicon.svg
└── VERSION.txt      Version/change history
```

There are no external dependencies and no build step: everything is vanilla JS that runs as-is in the browser.

## How to contribute a device to the catalog

Do you have a device that isn't in the catalog? There are several ways to contribute it, depending on your skills:

**The easiest — from the web app itself**
Configure your device, save it in "My saved configurations" (with brand, model, function, description and author) and click **Share**: a GitHub proposal opens already filled in with all the data and the JSON. You just have to submit it (you need a GitHub account). We review it and add it to the catalog.

**I can't code — I just want to suggest it**
Open a [GitHub issue](https://github.com/haaconfig/meplhaa-configurator/issues/new/choose) with the "Suggest a device" template. The more info you provide (brand, model, link to its page on the RavenSystem wiki or on [templates.blakadder.com](https://templates.blakadder.com/), and the GPIOs if you know them), the easier it will be to add it correctly.

**I can code — I want to add it myself**
1. Open [`devices.js`](devices.js) and find the `Otros` section (or your manufacturer's).
2. Add a line with this format:
   ```js
   { category: "Otros", model: "Brand Model (chip)", example: "Descripción corta", exampleEn: "Short description in English", description: "Descripción más larga si hace falta", descriptionEn: "Longer description in English if needed", config: cfg('{"c":{...},"a":[...]}') },
   ```
   If you can't write the `exampleEn`/`descriptionEn` in English, no problem — send it in Spanish only and I'll translate it when adding it.
3. Important rules (to avoid giving incorrect information to other users):
   - **Don't make up GPIOs or calibration values.** Only use data you can verify: the RavenSystem wiki, the device's page on [templates.blakadder.com](https://templates.blakadder.com/) (for the pinout — note that site is for Tasmota, not HAA, so it's only useful to get the GPIOs, not the HAA configuration itself), or your own test on real hardware.
   - If the power-meter chip has no documented HAA calibration, say so in the `description` instead of inventing figures — you can use the official starting value `{"vf":0.1,"cf":0.1,"pf":1}` given by the wiki (see the "Power-Monitor" page), making clear it needs calibration.
   - If something is your own adaptation (not officially documented), mark it with ⚠ in the name and explain it in the description.
   - Check that the JSON is valid (paste it into the configurator itself, in "Paste existing JSON", and make sure no errors or warnings appear).
4. Send a Pull Request. If you can, state where you got the data (link to the wiki/Blakadder) in the PR description, so it can be verified quickly.

## References

- [RavenSystem esp-homekit-devices wiki](https://github.com/RavenSystem/esp-homekit-devices/wiki) — official documentation for the HAA firmware.
- [Community example script collection (issue #689)](https://github.com/RavenSystem/esp-homekit-devices/issues/689) — source of part of the catalog included here (migrated from v11 "Peregrine" to v12 "Merlin").

## Version

See [`VERSION.txt`](VERSION.txt) for the change history of this configurator.
