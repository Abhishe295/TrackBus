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
  isLiveBus,
}) => {
  const hasBus =
    busLocation &&
    typeof busLocation.lat === "number" &&
    typeof busLocation.lng === "number";

  const center = hasBus
    ? [busLocation.lat, busLocation.lng]
    : [28.6139, 77.2090]; // neutral fallback

  return (
    <div className="w-full">
      {/* Header stays same */}

      <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] relative">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🚌 Bus */}
          {hasBus && (
            <Marker
              position={[busLocation.lat, busLocation.lng]}
              icon={busIcon}
            />
          )}

          {/* 👤 User */}
          {userLocation && !(isSharing&&isLiveBus) && (
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

          {/* Fly only when bus exists */}
          {hasBus && <MapUpdater location={busLocation} />}
        </MapContainer>

        {!hasBus && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-[500]">
            <div className="alert alert-info shadow-lg max-w-sm">
              <Info className="w-5 h-5" />
              <span>Waiting for live bus location…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;