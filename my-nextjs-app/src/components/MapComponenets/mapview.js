import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

// Use a fallback token if the environment variable is not available
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrbDlsNnlwbzFwYTUyb3A3Z21jZTQwYmIifQ.kCKsR-BsSK0McnQhN6O5YQ';

export default function MapView({ centers, returns, loading, activeCenter, onCenterChange, getReturnType }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  // Add a ref to track if sources have been added
  const sourcesAdded = useRef(false);
  const markersRef = useRef([]);

  // Initialize map when component mounts
  useEffect(() => {
    // Import mapboxgl dynamically to avoid SSR issues
    const initializeMap = async () => {
      try {
        // Don't re-initialize if map exists
        if (map.current) return;
        
        // Dynamic import to avoid server-side rendering issues
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        // Set the access token
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        
        // Check if WebGL is supported
        if (!mapboxgl.supported()) {
          setMapError('Your browser does not support WebGL, which is required for the map.');
          return;
        }
        
        // Create map instance
        console.log("Initializing map...");
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/standard',
          center: [-95, 40], // Centered on continental US
          zoom: 3.5,
          preserveDrawingBuffer: true
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Setup map layers when loaded
        map.current.on('load', () => {
          console.log("Map loaded successfully");
          // Check if source already exists to prevent duplicate source error
          if (!map.current.getSource('routes') && !sourcesAdded.current) {
            // Add source for routes
            map.current.addSource('routes', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });
            
            // Add line layer for routes
            map.current.addLayer({
              id: 'routes',
              type: 'line',
              source: 'routes',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': [
                  'match',
                  ['get', 'category'],
                  'Resale', '#10b981', // green for resale
                  'Refurbishment', '#3b82f6', // blue for refurbishment
                  'Recycle', '#f59e0b', // amber for recycle
                  'Damaged/Write-off', '#ef4444', // red for damaged
                  '#9ca3af' // gray default
                ],
                'line-width': [
                  'match',
                  ['get', 'method'],
                  'air', 4,
                  'express', 3,
                  2 // ground shipping
                ],
                'line-opacity': 0.7,
                'line-dasharray': [
                  'match',
                  ['get', 'status'],
                  'In Process', [2, 1],
                  'Under Review', [1, 1],
                  [1, 0] // solid line for processed
                ]
              }
            });
            
            // Mark sources as added
            sourcesAdded.current = true;
          }
          
          setMapReady(true);
        });
        
        // Error handling
        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError('An error occurred while loading the map.');
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize the map. Please check your Mapbox token.');
      }
    };
    
    initializeMap();
    
    // Use a cleanup function to prevent memory leaks
    return () => {
      // Clean up any markers that have been created
      if (markersRef.current && markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.remove();
        });
        markersRef.current = [];
      }
      
      // Don't remove the map on cleanup - let it persist
    };
  }, []); // Empty dependency array means this only runs once

  // Add center markers and return markers when map is ready
  useEffect(() => {
    if (!map.current || !mapReady || !centers || centers.length === 0) return;
    
    const addMarkers = async () => {
      try {
        // Dynamic import to access mapboxgl
        const mapboxgl = (await import('mapbox-gl')).default;
        
        // Clear any existing markers
        markersRef.current.forEach(marker => {
          if (marker) marker.remove();
        });
        markersRef.current = [];
        
        // Add center markers
        centers.forEach(center => {
          const { lat, lng } = center.location.coordinates;
          
          // Create marker element
          const el = document.createElement('div');
          el.className = 'w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg';
          el.innerHTML = '<div class="w-4 h-4 bg-white rounded-full"></div>';
          
          // Add marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-3">
                  <h3 class="font-bold text-sm">${center.name}</h3>
                  <p class="text-xs text-gray-700">${center.location.city}, ${center.location.state}</p>
                  <div class="mt-2 pt-2 border-t border-gray-200 text-xs">
                    <p><span class="font-medium">Processing:</span> ${center.metrics.averageProcessingTime} days</p>
                    <p><span class="font-medium">Daily Volume:</span> ${center.metrics.dailyReturnVolume} items</p>
                  </div>
                </div>
              `)
            )
            .addTo(map.current);
            
          markersRef.current.push(marker);
        });
        
        // Add return origin markers
        returns.forEach(item => {
          // Check if the return has origin coordinates
          if (!item.origin?.coordinates) return;
          
          const { lat, lng } = item.origin.coordinates;
          const returnType = getReturnType(item);
          
          // Create marker element
          const el = document.createElement('div');
          el.className = `w-4 h-4 rounded-full shadow-sm ${getReturnMarkerColor(returnType)}`;
          
          // Add marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 15 }).setHTML(`
                <div class="p-2 text-xs">
                  <p class="font-bold">${item.customerName}</p>
                  <p class="text-gray-700">${item.origin.city}, ${item.origin.state}</p>
                  <p class="mt-1">${item.items[0]?.name || 'Unknown item'}</p>
                  <div class="mt-1 pt-1 border-t border-gray-200">
                    <p class="text-gray-700">Status: <span class="font-medium">${item.status}</span></p>
                    <p class="text-gray-700">Type: <span class="font-medium">${returnType}</span></p>
                  </div>
                </div>
              `)
            )
            .addTo(map.current);
            
          markersRef.current.push(marker);
        });
        
        // Update routes
        updateRoutes();
      } catch (error) {
        console.error('Error adding markers:', error);
        setMapError('Failed to add markers to the map.');
      }
    };
    
    addMarkers();
  }, [centers, returns, mapReady, getReturnType]);

  // Update routes when activeCenter changes
  useEffect(() => {
    if (!map.current || !mapReady) return;
    
    const updateActiveCenter = async () => {
      try {
        if (activeCenter) {
          // Focus map on the selected center
          map.current.flyTo({
            center: [activeCenter.location.coordinates.lng, activeCenter.location.coordinates.lat],
            zoom: 5,
            duration: 1500
          });
          
          // Highlight routes for this center
          highlightCenterRoutes(activeCenter.id);
        } else {
          // Reset view
          map.current.flyTo({
            center: [-95, 40],
            zoom: 3.5,
            duration: 1500
          });
          
          // Reset route styling if the layer exists
          if (map.current.getLayer('routes')) {
            map.current.setPaintProperty('routes', 'line-opacity', 0.7);
            map.current.setPaintProperty('routes', 'line-width', [
              'match',
              ['get', 'method'],
              'air', 4,
              'express', 3,
              2 // ground shipping
            ]);
          }
        }
      } catch (error) {
        console.error('Error updating active center:', error);
      }
    };
    
    updateActiveCenter();
  }, [activeCenter, mapReady]);

  // Update route lines on the map
  const updateRoutes = () => {
    if (!map.current) return;
    
    try {
      // Wait for map to be ready
      if (!map.current.loaded()) {
        console.log("Map not loaded yet, delaying route update");
        setTimeout(updateRoutes, 100);
        return;
      }
      
      // Check if the source exists before trying to update it
      if (!map.current.getSource('routes')) {
        console.warn('Routes source not found, cannot update routes');
        return;
      }
      
      const routeFeatures = returns
        .filter(item => item.origin?.coordinates && item.processingLocation)
        .map(item => {
          const destCenter = centers.find(center => center.id === item.processingLocation);
          if (!destCenter) return null;
          
          return {
            type: 'Feature',
            properties: {
              id: item.id,
              category: getReturnType ? getReturnType(item) : 'Unknown',
              status: item.status,
              center: item.processingLocation,
              method: item.shipping?.method || 'ground'
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [item.origin.coordinates.lng, item.origin.coordinates.lat],
                [destCenter.location.coordinates.lng, destCenter.location.coordinates.lat]
              ]
            }
          };
        })
        .filter(Boolean);
      
      // Update the route source data
      map.current.getSource('routes').setData({
        type: 'FeatureCollection',
        features: routeFeatures
      });
    } catch (error) {
      console.error('Error updating routes:', error);
    }
  };

  // Highlight routes for a specific center
  const highlightCenterRoutes = (centerId) => {
    if (!map.current) return;
    
    try {
      // Check if the layer exists before updating it
      if (!map.current.getLayer('routes')) {
        console.warn('Routes layer not found, cannot highlight routes');
        return;
      }
      
      map.current.setPaintProperty('routes', 'line-opacity', [
        'match',
        ['get', 'center'],
        centerId, 0.9, // Selected center routes
        0.2 // Other routes
      ]);
      
      map.current.setPaintProperty('routes', 'line-width', [
        'case',
        ['==', ['get', 'center'], centerId],
        [
          'match',
          ['get', 'method'],
          'air', 6,
          'express', 5,
          4 // ground shipping
        ],
        [
          'match',
          ['get', 'method'],
          'air', 2,
          'express', 1.5,
          1 // ground shipping
        ]
      ]);
    } catch (error) {
      console.error('Error highlighting routes:', error);
    }
  };

  const resetView = () => {
    onCenterChange(null);
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-100"
        style={{ width: '100%', height: '100%' }}
      />
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {!mapReady && !loading && !mapError && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
          <div className="text-gray-700 font-medium">Initializing map...</div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
          <div className="bg-red-50 text-red-700 p-4 rounded-md max-w-md text-center">
            <h3 className="font-bold mb-2">Map Error</h3>
            <p>{mapError}</p>
            <p className="text-sm mt-2">
              Please check your Mapbox access token and ensure your browser supports WebGL.
            </p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-16 z-10">
        <button 
          onClick={resetView}
          className="px-3 py-1.5 bg-white shadow-md text-indigo-700 rounded-md text-sm font-medium flex items-center hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" /> 
          Reset View
        </button>
      </div>
    </div>
  );
}

// Helper Functions
function getReturnMarkerColor(category) {
  switch (category) {
    case 'Resale': return 'bg-emerald-500';
    case 'Refurbishment': return 'bg-blue-500';
    case 'Recycle': return 'bg-amber-500';
    case 'Damaged/Write-off': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}