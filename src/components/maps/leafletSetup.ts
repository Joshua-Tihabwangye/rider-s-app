import L from "leaflet";

// Ensure default Leaflet markers resolve from app-owned public assets.
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/map-icons/leaflet/marker-icon-2x.png",
  iconUrl: "/map-icons/leaflet/marker-icon.png",
  shadowUrl: "/map-icons/leaflet/marker-shadow.png"
});
