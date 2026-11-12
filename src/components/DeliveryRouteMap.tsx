import { MapPin, ArrowUpRight } from "lucide-react";
import { ViewOnMap } from "./reference/ViewOnMap";

export function DeliveryRouteMap({
  pickup,
  destination,
}: {
  pickup?: string;
  destination?: string;
}) {
  const origin = pickup?.trim();
  const end = destination?.trim();
  if (!origin || !end) return null;
  const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(end)}&travelmode=driving`;
  return (
    <div className="delivery-route-map">
      <ViewOnMap
        buttonLabel="Ver trajeto"
        content={
          <div className="delivery-route-content">
            <span className="eyebrow">TRAJETO DA ENTREGA</span>
            <h2>Da coleta ao destino</h2>
            <ol>
              <li>
                <MapPin size={19} aria-hidden="true" />
                <div>
                  <small>Coleta</small>
                  <strong>{origin}</strong>
                </div>
              </li>
              <li>
                <MapPin size={19} aria-hidden="true" />
                <div>
                  <small>Destino</small>
                  <strong>{end}</strong>
                </div>
              </li>
            </ol>
            <p>Consulte o mapa e as direções no Google Maps.</p>
            <a href={routeUrl} target="_blank" rel="noopener noreferrer">
              Abrir trajeto no Google Maps <ArrowUpRight size={17} />
            </a>
          </div>
        }
      />
    </div>
  );
}
