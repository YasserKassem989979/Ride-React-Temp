import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ManualDispatch.module.css";
import DispatchForm from "./manualDispatchForm";
import axios from "../../axios";
import Alert from "../../components/Alert/alert";
import MapDispatch from "./manualDispatchMap";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import { Slide } from "@material-ui/core";
import { translate } from "../../utils/translate";
export const DispatchContext = React.createContext("");
export class ManualDispatchContainer extends Component {
    state = {
        phone: "",
        isLoading: false,
        rider: null,
        ride_time: 1,
        area: "selected",
        areas: [],
        service_type: "selected",
        vehicle_type: 23,
        pick_up_location: "",
        drop_location: "",
        payment_method: "selected",
        promo_code: "selected",
        radius: 3,
        phone_error: false,
        area_error: false,
        service_type_error: false,
        vehicle_type_error: false,
        pick_up_location_error: false,
        drop_location_error: false,
        payment_method_error: false,
        radius_error: false,
        areaDetails: null,
        isLoadingArea: false,
        selectedLaterDate: new Date(),
        selectedTime: new Date(),
        selected_pickup_location: "",
        loadingPickupLocations: false,
        pickup_locations: [],
        pickup_location_coordinates: null,
        selected_drop_location: "",
        loadingDropLocations: false,
        drop_locations: [],
        drop_location_coordinates: null,
        time_estimate: "",
        amount_estimate: "",
        distance_estimate: "",
        isDispatching: false,
        mapCenter: { lng: 35.8439, lat: 31.9754 },
    };

