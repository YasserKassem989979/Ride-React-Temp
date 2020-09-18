import React from "react";
import styles from "./ManualDispatch.module.css";
import {
    Paper,
    FormControlLabel,
    InputLabel,
    Input,
    InputAdornment,
    CircularProgress,
    Avatar,
    Select,
    Radio,
    RadioGroup,
    Fab,
    MenuItem,
    TextField,
    IconButton,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { DispatchContext } from "./ManualDispatchContainer";
import { translate } from "../../utils/translate";
import profilePic from "../../assets/FACEBOOK_LINE-01-512.png";
import config from "../../config/backendURLS";
import Skeleton from "@material-ui/lab/Skeleton";
import NavigationIcon from "@material-ui/icons/Navigation";
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MapPinIcon from "@material-ui/icons/PinDropOutlined";


const manualDispatchForm = () => {
    return (
        <DispatchContext.Consumer>
            {(values) => (
                <Paper elevation={0} className={styles.formPaper}>
                    <div className={styles.searchInput}>
                        <InputLabel style={{ minWidth: 115 }} htmlFor='input-with-icon-adornment'>
                            {translate("SEARCH")}
                        </InputLabel>
                        <Input
                            error={values.state.phone_error}
                            placeholder={translate("SEARCH_BY_NAME_PHONE")}
                            className={styles.inputtext}
                            onChange={values.onChangeText}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    values.search();
                                }
                            }}
                            value={values.state.phone}
                            name='phone'
                            id='input-with-icon-adornment'
                            endAdornment={
                                <InputAdornment style={{ minWidth: 25 }}>
                                    {values.state.isLoading ? <CircularProgress size={15} /> : <AccountCircleIcon />}
                                </InputAdornment>
                            }
                        />
                    </div>
                    {values.rider ? (
                        <div className={styles.riderInfo}>
                            <div className={styles.avatar}>
                                <Avatar
                                    src={
                                        values.rider && values.rider.profile_image
                                            ? `${config.hostDomain}${values.rider.profile_image}`
                                            : profilePic
                                    }
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                            <div className={styles.info}>
                                <p>{values.rider && values.rider.full_name}</p>
                                <p>
                                    {values.rider && values.rider.rating}{" "}
                                    <span>
                                        <i style={{ fontSize: 12, color: "#4478a5" }} className='fas fa-star'></i>
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.riderInfo}>
                            <div className={styles.avatar}>
                                <Skeleton disableAnimate={!values.state.isLoading} variant='circle' width={65} height={65} />
                            </div>
                            <div className={styles.info}>
                                <Skeleton disableAnimate={!values.state.isLoading} variant='text' width={100} />
                                <Skeleton disableAnimate={!values.state.isLoading} variant='text' width={100} />
                            </div>
                        </div>
                    )}
                    <div className={styles.bookingDetails}>
                        <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='CITY'>
                                {translate("CITY")}
                            </InputLabel>
                            <Select
                                error={values.state.area_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.area}
                                name='area'
                                id='CITY'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_AREA")}
                                </MenuItem>
                                {values.state.areas.map((area) => (
                                    <MenuItem key={area.name} value={area.id}>
                                        {area.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='SERVICE_TYPE'>
                                {translate("SERVICE_TYPE")} {values.state.isLoadingArea ? <CircularProgress size={11} /> : null}
                            </InputLabel>
                            <Select
                                error={values.state.service_type_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.service_type}
                                name='service_type'
                                id='SERVICE_TYPE'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_SERVICE_TYPE")}
                                </MenuItem>
                                {values.state.areaDetails &&
                                    values.state.areaDetails.service_types.map((service) => (
                                        <MenuItem key={service.name} value={service.id}>
                                            {service.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </div>
                        {/* <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='VEHICLE_TYPE'>
                                {translate("VEHICLE_TYPE")} {values.state.isLoadingArea ? <CircularProgress size={11} /> : null}{" "}
                            </InputLabel>
                            <Select
                                error={values.state.vehicle_type_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.vehicle_type}
                                name='vehicle_type'
                                id='VEHICLE_TYPE'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_VEHICLE_TYPE")}
                                </MenuItem>
                                {values.state.areaDetails &&
                                    values.state.areaDetails.vehicle_types.map(service => (
                                        <MenuItem key={service.name} value={service.id}>
                                            {service.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </div> */}
                        <div id='geocoder_pickup' className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='PICK_UP'>
                                {translate("PICK_UP")}
                            </InputLabel>
                            <Autocomplete
                                autoComplete
                                onChange={(event, newValue) => {
                                    values.onSelectPickupLocation(newValue);
                                }}
                                inputValue={values.state.pick_up_location}
                                disableOpenOnFocus
                                getOptionLabel={(option) => option.description}
                                options={values.state.pickup_locations}
                                loading={values.state.loadingPickupLocations}
                                renderInput={(params) => (
                                    <TextField
                                        onChange={values.onChangeText}
                                        value={values.state.pick_up_location}
                                        name='pick_up_location'
                                        className={styles.inputtext}
                                        {...params}
                                        placeholder='مثال: شارع الجامعة'
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {values.state.loadingPickupLocations ? (
                                                        <CircularProgress size={12} />
                                                    ) : (
                                                        <IconButton onClick={()=>{ values.centerMarker("pickup") }}>
                                                            <MapPinIcon style={{color: "#05f"}}/>
                                                        </IconButton>
                                                    )}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div id='geocoder_drop' className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='DROP_LOCATION'>
                                {translate("DROP_LOCATION")}
                            </InputLabel>
                            <Autocomplete
                                autoComplete
                                onChange={(event, newValue) => {
                                    values.onSelectDropLocation(newValue);
                                }}
                                inputValue={values.state.drop_location}
                                disableOpenOnFocus
                                getOptionLabel={(option) => option.description}
                                options={values.state.drop_locations}
                                loading={values.state.loadingDropLocations}
                                renderInput={(params) => (
                                    <TextField
                                        onChange={values.onChangeText}
                                        value={values.state.drop_location}
                                        name='drop_location'
                                        className={styles.inputtext}
                                        {...params}
                                        placeholder='مثال: المطار'
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {values.state.loadingDropLocations ? (
                                                        <CircularProgress size={12} />
                                                    ) : (
                                                        <IconButton onClick={()=>{ values.centerMarker("drop") }}>
                                                            <MapPinIcon style={{color: "#0a0"}}/>
                                                        </IconButton>
                                                    )}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles.radioGroup}>
                            <InputLabel style={{ minWidth: 115, minHeight: 20 }} htmlFor='TIME'>
                                {translate("TIME")}
                            </InputLabel>
                            <RadioGroup
                                aria-label='position'
                                name='ride_time'
                                value={values.state.ride_time}
                                onChange={values.onChangeRideTime}
                                row>
                                <FormControlLabel
                                    value={1}
                                    control={<Radio style={{ padding: "9px" }} color='primary' />}
                                    label={translate("RIDE_NOW")}
                                    labelPlacement='start'
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio style={{ padding: "9px" }} color='primary' />}
                                    label={translate("RIDE_LATER")}
                                    labelPlacement='start'
                                />
                            </RadioGroup>
                        </div>
                        {values.state.ride_time === 2 ? (
                            <div className={styles.datFiled}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        label={translate("DATE")}
                                        variant='inline'
                                        format='DD-MM-YYYY'
                                        id='date-picker-inline'
                                        value={values.state.selectedLaterDate}
                                        onChange={values.handleDateChange}
                                    />
                                    <KeyboardTimePicker
                                        id='time-picker'
                                        label={translate("TIME")}
                                        value={values.state.selectedTime}
                                        onChange={values.handleTimeChange}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        ) : null}
                        <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='PAYMENT_METHODE'>
                                {translate("PAYMENT_METHODE")}
                            </InputLabel>
                            <Select
                                error={values.state.payment_method_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.payment_method}
                                name='payment_method'
                                id='PAYMENT_METHODE'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_PAYMENT_METHODE")}
                                </MenuItem>
                                <MenuItem value={1}>{"CASH"}</MenuItem>
                                <MenuItem value={3}>{"WALLET"}</MenuItem>
                            </Select>
                        </div>
                        <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='PROMOCODES'>
                                {translate("PROMOCODES")} {values.state.isLoadingArea ? <CircularProgress size={11} /> : null}
                            </InputLabel>
                            <Select
                                error={values.state.promo_code_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.promo_code}
                                name='promo_code'
                                id='PROMOCODES'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_PROMOCODE")}
                                </MenuItem>
                                {values.state.areaDetails &&
                                    values.state.areaDetails.promo_codes.map((service) => (
                                        <MenuItem key={service.id} value={service.id}>
                                            {service.promo_code}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </div>
                        <div className={styles.bookingField}>
                            <InputLabel style={{ minWidth: 115 }} htmlFor='RADIUS'>
                                {translate("RADIUS")}
                            </InputLabel>
                            <Select
                                error={values.state.radius_error}
                                className={styles.inputtext}
                                onChange={values.onChangeText}
                                value={values.state.radius}
                                name='radius'
                                id='RADIUS'>
                                <MenuItem selected key={Math.random()} value={"selected"}>
                                    {translate("PLEASE_CHOOSE_RADIUS")}
                                </MenuItem>
                                {[1, 2, 3, 4, 5].map((radius) => (
                                    <MenuItem key={radius + Math.random()} value={radius}>
                                        <span style={{ direction: "ltr" }}>{`${radius} KM`}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.bookButton}>
                            <Fab
                                onClick={values.dispatchTrip}
                                variant='extended'
                                color='primary'
                                style={{ padding: "0 30px" }}
                                className={styles.margin}>
                                {values.state.isDispatching ? (
                                    <CircularProgress size={17} style={{ margin: "0 5px", color: "#FFF" }} />
                                ) : (
                                    <NavigationIcon />
                                )}
                                {translate("MANUAL_DISPATCH")}
                            </Fab>
                        </div>
                    </div>
                </Paper>
            )}
        </DispatchContext.Consumer>
    );
};

export default manualDispatchForm;
