let map, currentLayer;
    let fromMarker, toMarker, routeLine;

    // 1. Map ko initialize karo
    function initMap() {
        map = L.map('map').setView([28.61, 77.23], 13);  // Delhi ka center aur zoom level set kiya // 13 zoom level hai.

        // Basic OpenStreetMap layer add kiya
        currentLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);

    }

    // 2. Map ki view type change karne ke liye function.
    function changeMapView(type) {
        map.removeLayer(currentLayer);  // Pehle wali layer hatao

        // Nayi layer type ke hisaab se set karo
        let layerUrl = '';
        let attribution = '';

        if (type === 'satellite') {
            layerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            
        } else if (type === 'terrain') {
            layerUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            
        } else {
            layerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        }

        currentLayer = L.tileLayer(layerUrl, { attribution });
        currentLayer.addTo(map);

        // Active button ko highlight karo
        document.querySelectorAll('.view-toggle').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${type}-view`).classList.add('active');
    }

    // 3. Distance calculate karne ka function
    function calculateDistance() {
        const from = document.getElementById('from').value.trim();
        const to = document.getElementById('to').value.trim();
        const resultEl = document.getElementById('result');

        // Animation class toggle for effect
        resultEl.classList.remove('fade-in');
        void resultEl.offsetWidth;
        resultEl.classList.add('fade-in');

        if (from && to) {
            document.getElementById('result-from').textContent = from;
            document.getElementById('result-to').textContent = to;
            document.getElementById('result-distance').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            document.getElementById('result-time').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Simulated delay (API call ki jagah)
            setTimeout(() => {
                const distance = (Math.random() * 100 + 10).toFixed(1);
                const time = (distance / 60).toFixed(1);

                document.getElementById('result-distance').textContent = `${distance} km`;
                document.getElementById('result-time').textContent = `${time} hours by car`;

                drawRouteOnMap();
            }, 1000);
        } else {
            document.getElementById('result-from').textContent = '-';
            document.getElementById('result-to').textContent = '-';
            document.getElementById('result-distance').textContent = 'Please fill both fields';
            document.getElementById('result-time').textContent = '-';
        }
    }

    // 4. Route ko map par draw karne ka simple function
    function drawRouteOnMap() {
        // Pehle wale markers aur route hatao
        if (fromMarker) map.removeLayer(fromMarker);
        if (toMarker) map.removeLayer(toMarker);
        if (routeLine) map.removeLayer(routeLine);

        const center = map.getCenter();

        const fromPoint = [center.lat + (Math.random() * 0.05 - 0.025), center.lng + (Math.random() * 0.05 - 0.025)];
        const toPoint = [center.lat + (Math.random() * 0.05 - 0.025), center.lng + (Math.random() * 0.05 - 0.025)];

        fromMarker = L.marker(fromPoint).addTo(map)
            .bindPopup(`From: ${document.getElementById('from').value}`)
            .openPopup();

        toMarker = L.marker(toPoint).addTo(map)
            .bindPopup(`To: ${document.getElementById('to').value}`);

        routeLine = L.polyline([fromPoint, toPoint], { color: '#2563eb', weight: 5 }).addTo(map);

        // Map ko adjust karo taki dono markers visible ho
        const bounds = L.latLngBounds([fromPoint, toPoint]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    // 5. Page load hone par initialize karo
    document.addEventListener('DOMContentLoaded', () => {
        initMap();

        document.getElementById('standard-view').addEventListener('click', () => changeMapView('standard'));
        document.getElementById('satellite-view').addEventListener('click', () => changeMapView('satellite'));
        document.getElementById('terrain-view').addEventListener('click', () => changeMapView('terrain'));

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', e => {
                if (e.key === 'Enter') calculateDistance();
            });
        });

        document.querySelector('.mobile-menu-button').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('show');
        });
    });


    