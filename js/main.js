document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const weatherTable = document.getElementById('weatherTable');
    const weatherBody = weatherTable.querySelector('tbody');
    const mapDiv = document.getElementById('map');
    const spinner = document.getElementById('spinner');
    const historyTable = document.getElementById('historyTable').querySelector('tbody');
  
    let map;
  
    searchBtn.addEventListener('click', async () => {
      const city = cityInput.value.trim();
      if (!city) {
        alert('Por favor, ingresa el nombre de una ciudad.');
        return;
      }
  
      spinner.style.display = 'block';
  
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const apiKey = 'fbac30215b55f4cbd504db5014236070';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`);
        if (!response.ok) {
          throw new Error('Ciudad no encontrada');
        }
  
        const data = await response.json();
  
        weatherBody.innerHTML = `
          <tr>
            <td>${data.name}</td>
            <td>${data.main.temp.toFixed(1)}</td>
            <td>${data.main.humidity}</td>
            <td>${data.weather[0].description}</td>
          </tr>
        `;
        weatherTable.hidden = false;
  
        const { lat, lon } = data.coord;
        mapDiv.hidden = false;
  
        if (!map) {
          map = L.map('map').setView([lat, lon], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
        } else {
          map.setView([lat, lon], 13);
        }
  
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${data.name}</b><br>${data.weather[0].description}`).openPopup();
  
        const dateTime = new Date().toLocaleString();
        const newRow = `
          <tr>
            <td>${data.name}</td>
            <td>${dateTime}</td>
          </tr>
        `;
        historyTable.insertAdjacentHTML('beforeend', newRow);
  
      } catch (error) {
        alert(error.message);
      } finally {
        spinner.style.display = 'none';
      }
    });
  
    clearBtn.addEventListener('click', () => {
      cityInput.value = '';
      weatherTable.hidden = true;
      weatherBody.innerHTML = '';
      mapDiv.hidden = true;
  
      if (map) {
        map.remove();
        map = null;
      }
  
      historyTable.innerHTML = '';
    });
  });
  