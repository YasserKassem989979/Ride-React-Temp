import React, { PureComponent } from "react";
import styles from "./ManualDispatch.module.css";
import mapboxgl from "mapbox-gl";
import { translate } from "../../utils/translate";
import LocationPicker from "./LocationPicker";

let map = null;
var createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0],
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    var distanceY = km / 110.574;

    var theta, x, y;
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [ret],
                    },
                },
            ],
        },
    };
};
export class ManualDispatchMap extends PureComponent {
    componentDidMount() {
        // initilaize map
        map = new mapboxgl.Map({
            container: "mapdispatch",
            style: "mapbox://styles/mapbox/streets-v8",
            zoom: 9,
            center: [35.8439, 31.9754],
        });
        var canvas = map.getCanvasContainer();

        // // Create Draggable point (Location Picker)
        // const pickupMarker = new LocationPicker("point1", map, canvas, [35.8439, 31.9754]);
        // pickupMarker.addElToPoint("map-marker-alt", 40, "#050")
        // pickupMarker.onCoordinatesChange = console.log
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.drop !== this.props.drop ||
            prevProps.pickup !== this.props.pickup ||
            prevProps.radiusInKm !== this.props.radiusInKm
        ) {
            this.updateMap();
        }
    }

    updateMap = () => {
        const { pickup, drop, radiusInKm } = this.props;

        // to remove the layers and sourcers if they are exsit because yo can't add layers with same id
        if (map.getLayer("tripStart")) map.removeLayer("tripStart");
        if (map.getLayer("tripEnd")) map.removeLayer("tripEnd");
        if (map.getLayer("pickup_radius")) map.removeLayer("pickup_radius");
        if (map.getSource("pickup_radius")) map.removeSource("pickup_radius");
        if (map.getSource("tripStart")) map.removeSource("tripStart");
        if (map.getSource("tripEnd")) map.removeSource("tripEnd");

        // some waiting
        setTimeout(() => {
            // add start and end markers
            if (pickup)
                map.addLayer({
                    id: "pickup_radius",
                    type: "fill",
                    source: createGeoJSONCircle([pickup.lng, pickup.lat], radiusInKm || 3),
                    layout: {},
                    paint: {
                        "fill-color": "#48d",
                        "fill-opacity": 0.6,
                    },
                });
            if (pickup)
                map.addLayer({
                    id: "tripStart",
                    type: "symbol",
                    source: {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    geometry: {
                                        type: "Point",
                                        coordinates: [pickup.lng, pickup.lat],
                                    },
                                },
                            ],
                        },
                    },

                    layout: { "icon-image": "toilet-15" },
                    paint: {
                        "icon-color": "#f05",
                    },
                });

            if (drop)
                map.addLayer({
                    id: "tripEnd",
                    type: "symbol",
                    source: {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: [
                                {
                                    type: "Feature",
                                    geometry: {
                                        type: "Point",
                                        coordinates: [drop.lng, drop.lat],
                                    },
                                },
                            ],
                        },
                    },
                    layout: { "icon-image": "embassy-15" },
                });
        }, 500);
    };

    render() {
        const { time_estimate, amount_estimate, distance_estimate } = this.props;
        return (
            <div className={styles.mapWrapper}>
                <div id='mapdispatch' style={{ width: "100%", height: "100%", direction: "ltr", position: "relative" }}>
                    <div id='redbox' className={styles.manualdispatchEstimateBox}>
                        <p>{translate("ESTIMATE")}:</p>
                        <p>{time_estimate} </p>
                        <p>{distance_estimate} </p>
                        <p>{amount_estimate} </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManualDispatchMap;
