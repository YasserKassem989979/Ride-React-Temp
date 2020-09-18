import React, {PureComponent } from 'react'
import styles from "../ServiceAreas.module.css"
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {Paper} from '@material-ui/core';
import {translate} from "../../../utils/translate"
import { connect } from 'react-redux';
import ActionsMenu from "../../../components/actionsMenu/actionsMenu";

export class areaDetails extends PureComponent {

    state={
       center:[35.8439,31.9754],
       areaSource:{},
       name:"",
       normal_service:[],
       document:[],
       vehicledocuments:[],
       timezone:"Asia/Amman",
       latlong:[],
       country:"",
       activation_status:""
    };

    componentDidMount() {
        this.getCoordinates();
        // initilaize map and add controlers to it
        setTimeout(()=>{
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v8',
          zoom:9,
          center:[35.8439,31.9754]
        });
        // initilize draw controler and add it it map
        const draw = new MapboxDraw({
            displayControlsDefault:false,
            keybindings:false,
            touchEnabled:false
        });
        map.addControl(draw, 'top-left');
        // add fullscreen contoler
        map.addControl(new mapboxgl.FullscreenControl());
        //when map loaded add polygon feature to map
        map.on('load', ()=> {
            const feature = {
                id: 'unique-id',
                type: 'Feature',
                properties: {},
                geometry: this.state.areaSource.data.geometry
              };
            draw.add(feature);
        });
        
        // add handler when the area updated
        // map.on('draw.update', this.updateArea);
        },100)
    };


    updateArea = (e) => {
        console.log(e)
    }


    getCoordinates=()=>{
        const {area} = this.props;
        let  areaCoordinates=[];
         if(area.coordinates){
            let jsonArea = JSON.parse(area.coordinates);
            areaCoordinates = [jsonArea.map(point=>{
                return[parseFloat(point.longitude),parseFloat(point.latitude)]
            })]
        };
        // small enhancment to make the first point of the polygon as the last poit of it
         areaCoordinates[0][areaCoordinates[0].length-1] = areaCoordinates[0][0]

         let areaSource =  {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": areaCoordinates
                }
            }
        };
         this.setState({areaSource,
                        name:area.summary.name,
                        country:area.summary.parent.name,
                        activation_status:area.summary.activation_status,
                        time_zone:area.time_zone })
    }


    render() {
      
        return (
            <div className={styles.areaWrapper}>
                <Paper className={styles.areaDetails}>
                  <div className={styles.areaDetaislItem}>
                      <p style={{margin:"0 5px"}}>{translate("NAME")}:</p>
                      <p>{this.state.name}</p>
                  </div>
                  <div className={styles.areaDetaislItem}>
                      <p style={{margin:"0 5px"}}>{translate("THE_COUNTRY")}:</p>
                      <p>{this.state.country}</p>
                  </div>
                  <div className={styles.areaDetaislItem}>
                      <p style={{margin:"0 5px"}}>{translate("TMIEZONE")}:</p>
                      <p>{this.state.timezone}</p>
                  </div>
                  <div className={styles.areaDetaislItem}>
                      <p style={{margin:"0 5px"}}>{translate("STATUS")}:</p>
                      <p>{this.state.activation_status}</p>
                  </div>
                  <div className={styles.areaDetaislItem}>
                     <ActionsMenu 
                     object="SERVICE-AREA"
                     status={this.state.activation_status}
                    //  iconButtonStyle={{padding:"5px"}}
                     onActionClicked={this.props.onActionClicked}
                     />
                  </div>
                </Paper>
            <div id="map" style={{direction:"ltr",position:'relative'}} className={styles.mapContainer}>
            </div>
            <div className={styles.updateArea}>
                
            </div>
            </div>
        )
    }
}


const mapStateToProps = state =>{
    return {
        permissions:state.permissions.permissions
    }
}

export default connect(mapStateToProps)(areaDetails);
