import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { Grid, Hidden, CircularProgress } from "@material-ui/core";
import Tabs from "./Tabs/Tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import Search from "../../components/Search/SearchContainer";
import axios from "../../axios";
import { translate } from "../../utils/translate";
import TripsList from "./TripsList";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import Alert from "../../components/Alert/alert";
import Slide from "@material-ui/core/Slide";
import native from "axios";
const ActionListener = React.lazy(() =>
  import("./actionListener/ActionListener")
);

export const TripContext = React.createContext("state");

const CancelToken = native.CancelToken;
let cancel;

const CancelTripToken = native.CancelToken;
let cancelTrip;

export class TripsContainer extends Component {
  state = {
    trips: [],
    trip: null,
    isLoading: false,
    hasMore: true,
    currentPage: 1,
    toggleTheMainView: false,
    toggleTheSideView: true,
    isLoadingTrip: false,
    filter: {},
    total: "",
    whatIsTheAction: "CANCEL_TRIP_ACTIVE",
    isActionClicked: false,
    trip_id: null,
  };

  onCloseAction = (refresh) => {
    this.setState({ isActionClicked: false }, () => {
      if (refresh) {
        const id = this.state.trip_id;
        this.search(this.state.filter, true);
        this.getTrip(id);
      }
    });
  };

  onActionClicked = (action, id) => {
    this.setState({
      isActionClicked: true,
      whatIsTheAction: action,
      tripId: id,
    });
  };

  componentDidMount() {
    this.props.changeCurrentPageName(this.props.location.pathname);
    if (this.props.location.state && this.props.location.state.id) {
      this.getTrip(this.props.location.state.id);
    } else {
      this.search();
    }
  }

  // to get specefic trip
  getTrip = (id) => {
    if (this.state.isLoadingTrip && cancelTrip) cancelTrip("CHANGE GET TRIP");

    this.setState({
      toggleTheMainView: !this.state.toggleTheMainView,
      toggleTheSideView: !this.state.toggleTheSideView,
      isLoadingTrip: true,
      trip_id: id,
    });
    axios
      .get(`/trips/details/${id}`, {
        cancelToken: new CancelTripToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancelTrip = c;
        }),
      })
      .then((res) => {
        this.setState({
          trip: res.data,
        });
      })
      .catch((err) => {
        Alert.error(err.data ? err.data.message : "ERROR");
        this.setState({
          trip: null,
        });
      })
      .finally(() => {
        this.setState({ isLoadingTrip: false });
      });
  };

  search = (data = {}, search) => {
    if (cancel) cancel("CHANGE SEARCH");
    // if there is more data and is not a new search operation don't do any thing
    if (!this.state.hasMore && !search) {
      return;
    }
    // filter
    let filter = {};
    if (data.category) {
      filter.category = data.category;
    }
    if (data.date) {
      filter.date = moment(data.date).format("YYYY-MM-DD");
    }
    if (data.status) {
      filter.status = data.status;
    }
    if (data.text) {
      filter.text = data.text;
    }
    if (data.type) {
      filter.type = data.type;
    }
    //////////////
    // if it is search operation, take the new filter
    if (search) {
      this.setState({ filter });
    }

    this.setState(
      {
        isLoading: true,
        hasMore: search ? false : this.state.hasMore,
        currentPage: search ? 1 : this.state.currentPage, //is search operation reset the current page and the trips array
        trips: search ? [] : this.state.trips,
        //trip: search ? null : this.state.trip
      },
      () => {
        axios
          .get(`/trips/search?page=${this.state.currentPage}`, {
            params: {
              filters: this.state.filter,
            },
            cancelToken: new CancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then((res) => {
            this.setState({
              trips: this.state.trips.concat(res.data.trips),
              isLoading: false,
              hasMore: res.data.hasMorePages,
              currentPage: this.state.currentPage + 1,
              total: res.data.total,
            });
          })
          .catch((err) => {
            if (err.message == "CHANGE SEARCH") return;
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

  render() {
    const mainView = (
      <>
        <div style={{ padding: 10 }}>
          <Search
            advanced="trips"
            submitsearch={this.search}
            inputProps={{
              placeholder: translate("SEARCH_BY_NAME_PHONE"),
              margin: "normal",
              fullWidth: true,
            }}
          />
        </div>
        {this.state.isLoading && this.state.trips.length < 1 ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : null}
        <InfiniteScroll
          style={{ padding: "0 5px" }}
          dataLength={this.state.trips.length}
          next={() => this.search(this.state.filter, false)}
          hasMore={this.state.hasMore}
          loader={
            this.state.trips.length > 0 ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
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
          <TripsList
            getTrip={this.getTrip}
            trips={this.state.trips}
            selectedTrip={this.state.trip}
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
      <TripContext.Provider value={{ state: this.state }}>
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
                  trip={this.state.trip}
                  onActionClicked={this.onActionClicked}
                  toggleTheMainSideView={this.toggleTheMainSideView}
                />
              </Grid>
            </Slide>
          </Hidden>
          {this.state.isActionClicked ? (
            <Suspense fallback={<div style={{ display: "none" }}></div>}>
              <ActionListener
                whatIsTheAction={this.state.whatIsTheAction}
                onCloseAction={this.onCloseAction}
                trip={this.state.trip}
              />
            </Suspense>
          ) : null}
        </Grid>
      </TripContext.Provider>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripsContainer);
