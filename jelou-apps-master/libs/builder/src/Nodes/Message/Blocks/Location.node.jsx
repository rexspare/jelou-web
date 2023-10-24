import { Switch } from "@builder/common/Headless/conditionalRendering";

const GOOGLE_MAPS_APPI_KEY = process.env.NX_REACT_APP_GOOGLE_MAPS_APPI_KEY;
/**
 * @param {{
 * data: LocationBlock
 * }} props
 */
export const Location = ({ data }) => {
    const { coordinates } = data;
    const { latitude, longitude } = coordinates;

    return (
        <div className="rounded-md bg-white p-2 text-gray-400">
            <Switch>
                <Switch.Case condition={latitude && longitude}>
                    <img
                        alt="Ubicación"
                        crossOrigin="anonymous"
                        className="mb-2 w-auto rounded-lg"
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=270x200&markers=${latitude},${longitude}&key=${GOOGLE_MAPS_APPI_KEY}`}
                    />
                </Switch.Case>

                <Switch.Default>
                    <div className="shadow-nodo min-h-20">
                        <span className="text-13 font-light text-gray-340">Configura la ubicación</span>
                    </div>
                </Switch.Default>
            </Switch>
        </div>
    );
};
