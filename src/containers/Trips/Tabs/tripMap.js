import React, { PureComponent } from "react";
import ReactMapboxGl, { Layer, Feature, Source, MapContext } from "react-mapbox-gl";
import styles from "./trips.module.css";
import mapboxgl from "mapbox-gl";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiYW1yLXJpZGUiLCJhIjoiY2sxaHQ2M295MDdwZTNwcnBlYWNneXNmZyJ9.d53qwDFOZZKS3aipjTeN2Q"
});

export class TripMap extends PureComponent {
    state = {
        riderSource: {},
        tripSource: {},
        riderMarker: [],
        tripMarker: [],
        endMarker: [],
        center: [35.8439, 31.9754]
    };

    componentDidMount() {
        this.getCoordinates();
    }

    getCoordinates = () => {
        let toRiderCoordinates = [];
        let tripCoordinates = [];
        if (this.props.path && this.props.path.on_rider_way_points) {
            toRiderCoordinates = this.props.path.on_rider_way_points.map(point => {
                return [point.longitude, point.latitude];
            });
        }
        if (this.props.path && this.props.path.trip_points) {
            tripCoordinates = this.props.path.trip_points.map(point => {
                return [point.longitude, point.latitude];
            });
        }

        let riderSource = {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: toRiderCoordinates
                }
            }
        };

        let tripSource = {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: tripCoordinates
                }
            }
        };

        this.setState({
            riderSource,
            tripSource,
            riderMarker: toRiderCoordinates.length > 0 ? toRiderCoordinates[0] : [0, 0],
            tripMarker: tripCoordinates.length > 0 ? tripCoordinates[0] : [0, 0],
            endMarker: tripCoordinates.length > 0 ? tripCoordinates[tripCoordinates.length - 1] : [0, 0],
            center: toRiderCoordinates.length > 0 ? toRiderCoordinates[0] : [35.8439, 31.9754]
        });
    };

    render() {
        return (
            <div className={styles.mapCont}>
                <Map
                    style='mapbox://styles/mapbox/streets-v9'
                    containerStyle={{
                        height: "100%",
                        display: "flex",
                        direction: "ltr"
                    }}
                    center={this.state.center}>
                    <MapContext.Consumer>
                        {map => {
                            map.addControl(new mapboxgl.FullscreenControl());
                        }}
                    </MapContext.Consumer>

                    <Source id='rider' tileJsonSource={this.state.riderSource} />

                    <Layer
                        type='line'
                        sourceId='rider'
                        id='OnWayTorider'
                        layout={{ "line-join": "round", "line-cap": "round" }}
                        paint={{
                            "line-color": "#A0F",
                            "line-width": 5
                        }}></Layer>
                    <Source id='trip' tileJsonSource={this.state.tripSource} />
                    <Layer
                        type='line'
                        sourceId='trip'
                        id='duringTrip'
                        layout={{ "line-join": "round", "line-cap": "round" }}
                        paint={{
                            "line-color": "green",
                            "line-width": 5
                        }}></Layer>
                    <Layer type='symbol' id='riderMarker' layout={{ "icon-image": "car-15" }} style={{ color: "red" }}>
                        <Feature coordinates={this.state.riderMarker} />
                    </Layer>
                    <Layer type='symbol' id='tripMarker' layout={{ "icon-image": "toilet-15" }}>
                        <Feature coordinates={this.state.tripMarker} />
                    </Layer>

                    <Layer type='symbol' id='endMarker' layout={{ "icon-image": "embassy-15" }}>
                        <Feature style={{ width: 50 }} coordinates={this.state.endMarker} />
                    </Layer>
                </Map>
            </div>
        );
    }
}

export default TripMap;
