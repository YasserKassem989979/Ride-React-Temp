import React, { Component, Suspense } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "../../axios";
import RidersList from "./RidersList";
import InfiniteScroll from "react-infinite-scroll-component";
import Tabs from "./Tabs/Tabs";
import Search from "../../components/Search/SearchContainer";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import { connect } from "react-redux";
import { CircularProgress, Hidden } from "@material-ui/core";
import moment from "moment";
import Alert from "../../components/Alert/alert";
import native from "axios";

import { translate } from "../../utils/translate";
import Slide from "@material-ui/core/Slide";
const ActiosListener = React.lazy(() =>
  import("./actionsListener/actionsListener")
);
export const RiderContext = React.createContext("state");

const CancelToken = native.CancelToken;
let cancel;

class RidersContainer extends Component {
  state = {
    riders: [],
    rider: null,
    rider_id: null,
    isLoading: false,
    hasMore: true,
    currentPage: 1,
    tabIndex: 0,
    toggleTheMainView: false,
    toggleTheSideView: true,
    isLoadingRider: false,
    filter: {},
    total: "",
    transactions: [],
    isLoadingTransactions: false,
    isTransactionsRequested: false,
    ratings: [],
    ratingPage: 1,
    hasMoreRating: true,
    ratingsTotal: "",
    whatIsTheAction: "",
    isActionClicked: false,
    documentIdForActionListener: null,
    selectedAccount: {},
    sort: null,
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.id) {
      this.getRider(this.props.location.state.id);
    } else {
      this.search();
    }
    this.props.changeCurrentPageName(this.props.location.pathname);
  }

  // when action completed or canceld
  onCloseAction = (refresh) => {
    this.setState({ isActionClicked: false }, () => {
      if (refresh) {
        const id = this.state.rider_id;
        this.getRider(id);
        this.search(this.state.filter, true);
      }
    });
  };

  //
  onActionClicked = (action, id) => {
    this.setState({
      isActionClicked: true,
      whatIsTheAction: action,
      documentIdForActionListener: id,
    });
  };

  // to get specefic rider
  getRider = (id) => {
    this.setState({
      toggleTheMainView: !this.state.toggleTheMainView,
      toggleTheSideView: !this.state.toggleTheSideView,
      isLoadingRider: true,
      rider_id: id,
    });
    axios
      .get(`/users/profile/${id}`)
      .then((res) => {
        this.setState({
          rider: res.data,
          isLoadingRider: false,
          transactions: [],
          isTransactionsRequested: false,
          isLoadingTransactions: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoadingRider: false,rider:null });
        Alert.error(err.data ? err.data.message : "Error");
      });
  };

  // to get ratings for a rider
  getRatings = (newSearch) => {
    // if the rider exist get ratings
    if (this.state.rider && this.state.rider.personal) {
      this.setState(
        {
          isLoadingRider: newSearch ? true : false, // newSearch to check if its new search or is called from infit scroll component
          ratings: newSearch ? [] : this.state.ratings,
          ratingPage: newSearch ? 1 : this.state.ratingPage,
          hasMoreRating: newSearch ? true : this.state.hasMoreRating,
          ratingsTotal: newSearch ? "" : this.state.ratingsTotal,
        },
        () => {
          axios
            .get(
              `/users/ratings/${this.state.rider.personal.id}?page=${this.state.ratingPage}`
            )
            .then((res) => {
              this.setState({
                ratings: this.state.ratings.concat(res.data.ratings),
                isLoadingRider: false,
                ratingPage: this.state.ratingPage + 1,
                hasMoreRating: res.data.hasMorePages,
                ratingsTotal: res.data.total,
              });
            })
            .catch((err) => {
              Alert.error(err.data ? err.data.message : "ERROR");
              this.setState({ isLoadingRider: false });
            });
        }
      );
    }
  };

  rechargeRiderWallet = (data) => {
    return axios
      .post("/users/recharge_wallet", {
        amount: data.amount,
        user_id: data.toPersonId,
        account_id: data.account.id,
        description: data.description,
      })
      .then(this.onCloseAction);
  };

  // to search in riders W/O filters
  search = (data = {}, search, sort) => {
    if (cancel) cancel("CHANGE SEARCH");

    // if there is more data and is not a new search operation don't do any thing
    if (!this.state.hasMore && !search) {
      return;
    }
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
    //////////////
    // if it is search operation, take the new filter
    if (search) {
      this.setState({ filter });
    }

    if (sort) {
      this.setState({ sort });
    }

    this.setState(
      {
        isLoading: true,
        hasMore: search ? false : this.state.hasMore,
        currentPage: search ? 1 : this.state.currentPage, //is search operation reset the current page and the riders array
        riders: search ? [] : this.state.riders,
        rider: search ? null : this.state.rider,
      },
      () => {
        axios
          .get(`/users/search?page=${this.state.currentPage}`, {
            params: {
              filters: this.state.filter,
              sort: this.state.sort,
            },
            cancelToken: new CancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
            }),
          })
          .then((res) => {
            this.setState({
              riders: this.state.riders.concat(res.data.users),
              isLoading: false,
              hasMore: res.data.hasMorePages,
              currentPage: this.state.currentPage + 1,
              total: res.data.total,
            });
          })
          .catch((err) => {
            if (err.message == "CHANGE SEARCH") return;

            this.setState({ isLoading: false });
            Alert.error(err.data ? err.data.message : "ERROR");
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

  // to get transactions for a rider account
  geTransactions = (account) => {
    this.setState({ isLoadingTransactions: true });
    axios
      .get(`accounts/transactions/${account.id}`)
      .then((res) => {
        this.setState({
          selectedAccount: account,

          transactions: res.data.data,
          isLoadingTransactions: false,
          isTransactionsRequested: true,
        });
      })
      .catch((err) => {
        this.setState({
          isLoadingTransactions: false,
          isTransactionsRequested: true,
        });
      });
  };

  render() {
    const mainView = (
      <>
        <div style={{ padding: 10 }}>
          <Search
            advanced="riders"
            submitsearch={this.search}
            inputProps={{
              placeholder: translate("SEARCH_BY_NAME_PHONE"),
              margin: "normal",
              fullWidth: true,
            }}
          />
        </div>
        {this.state.isLoading && this.state.riders.length < 1 ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : null}
        <InfiniteScroll
          style={{ padding: "0 5px" }}
          dataLength={this.state.riders.length}
          next={() => this.search(this.state.filter, false)}
          hasMore={this.state.hasMore}
          loader={
            this.state.riders.length > 0 ? (
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
          <RidersList getRider={this.getRider} riders={this.state.riders} />
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
      <RiderContext.Provider
        value={{
          state: this.state,
          geTransactions: this.geTransactions,
          geTrip: this.geTrip,
          onConfirmTransactionClick: this.rechargeRiderWallet,

          getRatings: this.getRatings,
        }}
      >
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
                  rider={this.state.rider}
                  getRatings={this.getRatings}
                />
              </Grid>
            </Slide>
          </Hidden>
          {this.state.isActionClicked ? (
            <Suspense fallback={<div style={{ display: "none" }}></div>}>
              <ActiosListener
                rider={this.state.rider}
                whatIsTheAction={this.state.whatIsTheAction}
                onCloseAction={this.onCloseAction}
                onActionClicked={this.onActionClicked}
                documentIdForActionListener={
                  this.state.documentIdForActionListener
                }
              />
            </Suspense>
          ) : null}
        </Grid>
      </RiderContext.Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
  };
};

export default connect(null, mapDispatchToProps)(RidersContainer);
