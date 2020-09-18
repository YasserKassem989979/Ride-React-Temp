import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
const TripsAdvanceSearch = React.lazy(() => import("./templates/tripsAdvanceSearch"));
const VehiclesAdvancedSearch = React.lazy(() => import("./templates/VehiclesAdvancedSearch"));
const RidersReportSearch = React.lazy(() => import("./templates/DriversReportSearch"));
const PartnerReportSearch = React.lazy(() => import("./templates/PartnerReportSearch"));
const DriverClaims = React.lazy(() => import("./templates/DriverClaimsSearch"));
const Activities = React.lazy(() => import("./templates/ActivitiesSearch"));
const CompanyShareSearch = React.lazy(() => import("./templates/companySharesSearch"));
export const SearchContext = React.createContext("");

export class Search extends Component {
    //extractReport function
    extractReport = () => {
        this.props.extractReport();
    };

    // on search submit
    search = (data, clear) => {
        // if there is filters, get all filters and send them to the containers
        if (data) {
            const fullData = { ...data };
            this.props.submitsearch(fullData, true);
            return;
        } else if (clear === "clear") {
            // if it is clear filters operations ,clear all filters :P
            this.props.submitsearch({}, true);
            return;
        }
    };

    // template
    render() {
        const advanced = this.props.advanced;
        return (
            <SearchContext.Provider value={{ extractReport: this.extractReport }}>
                <Suspense
                    fallback={
                        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                            <CircularProgress />
                        </div>
                    }>
                    {advanced === "activities" ? (
                        <Activities
                            id={"ACTIVITY"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "drivers" ? (
                        <RidersReportSearch
                            id={"DRIVER"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "partners" ? (
                        <PartnerReportSearch
                            id={"DRIVER"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "riders" ? (
                        <RidersReportSearch
                            id={"RIDER"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "trips" ? (
                        <TripsAdvanceSearch
                            id={"TRIP"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "vehicles" ? (
                        <VehiclesAdvancedSearch
                            id={"VEHICLE"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "DRIVER" ? (
                        <DriverClaims
                            id={"DRIVER"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "RIDER" ? (
                        <DriverClaims
                            id={"RIDER"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                    {advanced === "company_share" ? (
                        <CompanyShareSearch
                            id={"TRANSACTION"}
                            search={this.search}
                            extractReport={this.extractReport}
                            direction={this.props.direction}
                        />
                    ) : null}
                </Suspense>
                {this.props.isLoadingReportExcel ? <LinearProgress /> : null}
            </SearchContext.Provider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        direction: state.userPrefrence.direction,
    };
};

export default connect(mapStateToProps)(Search);
