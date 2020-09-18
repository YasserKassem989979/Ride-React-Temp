import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { Grid, Hidden, CircularProgress } from "@material-ui/core";
import Alert from "../../components/Alert/alert";
import InfiniteScroll from "react-infinite-scroll-component";
import Search from "../../components/Search/SearchContainer";
import { translate } from "../../utils/translate";
import Slide from "@material-ui/core/Slide";
import axios from "../../axios";
import VehiclesList from "./VehiclesList";
import Tabs from "./Tabs/Tabs";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import moment from "moment";
export const VehiclesContext = React.createContext("state");
const ActiosListener = React.lazy(() =>
  import("./actionsListener/actionsListener")
);

export class VehiclesContainer extends Component {
  state = {
    vehicles: [],
    trip: null,
    isLoading: false,
    hasMore: true,
    currentPage: 1,
    toggleTheMainView: false,
    toggleTheSideView: true,
    isLoadingVehicle: false,
    filter: {},
    total: "",
    whatIsTheAction: "",
    isActionClicked: false,
    vehicle: null,
    documentIdForActionListener: null,
    documentDate: moment(),
    vehicle_id: "",
  };

  componentDidMount() {
    let vehicle_id = null;
    if (this.props.location.state && this.props.location.state.id) {
      vehicle_id = this.props.location.state.id;
      this.setState({ vehicle_id });
      this.getVehicle(vehicle_id);
    } else {
      this.search();
    }
    this.props.changeCurrentPageName(this.props.location.pathname);
  }

  // when action completed or canceld
  onCloseAction = (refresh) => {
    this.setState({ isActionClicked: false }, () => {
      if (refresh) {
        const id = this.state.vehicle_id;
        this.search(this.state.filter, true);
        this.getVehicle(id);
      }
    });
  };

  //
  onActionClicked = (action, id, date) => {
    this.setState({
      isActionClicked: true,
      whatIsTheAction: action,
      documentIdForActionListener: id,
      documentDate: date,
    });
  };

  // to search in trips W/O filters
  search = (data = {}, search) => {
    // if there is more data and is not a new search operation don't do any thing
    if (!this.state.hasMore && !search) {
      return;
    }
    // filter
    let filter = {};
    if (data.verification_status) {
      filter.verification_status = data.verification_status;
    }
    if (data.date_from) {
      filter.date_from = moment(data.date_from).format("YYYY-MM-DD");
    }
    if (data.date_to) {
      filter.date_to = moment(data.date_to).format("YYYY-MM-DD");
    }
    if (data.service_type) {
      filter.service_type = data.service_type;
    }
    if (data.text) {
      filter.number = data.text;
    }

    ////////////
    // if it is search operation, take the new filter
    if (search) {
      this.setState({ filter });
    }

    this.setState(
      {
        isLoading: true,
        hasMore: search ? false : this.state.hasMore,
        currentPage: search ? 1 : this.state.currentPage, //is search operation reset the current page and the trips array
        vehicles: search ? [] : this.state.vehicles,
        vehicle: search ? null : this.state.vehicle,
      },
      () => {
        axios
          .get(`/vehicles/search?page=${this.state.currentPage}`, {
            params: {
              filters: this.state.filter,
            },
          })
          .then((res) => {
            this.setState({
              vehicles: this.state.vehicles.concat(res.data.vehicles),
              isLoading: false,
              hasMore: res.data.hasMorePages,
              currentPage: this.state.currentPage + 1,
              total: res.data.total,
            });
          })
          .catch((err) => {
            Alert.error(err.data ? err.data.message : "ERROR");
            this.setState({ isLoading: false });
          });
      }
    );
  };

  // to toggle between the main and side view on small screens
  toggleTheMainSideView = () => {
    this.setState({
      toggleTheMainView: !this.state.toggleTheMainView,
      toggleTheSideView: !this.state.toggleTheSideView,
    });
  };

  getVehicle = (id) => {
    this.setState({
      toggleTheMainView: !this.state.toggleTheMainView,
      toggleTheSideView: !this.state.toggleTheSideView,
      isLoadingVehicle: true,
      vehicle_id: id,
    });
    axios
      .get(`/vehicles/profile/${id}`)
      .then((res) => {
        this.setState({
          vehicle: res.data,
          isLoadingVehicle: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoadingVehicle: false,vehicle:null });
        Alert.error(err.data ? err.data.message : "Error");
      });
  };

  onUpdate = (data) => {
    axios
      .post("/vehicles/update", data)
      .then(this.onCloseAction)
      .catch((err) => {
        Alert.error(err.data ? err.data.message : "ERROR");
        this.setState({ isLoading: false });
      });
  };

  render() {
    const mainView = (
      <>
        <div style={{ padding: 10 }}>
          <Search
            advanced="vehicles"
            submitsearch={this.search}
            inputProps={{
              placeholder: translate("SEARCH_BY_CAR_NUMBER"),
              margin: "normal",
              fullWidth: true,
            }}
          />
        </div>
        {this.state.isLoading && this.state.vehicles.length < 1 ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : null}
        <InfiniteScroll
          style={{ padding: "0 5px" }}
          dataLength={this.state.vehicles.length}
          next={() => this.search(this.state.filter, false)}
          hasMore={this.state.hasMore}
          loader={
            this.state.vehicles.length > 0 ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={20} />
              </div>
            ) : null
          }
          height={700}
          endMessage={
            !this.state.isLoading ? (
              <p style={{ textAlign: "center" }}>
                <b>{translate("NO_MORE_DATA")}</b>
              </p>
            ) : null
          }
        >
          <VehiclesList
            getVehicle={this.getVehicle}
            vehicles={this.state.vehicles}
          />
        </InfiniteScroll>
        {!this.state.isLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5 style={{ margin: 0 }}>
              {translate("TOTAL")}:{this.state.total}
            </h5>
          </div>
        ) : null}
      </>
    );
    return (
      <VehiclesContext.Provider value={{ state: this.state }}>
        <Grid container>
          <Hidden mdDown={this.state.toggleTheMainView}>
            <Slide
              direction="down"
              in={true}
              timeout={200}
              mountOnEnter
              unmountOnExit
            >
              <Grid item xs={12} sm={12} md={12} lg={6}>
                {mainView}
              </Grid>
            </Slide>
          </Hidden>
          <Hidden mdDown={this.state.toggleTheSideView}>
            <Slide
              direction="up"
              in={true}
              timeout={200}
              mountOnEnter
              unmountOnExit
            >
              <Grid
                style={{
                  padding: 9,
                  marginTop: 15,
                }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={6}
              >
                <Tabs
                  onActionClicked={this.onActionClicked}
                  toggleTheMainSideView={this.toggleTheMainSideView}
                />
              </Grid>
            </Slide>
          </Hidden>
          {this.state.isActionClicked ? (
            <Suspense fallback={<div style={{ display: "none" }}></div>}>
              <ActiosListener
                vehicle={this.state.vehicle}
                whatIsTheAction={this.state.whatIsTheAction}
                onCloseAction={this.onCloseAction}
                onActionClicked={this.onActionClicked}
                documentDate={this.state.documentDate}
                onUpdate={this.onUpdate}
                documentIdForActionListener={
                  this.state.documentIdForActionListener
                }
              />
            </Suspense>
          ) : null}
        </Grid>
      </VehiclesContext.Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
  };
};

const mapStateToProps = (state) => {
  return {
    permissions: state.permissions.permissions,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesContainer);
