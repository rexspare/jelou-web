/** @typedef {import('./types.google.map').Location} Location */

import isEmpty from "lodash/isEmpty";
import ow from "ow";

// const defaultLoaction = { lat: -0.938343, lng: -80.728828 } // Manta, Ecuador
const defaultLoaction = { lat: -2.1594806, lng: -79.8983175 }; // GYE, Ecuador

export class GoogleMaps {
    /** @type {google.maps} */
    map;

    /** @type {google.maps.marker} */
    marker = null;

    /**
     * @param {HTMLElement} mapElemente element where the map will be rendered
     * @param {InitalMarker} [initialMarker] marker to add to the map
     */
    async init(mapElemente, initialMarker = null) {
        ow(mapElemente, ow.object.nonEmpty);
        ow(mapElemente, ow.object.instanceOf(window.HTMLElement));

        this.map = new window.google.maps.Map(mapElemente, {
            zoom: 10,
            center: initialMarker || defaultLoaction,
            mapTypeControl: false,
            streetViewControl: false,
            keyboardShortcuts: false,
        });

        if (initialMarker) this.addMarker(initialMarker);
    }

    /**
     * @param {Location} location location to add marker
     */
    async addMarker(location) {
        ow(location, ow.object.nonEmpty);
        ow(location, ow.object.hasKeys("lat", "lng"));

        !isEmpty(this.marker) && this.removeMarker();

        this.marker = new window.google.maps.Marker({
            position: location,
            map: this.map,
        });

        const latLng = typeof location.lat === "function" ? { lat: location.lat(), lng: location.lng() } : location;

        return latLng;
    }

    removeMarker() {
        this.marker.setMap(null);
    }
}
