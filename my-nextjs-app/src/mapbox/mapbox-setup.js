// Install the following packages:
// npm install mapbox-gl @turf/turf

// In your HTML file, add these in the head section:
// <link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
// <script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>

// Create a div element with an id of 'map' and set its height and width:
// <div id="map" style="width: 100%; height: 600px;"></div>

// Main JavaScript for initializing Mapbox
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

// You'll need to get a Mapbox access token
// Sign up at https://www.mapbox.com/ and create a token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11', // Use a dark theme for better visualization
  center: [-79.3832, 43.6532], // Center on Toronto
  zoom: 10,
  pitch: 45, // Add 3D perspective
  bearing: 0,
  antialias: true // Smoother edges
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// Wait for the map to load
map.on('load', () => {
  // Enable 3D buildings and terrain
  map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
  });
  
  // Add 3D terrain
  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
  
  // Add 3D building layer
  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
    }
  });

  console.log('Map initialized with 3D buildings and terrain');
});

// Function to fly to a specific location
function flyTo(center, zoom = 12) {
  map.flyTo({
    center: center,
    zoom: zoom,
    essential: true,
    duration: 2000
  });
}

// Export functions and map for use in other components
export { map, flyTo };