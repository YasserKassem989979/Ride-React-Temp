import mapboxgl from "mapbox-gl";

/**
 * @link https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/
 */

export default class LocationPicker {
    _id = null;
    // Map component
    _map = null;
    // Canvas Component
    _canvas = null;
    // Current point coordinates
    _coordinates = [];
    _options = {
        mainColor: "#f56",
        selectedColor: "#0f6",
        draggable: true,
    };
    _marker = null;

    // Draggable point geojson
    _geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [0, 0],
                },
            },
        ],
    };

    constructor(id, map, canvas, startCoordinates = [0, 0], options = {...this._options}) {
        console.log(options)
        this._id = id;
        this._canvas = canvas;
        this._map = map;
        this._options = { ...this._options, ...options };
        this._coordinates = startCoordinates;
        this._geojson.features[0].geometry.coordinates = startCoordinates;
        this._registerMapOnLoadEvent();
    }

    addElToPoint = (iconName = "map-marker-alt", iconSize = 24, color = "#05f") => {
        let icon = document.createElement("i");
        icon.className = "fas fa-" + iconName;
        icon.style.fontSize = iconSize + "px";
        icon.style.top = (-1 * iconSize) / 2 + "px";
        icon.style.color = color;

        this._marker = new mapboxgl.Marker(icon).setLngLat(this._coordinates).addTo(this._map);
        return this;
    };

    setLngLat = (lng, lat) => {
        this._coordinates = [lng, lat];
        this._marker.setLngLat([lng, lat]);
        this._geojson.features[0].geometry.coordinates = [lng, lat];
        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        this._map.getSource(this._id).setData(this._geojson);
        return this;
    };
    onCoordinatesChange = (lng, lat) => {};

    _onMove = (e) => {
        var coords = e.lngLat;

        // Set a UI indicator for dragging.
        this._canvas.style.cursor = "grabbing";
        this.setLngLat(coords.lng, coords.lat);
    };

    _onUp = (e) => {
        var coords = e.lngLat;
        this._coordinates = [coords.lng, coords.lat];
        this.onCoordinatesChange(coords.lng, coords.lat);
        // Unbind mouse/touch events
        this._map.off("mousemove", this._onMove);
        this._map.off("touchmove", this._onMove);
    };

    _registerMapOnLoadEvent = () => {
        console.log(this._id, this._options)
        if(!this._options.draggable) return;
        this._map.on("load", () => {
            // Add a single point to the map
                this._map.addSource(this._id, {
                    type: "geojson",
                    data: this._geojson,
                });

                this._map.addLayer({
                    id: this._id,
                    type: "circle",
                    source: this._id,
                    paint: {
                        "circle-radius": 15,
                        "circle-color": this._options.mainColor,
                        "circle-opacity": 0.5,
                    },
                });
            // When the cursor enters a feature in the point layer, prepare for dragging.
            this._map.on("mouseenter", this._id, () => {
                this._map.setPaintProperty(this._id, "circle-color", this._options.selectedColor);
                this._canvas.style.cursor = "move";
            });

            this._map.on("mouseleave", this._id, () => {
                this._map.setPaintProperty(this._id, "circle-color", this._options.mainColor);
                this._canvas.style.cursor = "";
            });

            this._map.on("mousedown", this._id, (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();

                this._canvas.style.cursor = "grab";

                this._map.on("mousemove", this._onMove);
                this._map.once("mouseup", this._onUp);
            });

            this._map.on("touchstart", this._id, (e) => {
                if (e.points.length !== 1) return;

                // Prevent the default map drag behavior.
                e.preventDefault();

                this._map.on("touchmove", this._onMove);
                this._map.once("touchend", this._onUp);
            });
        });
    
    };

}
