import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import Grid from "@material-ui/core/Grid";
import { Slide, CircularProgress, Button, Typography } from "@material-ui/core";
import Search from "../../components/Search/SearchContainer";
import { translate } from "../../utils/translate";
import moment from "moment";
import axios from "../../axios";
import Alert from "../../components/Alert/alert";
import mapboxgl from "mapbox-gl";
import { PersonDialog } from "../../components/PersonDialog/PersonDialog";
export class DriversMapContainer extends PureComponent {
  state = {
    drivers: [],
    isLoading: false,
    isLoadingDriver: false,
    filter: {},
    person: null,
    open: false,
    currentPage: 0,
    features: [],
    driverStatus: "FREE",
    hasMore: false,
    driversCount: 0,
  };

  initMap = () => {
    this.map = new mapboxgl.Map({
      container: "drivers_map",
      style: "mapbox://styles/mapbox/streets-v8",
      zoom: 9,
      center: [35.8439, 31.9754],
    });
    // add fullscreen contoler
    this.map.addControl(new mapboxgl.FullscreenControl());
    this.map.on("zoom", this.getVisibleMarkers);
    this.map.on("drag", this.getVisibleMarkers);
  };

  componentDidMount() {
    this.props.changeCurrentPageName(this.props.location.pathname);
    this.initMap();
    this.search();
  }

  onClick = (data) => {
    this.setState({ isLoadingDriver: false, open: true });
    this.setState({
      person: {
        id: data.id,
        fullName: data.full_name,
        rating: data.rating,
        totalTrips: data.total_rides,
        phoneNumber: data.phone_number,
        email: data.email,
        image: data.profile_image,
        status: data.verification_status,
      },
    });
  };

  drawMap = () => {
    //when map loaded add polygon feature to map
    let geojson = {
      type: "FeatureCollection",
      features: this.state.features,
    };
    document.querySelectorAll(".marker").forEach((m) => m.remove());
    geojson.features.forEach((marker) => {
      // create a DOM element for the marker
      let driver = JSON.parse(marker.properties.driver);
      let el = document.createElement("div");
      el.className = "marker";
      let rotateString = "rotate(" + marker.properties.bearing + "deg)";
      el.style.transform = rotateString;
      el.style.backgroundColor =
        driver.availability === "FREE"
          ? "#46A43D"
          : driver.availability === "BUSY"
          ? "#F87626"
          : "gray";
      let icon = document.createElement("i");
      icon.className = "fas fa-car";
      let nameTag = document.createElement("i");
      nameTag.className = "name-tag";

      nameTag.innerHTML = driver.full_name;

      el.appendChild(icon);
      //el.appendChild(nameTag);
      el.addEventListener("click", () => {
        this.onClick(driver);
      });
      // add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(this.map);
      //   this.map.addLayer(el);
    });

    this.getVisibleMarkers();
  };

  selectStatus = (status) => {
    let features = this.state.drivers
      .filter((e) => e.availability == status)
      .map((driver) => {
        let coordinates = [0, 0];
        if (
          driver &&
          driver.last_known_location &&
          driver.last_known_location.longitude &&
          driver.last_known_location.latitude
        )
          coordinates = [
            driver.last_known_location.longitude,
            driver.last_known_location.latitude,
          ];
        return {
          type: "Feature",
          properties: {
            driver: JSON.stringify(driver),
            bearing: driver.last_known_location.bearing,
          },
          geometry: {
            type: "Point",
            coordinates,
          },
        };
      });
    this.setState({ features, driverStatus: status }, this.drawMap);
  };

