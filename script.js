const btnClima = document.getElementById("btnClima");
const inputCiudad = document.getElementById("ciudad");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const nombreCiudad = document.getElementById("nombreCiudad");
const temp = document.getElementById("temp");
const viento = document.getElementById("viento");
const codigo = document.getElementById("codigo");

btnClima.addEventListener("click", () => {
  const ciudad = inputCiudad.value.trim();

  resultado.classList.add("oculto");

  if (ciudad === "") {
    estado.textContent = "Por favor, ingresá una ciudad.";
    return;
  }
  estado.textContent = "Consultando...";

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al consultar la ubicación de la ciudad.");
      }
      return response.json();
    })
    .then(dataGeo => {
      if (!dataGeo.results || dataGeo.results.length === 0) {
        estado.textContent = "Ciudad no encontrada";
        throw new Error("STOP");
      }

      const lat = dataGeo.results[0].latitude;
      const lon = dataGeo.results[0].longitude;
      const nombre = dataGeo.results[0].name;

      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al consultar el clima.");
          }
          return response.json();
        })
        .then(dataClima => {
          const clima = dataClima.current_weather;

          nombreCiudad.textContent = nombre;
          temp.textContent = clima.temperature;
          viento.textContent = clima.windspeed;
          codigo.textContent = clima.weathercode;

          resultado.classList.remove("oculto");
          estado.textContent = "";
        });
    })
    .catch(error => {
      if (error.message === "STOP") return;
      estado.textContent = error.message || "Ocurrió un error al consultar el clima.";
    });

});