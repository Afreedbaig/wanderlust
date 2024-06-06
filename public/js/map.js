// console.log(coordinates);

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
let MapToken = mapToken;
// console.log(mapToken);
mapboxgl.accessToken = MapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);

const popup = new mapboxgl.Popup({
  offset: 25,
})
  .setLngLat(coordinates)
  .setHTML("<p>you will be staying here</p")
  .setMaxWidth("300px")
  .addTo(map);
