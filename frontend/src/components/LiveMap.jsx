import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapPin, Navigation, Info } from "lucide-react";

// =============================
// DEFAULT BUS MARKER
// =============================
delete L.Icon.Default.prototype._getIconUrl;
const busIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// =============================
// USER MARKER (BLUE DOT)
// =============================
const userIcon = new L.DivIcon({
  html: `
    <div style="
      width:14px;
      height:14px;
      background:#2563eb;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 6px rgba(0,0,0,0.4);
    "></div>
  `,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// =============================
// MAP CONTROLLER
// =============================
const MapUpdater = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number"
    ) {
      map.flyTo([location.lat, location.lng], map.getZoom(), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [location, map]);

  return null;
};

// =============================
// MAIN MAP
// =============================
const LiveMap = ({
  busLocation,
  path = [],
  userLocation,
  isSharing,
}) => {
  const hasBus =
    busLocation &&
    typeof busLocation.lat === "number" &&
    typeof busLocation.lng === "number";

  if (!hasBus) {
    return (
      <div className="w-full p-6 sm:p-8">
        <div className="alert alert-info shadow-lg">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Waiting for live location</h3>
              <p className="text-xs sm:text-sm opacity-80 mt-1">The bus location will appear here once tracking starts</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map Header */}
      <div className="bg-base-100 px-4 py-3 border-b border-base-300">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-base-content">Live Location</h3>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bus Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-error/10 rounded-full">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-error">Bus</span>
            </div>
            
            {/* User Indicator (only if NOT sharing) */}
            {userLocation && !isSharing && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
                <Navigation className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">You</span>
              </div>
            )}

            {/* Path Indicator */}
            {Array.isArray(path) && path.length > 1 && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-info/10 rounded-full">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <span className="text-xs font-medium text-info">Route</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] relative">
        <MapContainer
          center={[busLocation.lat, busLocation.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🚌 Bus */}
          <Marker
            position={[busLocation.lat, busLocation.lng]}
            icon={busIcon}
          />

          {/* 👤 User (only if NOT sharing) */}
          {userLocation && !isSharing && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            />
          )}

          {/* 🧵 Path */}
          {Array.isArray(path) && path.length > 1 && (
            <Polyline
              positions={path.map((p) => [p.lat, p.lng])}
              color="#2563eb"
              weight={4}
              opacity={0.9}
            />
          )}

          <MapUpdater location={busLocation} />
        </MapContainer>

        {/* Mobile Zoom Hint */}
        {/* <div className="absolute bottom-4 right-4 z-[1000] sm:hidden">
          <div className="badge badge-sm bg-base-100/90 backdrop-blur-sm border-base-300 text-base-content/70">
            Pinch to zoom
          </div>
        </div> */}
      </div>

      {/* Map Footer Info */}
      {/* <div className="bg-base-100 px-4 py-2 border-t border-base-300">
        <div className="flex items-center justify-between text-xs sm:text-sm text-base-content/60">
          <span>Real-time tracking active</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
            Live
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default LiveMap;