import React, { Suspense, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux"
import { CircularProgress } from '@material-ui/core';
// lazy load for modules
const Drivers = React.lazy(() => import('../Drivers/DriversContainer'));
const Riders = React.lazy(() => import("../Riders/RidersContainer"));
const Trips = React.lazy(() => import("../Trips/TripsContainer"));
const Vehicles = React.lazy(() => import("../Vehicles/VehiclesContainer"));
const ServiceAreas = React.lazy(() => import("../Service_Areas/ServiceAreasContainer"));
const Reports = React.lazy(() => import("../Reports/ReportsContainer"));
const ManualDispatch = React.lazy(() => import("../ManualDispatch/ManualDispatchContainer"));
const DriversMap = React.lazy(() => import("../DriversMap/DriversMapContainer"));

const Router = (props) => {
        const isLogged = useSelector(state => state.auth.isLogged)
        return (
                <Suspense fallback={
                        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                                <CircularProgress />
                        </div>}>
                        <Switch>
                                {isLogged ?
                                        <Fragment>
                                                <Route path="/drivers" component={Drivers} />
                                                <Route path="/manual_dispatch" component={ManualDispatch} />
                                                <Route path="/drivers_map" component={DriversMap} />
                                                <Route path="/riders" component={Riders} />
                                                <Route path="/rides" component={Trips} />
                                                <Route path="/vehicles" component={Vehicles} />
                                                <Route path="/service_areas" component={ServiceAreas} />
                                                <Route path="/reports" component={Reports} />
                                                <Route path="/drivers_map" component={DriversMap} />
                                                <Route path="/"><Redirect to="/home" /></Route>
                                        </Fragment>
                                        : null}
                        </Switch>
                </Suspense>
        )

}

export default Router
