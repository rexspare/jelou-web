/** @typedef {import('@googlemaps/js-api-loader').Loader} LoaderC */

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";

import { TYPE_ERRORS, renderMessage } from "../../../../common/Toastify";
import { GoogleMaps as GoogleM } from "../../../../libs/Google/Google.map";

const apiKey = process.env["NX_REACT_APP_GOOGLE_MAPS_APPI_KEY"];

/** @type {LoaderC} */
let loader;

/** @type {GoogleM} */
let googleMap;

/**
 * @param {{
 * onChange: (coordinates: LocationBlock['coordinates']) => void,
 * initialMarker?: InitalMarker
 * }} props
 */
export const GoogleMaps = ({ onChange, initialMarker = null }) => {
    useEffect(() => {
        if (!window?.google) {
            loader = new Loader({
                apiKey,
                version: "weekly",
            });
        }

        loader.load().then(() => {
            googleMap = new GoogleM();
            googleMap.init(document.getElementById("map"), initialMarker).catch((error) => {
                console.error("Error al iniciar el mapa", error);
                renderMessage("Tuvimos un error al intentar cargar el mapa, por favor refresque la página", TYPE_ERRORS.ERROR);
            });

            window.google.maps.event.addListener(googleMap.map, "click", (event) => {
                googleMap
                    .addMarker(event.latLng)
                    .then(({ lat, lng }) => onChange({ latitude: String(lat), longitude: String(lng) }))
                    .catch((error) => {
                        console.error("Error al agregar el marcador", error);
                        renderMessage("Tuvimos un error al intentar agregar el marcador, por favor refresque la página", TYPE_ERRORS.ERROR);
                    });
            });
        });

        return () => {
            window?.google && window.google.maps.event.clearListeners(googleMap?.map, "click");
        };
    }, []);

    return <div className="h-72 rounded-10" id="map" />;
};
