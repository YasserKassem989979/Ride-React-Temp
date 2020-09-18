import React, { PureComponent } from "react";
import styles from "./ManualDispatch.module.css";
import mapboxgl from "mapbox-gl";
import { translate } from "../../utils/translate";
import LocationPicker from "./LocationPicker";
import { DispatchContext } from "./ManualDispatchContainer";
import { Box, Link, Typography } from "@material-ui/core";
import MapPinIcon from "@material-ui/icons/PinDropOutlined";
import DirectionsIcon from '@material-ui/icons/Directions';



let map = null;
let canvas = null;
let pickupMarker = null;
let dropMarker = null;


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
    };
};

// https://www.google.com/maps/place/31.980967380330334,35.7937334664166
// https://www.google.com/maps/dir/31.9410098,35.9305569/31.9172429,35.8702189

const GoogleMapsOptions = ({ pickupCoords, pickupPlace, dropCoords, dropPlace, style, className }) => {
    return (
        <Box style={style} className={className}>
            {pickupCoords ? (
                <Box style={{ flexDirection: "row" }}>
                    <MapPinIcon style={{ color: "#05f" }} />

                    <Link target='_blank' rel='noopener' href={`https://www.google.com/maps/place/${pickupCoords.lat},${pickupCoords.lng}`}>
                        {pickupPlace || "Pickup"}
                    </Link>
                </Box>
            ) : null}

            {dropCoords ? (
                <Box style={{ flexDirection: "row" }}>
                    <MapPinIcon style={{ color: "#0a0" }} />

                    <Link target='_blank' rel='noopener' href={`https://www.google.com/maps/place/${dropCoords.lat},${dropCoords.lng}`}>
                        {dropPlace || "Drop"}
                    </Link>
                </Box>
            ) : null}

            {
                dropCoords && pickupCoords
                    ? (
                        <Box style={{ flexDirection: "row" }}>
                            <DirectionsIcon style={{ color: "#a59" }} />

                            <Link target='_blank' rel='noopener' href={`https://www.google.com/maps/dir/${pickupCoords.lat},${pickupCoords.lng}/${dropCoords.lat},${dropCoords.lng}`}>
                                {translate("DIRECTIONS")}
                            </Link>
                        </Box>
                    )
                    : null
            }
        </Box>
    );
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
        canvas = map.getCanvasContainer();
        // Create Draggable point (Location Picker)
        pickupMarker = new LocationPicker("tripStart", map, canvas, [0, 0]);
        pickupMarker.addElToPoint();
        pickupMarker.onCoordinatesChange = this._handlePickupCoordinatesChange;

        dropMarker = new LocationPicker("tripEnd", map, canvas, [0, 0]);
        dropMarker.addElToPoint(undefined, undefined, "#0a0");
        dropMarker.onCoordinatesChange = this._handleDropCoordinatesChange;

        map.on("dragend", (e) => {
            this.props.onMapCenterChanged(e.target.getCenter());
        });
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

    _handlePickupCoordinatesChange = (lng, lat) => {
        this.props.onPickupFromMap(lng, lat);
    };
    _handleDropCoordinatesChange = (lng, lat) => {
        this.props.onDropFromMap(lng, lat);
    };

    updateMap = () => {
        const { pickup, drop, radiusInKm } = this.props;

        if ((!map.getLayer("pickup_radius") || !map.getSource("pickup_radius")) && pickup)
            map.addLayer({
                id: "pickup_radius",
                type: "fill",
                source: {
                    type: "geojson",
                    data: createGeoJSONCircle([pickup.lng, pickup.lat], radiusInKm || 3),
                },
                layout: {},
                paint: {
                    "fill-color": "#48d",
                    "fill-opacity": 0.3,
                },
            });

        if (pickup) {
            pickupMarker.setLngLat(pickup.lng, pickup.lat);
            map.getSource("pickup_radius").setData(createGeoJSONCircle([pickup.lng, pickup.lat], radiusInKm || 3));
        }

        if (drop) {
            dropMarker.setLngLat(drop.lng, drop.lat);
        }
    };

    render() {
        const { time_estimate, amount_estimate, distance_estimate, pickup, drop } = this.props;
        return (
            <DispatchContext.Consumer>
                {(values) => (
                    <div className={styles.mapWrapper}>
                        <GoogleMapsOptions
                            className={styles.googleLinks}
                            pickupCoords={pickup}
                            dropCoords={drop}
                            pickupPlace={values.state.pick_up_location}
                            dropPlace={values.state.drop_location}
                        />
                        <div id='mapdispatch' style={{ width: "100%", height: "100%", direction: "ltr", position: "relative" }}>
                            <div className={styles.mapCenter}>
                                <i className='fas fa-plus' />
                            </div>
                            <div id='redbox' className={styles.manualdispatchEstimateBox}>
                                <Typography component="h6" variant="h6" >{translate("ESTIMATE")}</Typography>
                                <Typography>{time_estimate} </Typography>
                                <Typography>{distance_estimate} </Typography>
                                <Typography>{amount_estimate} </Typography>
                            </div>

                        </div>
                    </div>
                )}
            </DispatchContext.Consumer>
        );
    }
}

export default ManualDispatchMap;