  // to search in drivers W/O filters
  search = (data = {}, search, sort) => {
    // filter
    let filter = {};
    if (data.text) {
      filter.text = data.text;
    }
    if (data.gender) {
      filter.gender = data.gender === 1 ? "MALE" : "FEMALE";
    }
    if (data.service_type) {
      filter.service_type = data.service_type;
    }
    if (data.date_from) {
      filter.date_from = moment(data.date_from).format("YYYY-MM-DD");
    }
    if (data.date_to) {
      filter.date_to = moment(data.date_to).format("YYYY-MM-DD");
    }
    if (data.rate) {
      filter.rate_from = data.rate[0];
    }
    if (data.rate) {
      filter.rate_to = data.rate[1];
    }
    if (data.verification_status) {
      filter.verification_status = data.verification_status;
    }
    if (data.date_type) {
      filter.date_type = data.date_type;
    }
    ////////////
    // if it is search operation, take the new filter
    // if (search) {
    //   this.setState(
    //     { filter, drivers: [], _originalDrivers: [], currentPage: 0 },
    //     () => {
    //       this.map.remove();
    //       this.initMap();
    //       //   this.drawMap();
    //     }
    //   );
    // }

    this.setState(
      {
        isLoading: true,
        filter,
        currentPage: search ? 0 : this.state.currentPage, //is search operation reset the current page and the drivers array
        drivers: search ? [] : this.state.drivers,
        driver: search ? null : this.state.driver,
        hasMore: search ? false : this.state.hasMore,
      },
      () => {
        let params = {
          filters: this.state.filter,
          sort,
          limit: 25,
        };
        axios
          .get(`/drivers/search?page=${this.state.currentPage + 1}`, {
            params,
          })
          .then((res) => {
            this.setState(
              {
                drivers: [...res.data.drivers, ...this.state.drivers],
                hasMore: res.data.hasMorePages,
                currentPage: res.data.current_page,
                isLoading: false,
              },
              () => {
                this.selectStatus(this.state.driverStatus);
                if (this.state.hasMore) this.search(data, false, sort);
              }
            );
          })
          .catch((err) => {
            Alert.error(err.data ? err.data.message : "ERROR");
          });
      }
    );
  };

  onNameClicked = () => {
    if (this.state.person.id) {
      this.props.history.push("/drivers", { id: this.state.person.id });
    }
  };

  onClose = () => {
    this.setState({ open: false });
  };

  intersectRect = (r1, r2) => {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  };

  getVisibleMarkers = () => {
    let cc = this.map.getContainer();
    let els = cc.getElementsByClassName("marker");
    let ccRect = cc.getBoundingClientRect();
    let visibles = [];
    for (let i = 0; i < els.length; i++) {
      let el = els.item(i);
      let elRect = el.getBoundingClientRect();
      this.intersectRect(ccRect, elRect) && visibles.push(el);
    }

    this.setState({ driversCount: visibles.length });
  };

  render() {
    return (
      <Grid justify="center" container>
        <Grid item xs={10} sm={10} lg={10} md={10} xl={10}>
          <Slide
            direction="down"
            in={true}
            timeout={200}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <Search
                advanced="drivers"
                submitsearch={this.search}
                inputProps={{
                  placeholder: translate("SEARCH_BY_NAME_PHONE"),
                  margin: "normal",
                  fullWidth: true,
                }}
              />
              <Button
                disabled={this.state.driverStatus == "FREE"}
                style={{ color: "#590" }}
                onClick={() => {
                  this.selectStatus("FREE");
                }}
              >
                {translate("FREE")}
              </Button>
              <Button
                disabled={this.state.driverStatus == "BUSY"}
                style={{ color: "#F87626" }}
                onClick={() => {
                  this.selectStatus("BUSY");
                }}
              >
                {translate("BUSY")}
              </Button>
              <Button
                disabled={this.state.driverStatus == "OFFLINE"}
                style={{ color: "#555" }}
                onClick={() => {
                  this.selectStatus("OFFLINE");
                }}
              >
                {translate("OFFLINE")}
              </Button>
            </div>
          </Slide>
        </Grid>
        <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
          {this.state.isLoading ? (
            <div style={{ textAlign: "center", marginBottom: 5 }}>
              <CircularProgress size={16} />
            </div>
          ) : null}
          {!this.state.isLoading ? (
            <div style={{ textAlign: "center", marginBottom: 5 }}>
              <Typography variant="h6">
                {translate("COUNT")}:{this.state.driversCount}
              </Typography>
            </div>
          ) : null}
          <div
            id="drivers_map"
            style={{
              direction: "ltr",
              position: "relative",
              width: "100%",
              minHeight: "740px",
            }}
          ></div>
          <div style={{ minHeight: 30 }}></div>
        </Grid>
        <PersonDialog
          loading={this.state.isLoadingDriver}
          open={this.state.open}
          onClose={this.onClose}
          {...this.state.person}
          onNameClick={this.onNameClicked}
        />
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
  };
};

export default connect(null, mapDispatchToProps)(DriversMapContainer);
