import { useMapEvents } from "react-leaflet";
import { useMapContext } from "../context/MapContext";

const MapEventHandler = () => {
  const { setSelectedRegion } = useMapContext();

  useMapEvents({
    click(e) {
      const newRegion = {
        id: Date.now(),
        name: "Region Seleccionada",
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        zoom: 10,
      };
      setSelectedRegion(newRegion);
    },
  });

  return null;
};

export default MapEventHandler;
