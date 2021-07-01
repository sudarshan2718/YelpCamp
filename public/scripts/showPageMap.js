
mapboxgl.accessToken = mapToken;
cords = camp.geometry.coordinates;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: cords, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
const marker = new mapboxgl.Marker()
    .setLngLat(cords)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${camp.title}</h3>`
        )
    )
    .addTo(map)
