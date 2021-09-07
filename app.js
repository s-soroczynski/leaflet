const genIcon = url => {
    return L.icon({
        iconUrl: url,
        iconSize:     [32, 34],
        iconAnchor:   [16, 34],
        popupAnchor:  [0, -30] 
    });
}

const icons = {
    bombel: genIcon('./img/bombel.png'),
    bombelPls: genIcon('./img/bombelPls.gif'),
    dwarf: genIcon('./img/dwarf.png'),
    dwarfPls: genIcon('./img/dwarfPls.gif'),
    duck: genIcon('./img/duck.png'),
    duckPls: genIcon('./img/duckPls.gif'),
    twitch: genIcon('./img/twitch.png'),
    twitchPls: genIcon('./img/twitchPls.gif'),
    police: genIcon('./img/police.png'),
    policePls: genIcon('./img/policePls.gif'),
}

const map = L.map('mapid')

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 8,
    minZoom: 1,
}).addTo(map);


const addedGeoJSON = L.geoJSON(window.gJsonData, {
    style: function(feature) {
        return {
            color: '#000',
        }
    },
    onEachFeature: function(feature, layer) {
        if (feature.geometry.type === 'Point') {
            layer.bindPopup(feature.properties.description)
            layer.setIcon(icons[feature.properties.baseIcon])
        }
    }
}).addTo(map)

map.fitBounds(addedGeoJSON.getBounds());

map.on('mousemove', function(e) {
    const from = turf.point([e.latlng.lat, e.latlng.lng]);
    const options = {units: 'kilometers'};
    Object.values(e.target._layers).forEach(data => {
        if (data['_latlng'] && data['getIcon']) {
            const cords = data['_latlng'];
            const to = turf.point([cords.lat, cords.lng]);
            const distance = turf.distance(from, to, options);
            if (distance < 100) {
                if (data.getIcon().options.iconUrl !== icons[data.feature.properties.overIcon].options.iconUrl) {
                    data.setIcon(icons[data.feature.properties.overIcon])
                }
            } else {
                if (data.getIcon().options.iconUrl !== icons[data.feature.properties.baseIcon].options.iconUrl) {
                    data.setIcon(icons[data.feature.properties.baseIcon])
                }
            }
        }
    })

});

document.getElementById('home').addEventListener('click', () => {
    map.setView(addedGeoJSON.getBounds().getCenter())
});