    componentDidMount() {
        this.getAreas();
        this.props.changeCurrentPageName(this.props.location.pathname);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.area !== this.state.area) {
            this.getArea();
        }
        if (prevState.pick_up_location !== this.state.pick_up_location) {
            this.onOpenClosePickLocations();
        }
        if (prevState.drop_location !== this.state.drop_location) {
            this.onOpenCloseDropLocations();
        }
        if (this.state.selected_pickup_location && prevState.selected_pickup_location !== this.state.selected_pickup_location) {
            this.getPickPlaceDetails();
        }
        if (this.state.selected_drop_location && prevState.selected_drop_location !== this.state.selected_drop_location) {
            this.getDropPlaceDetails();
        }
        if (
            this.state.pickup_location_coordinates &&
            this.state.drop_location_coordinates &&
            prevState.drop_location_coordinates !== this.state.drop_location_coordinates
        ) {
            this.estimateTrip();
        }
        if (
            this.state.drop_location_coordinates &&
            this.state.pickup_location_coordinates &&
            prevState.pickup_location_coordinates !== this.state.pickup_location_coordinates
        ) {
            this.estimateTrip();
        }
        if (this.state.promo_code && prevState.promo_code !== this.state.promo_code) {
            this.estimateTrip();
        }
    }

    onChangeText = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            [`${e.target.name}_error`]: false,
        });
    };

    // ride now or ride later handler
    onChangeRideTime = (e) => {
        this.setState({ ride_time: Number(e.target.value) });
    };

    // date of ride late
    handleDateChange = (date) => {
        this.setState({ selectedLaterDate: date });
    };

    // time of ride later
    handleTimeChange = (time) => {
        this.setState({ selectedTime: time });
    };

    _geocode = (lng, lat) => {
        return axios
            .get("/manual_dispatch/geocode", {
                params: {
                    lng,
                    lat,
                },
            })
            .then((response) => {
                return response.data.data.results[0].formatted_address;
            });
    };

    _handlePickupFromMap = (lng, lat) => {
        this._geocode(lng, lat).then((placeName) => {
            this.setState({
                pickup_location_coordinates: { lng, lat },
                pick_up_location: placeName,
            });
        });
    };

    _handleDropFromMap = (lng, lat) => {
        this._geocode(lng, lat).then((placeName) => {
            this.setState({
                drop_location_coordinates: { lng, lat },
                drop_location: placeName,
            });
        });
    };

    _handleOnMapCenterChanged = (coords) => {
        this.setState({
            mapCenter: coords,
        });
    };

    // when the user starting to type on pick up location field, if the length greater than 3 fetch the suggested lcations
    onOpenClosePickLocations = (e) => {
        const name = this.state.pick_up_location.trim().length;
        if (name >= 3) {
            this.setState({ loadingPickupLocations: true });
            axios
                .get("/manual_dispatch/auto_complete", {
                    params: {
                        input: this.state.pick_up_location,
                    },
                })
                .then((res) => {
                    this.setState({
                        pickup_locations: res.data.data.predictions,
                        loadingPickupLocations: false,
                    });
                })
                .catch((err) => {
                    this.setState({ loadingPickupLocations: false });
                });
        }
    };

    // when the user starting to type on drop location field, if the length greater than 3 fetch the suggested lcations
    onOpenCloseDropLocations = (e) => {
        const name = this.state.drop_location.trim().length;
        if (name >= 3) {
            this.setState({ loadingDropLocations: true });
            axios
                .get("/manual_dispatch/auto_complete", {
                    params: {
                        input: this.state.drop_location,
                    },
                })
                .then((res) => {
                    this.setState({
                        drop_locations: res.data.data.predictions,
                        loadingDropLocations: false,
                    });
                })
                .catch((err) => {
                    this.setState({ loadingDropLocations: false });
                });
        }
    };

    // when the user select pickup location
    onSelectPickupLocation = (e) => {
        this.setState({ selected_pickup_location: e ? e.place_id : "", pick_up_location: e ? e.description : this.state.pick_up_location });
    };

    onSelectDropLocation = (e) => {
        this.setState({ selected_drop_location: e ? e.place_id : "", drop_location: e ? e.description : this.state.drop_location });
    };

    // fetech details of the selected pick up location
    getPickPlaceDetails = () => {
        this.setState({ isLoadingLocation: true });
        axios
            .get("/manual_dispatch/place_details", {
                params: {
                    place_id: this.state.selected_pickup_location,
                },
            })
            .then((res) => {
                this.setState({ pickup_location_coordinates: res.data.data.result.geometry.location });
            })
            .catch((err) => {
                Alert.error(err.data ? err.data.message : "ERROR");
            });
    };

    getDropPlaceDetails = () => {
        this.setState({ isLoadingLocation: true });
        axios
            .get("/manual_dispatch/place_details", {
                params: {
                    place_id: this.state.selected_drop_location,
                },
            })
            .then((res) => {
                this.setState({ drop_location_coordinates: res.data.data.result.geometry.location });
            })
            .catch((err) => {
                Alert.error(err.data ? err.data.message : "ERROR");
            });
    };

    // get the estimated time,amount, and distance of the trip
    estimateTrip = () => {
        const {
            drop_location_coordinates,
        } = this.state;
        if (drop_location_coordinates) {
            axios
                .post("/manual_dispatch/estimate", {
                    merchant_id: 10,
                    area: this.state.area,
                    promo_id: this.state.promo_code,
                    service_type: this.state.service_type,
                    vehicle_type: this.state.vehicle_type,
                    pick_up_locaion: this.state.pick_up_location,
                    pickup_latitude: this.state.pickup_location_coordinates.lat,
                    pickup_longitude: this.state.pickup_location_coordinates.lng,
                    drop_location: JSON.stringify([
                        {
                            drop_location: this.state.drop_location,
                            drop_latitude: this.state.drop_location_coordinates.lat,
                            drop_longitude: this.state.drop_location_coordinates.lng,
                        },
                    ]),
                })
                .then((res) => {
                    this.setState({
                        time_estimate: res.data.data.time,
                        distance_estimate: res.data.data.distance,
                        amount_estimate: res.data.data.amount,
                    });
                })
                .catch((err) => {
                    Alert.error(err.data ? err.data.message : "ERROR");
                });
        }
    };

    // to get the list of available areas
    getAreas = () => {
        this.setState({ isLoading: true, areas: [], area: "selected" });
        axios
            .get("/service_areas")
            .then((res) => {
                this.setState({
                    areas: res.data,
                    isLoading: false,
                });
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                Alert.error(err.data ? err.data.message : "ERROR");
            });
    };

    // to get single area
    getArea = () => {
        this.setState({
            isLoadingArea: true,
            areaDetails: null,
        });
        axios
            .get("/service_areas/" + this.state.area)
            .then((res) => {
                this.setState({
                    areaDetails: res.data,
                    isLoadingArea: false,
                });
            })
            .catch((err) => {
                this.setState({ isLoadingArea: false });
                Alert.error(err.data ? err.data.message : "ERROR");
            });
    };

    // to search in riders
    search = () => {
        let filters = {};
        if (this.state.phone) {
            filters.text = this.state.phone;
        }
        this.setState(
            {
                isLoading: true,
                rider: null,
            },
            () => {
                axios
                    .get(`/users/search`, {
                        params: {
                            filters,
                        },
                    })
                    .then((res) => {
                        this.setState({
                            rider: res.data.users[0],
                            isLoading: false,
                        });
                    })
                    .catch((err) => {
                        this.setState({ isLoading: false });
                        Alert.error(err.data ? err.data.message : "ERROR");
                    });
            }
        );
    };
    centerMarker = (markerName) => {
        const { lng, lat } = this.state.mapCenter;

        switch (markerName) {
            case "pickup":
                this.setState(
                    {
                        pickup_location_coordinates: { lng, lat },
                    },
                    () => {
                        this._handlePickupFromMap(lng, lat);
                    }
                );
                break;
            case "drop":
                this.setState(
                    {
                        drop_location_coordinates: { lng, lat },
                    },
                    () => {
                        this._handleDropFromMap(lng, lat);
                    }
                );
                break;
        }
    };

    // to dispatch a trip for users
    dispatchTrip = () => {
        const {
            rider,
            area,
            service_type,
            vehicle_type,
            ride_time,
            selectedLaterDate,
            selectedTime,
            pick_up_location,
            pickup_location_coordinates,
            payment_method,
            drop_location,
            drop_location_coordinates,
            radius,
            time_estimate,
            amount_estimate,
            distance_estimate,
            promo_code,
        } = this.state;

        if (rider === null) {
            this.setState({ phone_error: true });
            return;
        }
        if (this.state.area === "selected") {
            this.setState({ area_error: true });
            return;
        }
        if (this.state.service_type === "selected") {
            this.setState({ service_type_error: true });
            return;
        }
        if (this.state.vehicle_type === "selected") {
            this.setState({ vehicle_type_error: true });
            return;
        }
        if (this.state.pick_up_location === "") {
            this.setState({ pick_up_location_error: true });
            return;
        }
        if (this.state.drop_location === "") {
            this.setState({ drop_location_error: true });
            return;
        }
        if (this.state.payment_method === "selected") {
            this.setState({ payment_method_error: true });
            return;
        }
        if (this.state.radius === "selected") {
            this.setState({ radius_error: true });
            return;
        }

        let params = {
            manual_user_type: "2",
            country: "+962",
            corporate_id: "",
            new_user_first_name: "",
            new_user_last_name: "",
            user_phone: rider.phone_number,
            user_id: rider.id,
            new_user_email: "",
            area: area,
            service: service_type,
            package: "",
            vehicle_type: vehicle_type,
            booking_type: ride_time,
            pickup_location: pick_up_location,
            pickup_latitude: String(pickup_location_coordinates.lat),
            pickup_longitude: String(pickup_location_coordinates.lng),
            drop_location: drop_location,
            drop_latitude: String(drop_location_coordinates.lat),
            drop_longitude: String(drop_location_coordinates.lng),
            payment_method_id: payment_method,
            note: "",
            ride_radius: radius,
            driver_marker: "2",
            driver_request: "1",
            promo_code: promo_code,
            distance: Number(distance_estimate.split(" ")[0]) * 1000,
            estimate_distance: distance_estimate,
            ride_time: Number(time_estimate.split(" ")[0]) * 60,
            estimate_time: time_estimate,
            estimate_fare: Number(amount_estimate.split("JOD")[0]),
        };

        if (ride_time === 2) {
            params.date = selectedLaterDate.format("YYYY-MM-DD");
            params.time = selectedTime.format("HH-MM");
        }
        this.setState({ isDispatching: true });
        axios
            .post("/manual_dispatch/dispatch", params)
            .then((res) => {
                this.setState({ isDispatching: false });
                Alert.success(translate("SUCCESS_REQUEST"));
            })
            .catch((err) => {
                this.setState({ isDispatching: false });
                Alert.error(err.data ? err.data.message : "ERROR");
            });
    };

    render() {
        return (
            <DispatchContext.Provider
                value={{
                    state: this.state,
                    rider: this.state.rider,
                    onChangeText: this.onChangeText,
                    search: this.search,
                    centerMarker: this.centerMarker,
                    onChangeRideTime: this.onChangeRideTime,
                    dispatchTrip: this.dispatchTrip,
                    handleDateChange: this.handleDateChange,
                    handleTimeChange: this.handleTimeChange,
                    onOpenClosePickLocations: this.onOpenClosePickLocations,
                    onSelectPickupLocation: this.onSelectPickupLocation,
                    onOpenCloseDropLocations: this.onOpenCloseDropLocations,
                    onSelectDropLocation: this.onSelectDropLocation,
                }}>
                <Slide direction='down' in={true} timeout={200} mountOnEnter unmountOnExit>
                    <div className={styles.container}>
                        <div className={styles.form}>
                            <DispatchForm />
                        </div>
                        <div className={styles.map}>
                            <MapDispatch
                                pickup={this.state.pickup_location_coordinates}
                                drop={this.state.drop_location_coordinates}
                                time_estimate={this.state.time_estimate}
                                amount_estimate={this.state.amount_estimate}
                                radiusInKm={this.state.radius}
                                onPickupFromMap={this._handlePickupFromMap}
                                onDropFromMap={this._handleDropFromMap}
                                onMapCenterChanged={this._handleOnMapCenterChanged}
                                distance_estimate={this.state.distance_estimate}
                            />
                        </div>
                    </div>
                </Slide>
            </DispatchContext.Provider>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
    };
};

export default connect(null, mapDispatchToProps)(ManualDispatchContainer);
