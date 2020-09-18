import React from "react";
import { TextField, Select, MenuItem, Card, InputLabel, Button, CircularProgress } from "@material-ui/core";
import axios from "../../../axios";
import { translate } from "../../../utils/translate";

export class UpdateVehicle extends React.Component {
    state = {
        makes: [],
        models: [],
        make: this.props._make,
        model: this.props._model,
        year: this.props._year,
        isLoading:false
    };

    _onSaveClicked = () => {
        this.props.onSave({
            make: this.state.make,
            model: this.state.model,
            year: this.state.year,
            vehicle_id: this.props._id
        });
        this.props.onClose();
    };

    getMakesList = () => {
        this.setState({isLoading:true})
        axios.get("/vehicles/makes").then(response => {
            this.setState({
                makes: response.data,
                make: response.data.find(e => (e.name = this.props._make)).id
            }, ()=>{
                this.getModelsList(this.state.make)
            });
        });
    };

    getModelsList = id => {
        axios.get(`/vehicles/models/${id}`).then(response => {
            this.setState({
                make: id,
                isLoading:false,
                models: response.data,
                model: response.data.find(e => (e.name = this.props._model)).id
            });
        });
    };

    _onChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };

    componentDidMount() {
        this.getMakesList();
    }

    render() {
        const { make, makes, model, models, year,isLoading } = this.state;
        return (
            <Card style={{ padding: "1em" }}>
                <InputLabel>{translate("VEHICLE_MAKE")}</InputLabel>
                <Select fullWidth title='VEHICLE_MAKE' value={make} name='make' onChange={({ target: { name, value } }) => {this.getModelsList(value)}}>
                    {makes.map(make => (
                        <MenuItem value={make.id}>{make.name}</MenuItem>
                    ))}
                </Select>
                <InputLabel style={{marginTop:5}}>{translate("VEHICLE_MODEL")}</InputLabel>
                <Select fullWidth title='VEHICLE_MODEL' value={model} name='model' onChange={this._onChange}>
                    {models.map(model => (
                        <MenuItem value={model.id}>{model.name}</MenuItem>
                    ))}
                </Select>
                <InputLabel style={{marginTop:5}}>{translate("VEHICLE_MAKE_YEAR")}</InputLabel>
                <TextField value={year} name='year' onChange={this._onChange} fullWidth />
                <Button style={{marginTop:5}} onClick={this._onSaveClicked}>{isLoading? <CircularProgress size={15}/>:translate("SAVE")}</Button>
            </Card>
        );
    }
}
