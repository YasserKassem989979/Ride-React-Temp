import React, { Component, Suspense } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "../../axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { changeCurrentPageName } from "../../store/actions/userPreference";
import { connect } from "react-redux";
import { CircularProgress, Hidden } from "@material-ui/core";
import moment from "moment";
import DriversList from "./DriversList";
import Search from "../../components/Search/SearchContainer";
import Tabs from "./Tabs/Tabs";
import { translate } from "../../utils/translate";
import Alert from "../../components/Alert/alert";
import { Slide } from "@material-ui/core";
import * as constants from "../../constants";
const ActiosListener = React.lazy(() =>
  import("./actionsListener/actionsListener")
);
export const DriverContext = React.createContext("state");

export class DriversContainer extends Component {
  state = {
    drivers: [],
    driver: null,
    isLoading: false,
    hasMore: true,
    currentPage: 1,
    tabIndex: 0,
    toggleTheMainView: false,
    toggleTheSideView: true,
    isLoadingDriver: false,
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
    driver_id: "",
    selectedAccount: null,
    documentDate: moment(),
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.id) {
      this.getDriver(this.props.location.state.id);
    } else {
      this.search();
    }
    this.props.changeCurrentPageName(this.props.location.pathname);
  }

  // when action completed or canceld
  onCloseAction = (what) => {
    this.setState({ isActionClicked: false }, () => {
      if (what) {
        const id = this.state.driver_id;
        this.search(this.state.filter, true);
        this.getDriver(id);
      }
    });
  };

  // when one of acions clicked how to handle it
  onActionClicked = (action, id, date) => {
    if (
      action === constants.VIEW_REPORT ||
      action === constants.EXTRACT_REPORTS
    ) {
      this.props.history.push("/reports");
    }
    this.setState({
      isActionClicked: true,
      whatIsTheAction: action,
      documentIdForActionListener: id,
      documentDate: date,
    });
  };

  // to get specific driver
  getDriver = (id) => {
    this.setState(
      {
        toggleTheMainView: !this.state.toggleTheMainView,
        toggleTheSideView: !this.state.toggleTheSideView,
        isLoadingDriver: true,
        driver_id: id,
      },
      () => {
        axios
          .get(`/drivers/profile/${id}`)
          .then((res) => {
            this.setState({
              driver: res.data,
              isLoadingDriver: false,
              transactions: [],
              isTransactionsRequested: false,
              isLoadingTransactions: false,
              ratingPage: 1,
              ratings: [],
            });
          })
          .catch((err) => {
            this.setState({ isLoadingDriver: false, driver: null });
          });
      }
    );
  };

  // to get ratings for a driver
  getRatings = (newSearch) => {
    // if the driver exist get ratings
    if (this.state.driver && this.state.driver.personal) {
      this.setState(
        {
          isLoadingDriver: newSearch ? true : false, // newSearch to check if its new search or is called from infit scroll component
          ratings: newSearch ? [] : this.state.ratings,
          ratingPage: newSearch ? 1 : this.state.ratingPage,
          hasMoreRating: newSearch ? true : this.state.hasMoreRating,
          ratingsTotal: newSearch ? "" : this.state.ratingsTotal,
        },
        () => {
          axios
            .get(
              `/drivers/ratings/${this.state.driver.personal.id}?page=${this.state.ratingPage}`
            )
            .then((res) => {
              this.setState({
                ratings: this.state.ratings.concat(res.data.ratings),
                isLoadingDriver: false,
                ratingPage: this.state.ratingPage + 1,
                hasMoreRating: res.data.hasMorePages,
                ratingsTotal: res.data.total,
              });
            })
            .catch((err) => {
              Alert.error(err.data ? err.data.message : "ERROR");
              this.setState({ isLoadingDriver: false });
            });
        }
      );
    }
  };

  // to search in drivers W/O filters
  search = (data = {}, search, sort) => {
    // if there is more data and is not a new search operation don't do any thing
    if (!this.state.hasMore && !search) {
      return;
    }
    console.log(data)
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
    if (data.document_number) {
      filter.document_number = data.document_number;
    }
    if (data.expired_docs) {
      filter.expired_docs = data.expired_docs;
    }
    //////////////
    // if it is search operation, take the new filter
    if (search) {
      this.setState({ filter });
    }

    this.setState(
      {
        isLoading: true,
        currentPage: search ? 1 : this.state.currentPage, //is search operation reset the current page and the drivers array
        drivers: search ? [] : this.state.drivers,
        driver: search ? null : this.state.driver,
        hasMore: search ? false : this.state.hasMore,
      },
      () => {
        axios
          .get(`/drivers/search?page=${this.state.currentPage}`, {
            params: {
              filters: this.state.filter,
              sort,
            },
          })
          .then((res) => {
            this.setState({
              drivers: this.state.drivers.concat(res.data.drivers),
              isLoading: false,
              hasMore: res.data.hasMorePages,
              currentPage: this.state.currentPage + 1,
              total: res.data.total,
            });
          })
          .catch((err) => {
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

  // to get transactions for a driver account
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

  settleDriverClaim = (data) => {
    return axios
      .post("/drivers/settle_claim", {
        amount: data.amount,
        driver_id: data.toPersonId,
        account_id: data.account.id,
        description: data.description,
      })
      .then(this.onCloseAction);
  };

  render() {
    const mainView = (
      <>
        <div style={{ padding: 10 }}>
          <Search
            advanced="drivers"
            submitsearch={this.search}
            inputProps={{
              placeholder: translate("SEARCH_BY_NAME_PHONE"),
              margin: "normal",
              fullWidth: true,
            }}
          />
        </div>
        {this.state.isLoading && this.state.drivers.length < 1 ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : null}
        <InfiniteScroll
          style={{ padding: "0 5px" }}
          dataLength={this.state.drivers.length}
          next={() => this.search(this.state.filter, false)}
          hasMore={this.state.hasMore}
          loader={
            this.state.drivers.length > 0 ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
            ) : null
          }
          height={705}
          endMessage={
            !this.state.isLoading ? (
              <p style={{ textAlign: "center" }}>
                <b>{translate("NO_MORE_DATA")}</b>
              </p>
            ) : null
          }
        >
          <DriversList
            getDriver={this.getDriver}
            drivers={this.state.drivers}
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
      <DriverContext.Provider
        value={{
          navigation: this.props,
          state: this.state,
          geTransactions: this.geTransactions,
          onConfirmTransactionClick: this.settleDriverClaim,
          getRatings: this.getRatings,
          getDriver:this.getDriver
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
                  padding: "9px",
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
                  driver={this.state.driver}
                  getRatings={this.getRatings}
                  toggleTheMainSideView={this.toggleTheMainSideView}
                />
              </Grid>
            </Slide>
          </Hidden>
          {this.state.isActionClicked ? (
            <Suspense fallback={<div style={{ display: "none" }}></div>}>
              <ActiosListener
                driver={this.state.driver}
                whatIsTheAction={this.state.whatIsTheAction}
                onCloseAction={this.onCloseAction}
                onActionClicked={this.onActionClicked}
                documentIdForActionListener={
                  this.state.documentIdForActionListener
                }
                documentDate={this.state.documentDate}
              />
            </Suspense>
          ) : null}
        </Grid>
      </DriverContext.Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentPageName: (name) => dispatch(changeCurrentPageName(name)),
  };
};

export default connect(null, mapDispatchToProps)(DriversContainer);
