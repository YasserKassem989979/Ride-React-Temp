import React, {PureComponent } from 'react'
import styles from "../ServiceAreas.module.css"
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { TextField,InputLabel,FormControlLabel,Checkbox,FormControl,Select,Input,Chip,MenuItem, Button, CircularProgress} from '@material-ui/core';
import {translate} from "../../../utils/translate"
import axios from "../../../axios"
import Alert from '../../../components/Alert/alert';
import DangerButton from '../../../components/dangerButton/dangerButton';

// just styling for documets menu
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export class areaDetails extends PureComponent {

    state={
       center:[35.8439,31.9754],
       areaSource:{},
       name:"",
       normal_service:[],
       document:[],
       vehicledocuments:[],
       latlong:[],
       economy:false,
       luxury:false,
       personalDocuments:[],
       personalDocumentsSelected:[],
       personalDocsToAxios:[],
       vehicledocumentsSelected:[],
       vehicleDocsToAxios:[],
       allAreas:[],
       allareastodraw:[],
       isLoading:false,
       name_error:""
    };


    changeTextHandler = (e)=>{
        this.setState({[e.target.name]:e.target.value,name_error:""})
    }

    componentDidMount() {
        this.getCoordinates();
        // this.getDocuments();

        // initilaize map and add controlers to it
        setTimeout(()=>{
        const map = new mapboxgl.Map({
          container: 'map-update',
          style: 'mapbox://styles/mapbox/streets-v8',
          zoom:9,
          center:[35.8439,31.9754]
        });
        // initilize draw controler and add it it map
        const draw = new MapboxDraw({});
        map.addControl(draw, 'top-left');
        // add fullscreen contoler
        map.addControl(new mapboxgl.FullscreenControl());
        map.dragPan.disable();
        //when map loaded add polygon feature to map
        map.on('load', ()=> {
            const feature = {
                id: 'unique-id',
                type: 'Feature',
                properties: {},
                geometry: this.state.areaSource.data.geometry
              };
              if(!this.props.create){
                draw.add(feature);
              }
            // iterate and add all areas polygons    
            this.state.allareastodraw.forEach(area=>{
                map.addLayer(area);
            })
        });
        
        // add handler when the area updated
        map.on('draw.update', this.updateArea);
        map.on('draw.create', this.updateArea);
        },100)
    };


    updateArea = (e) => {
        // get the updated area and reverse lat with long
        let newArea = e.features[0]["geometry"]["coordinates"][0].map(ele=>{
            return {"latitude":ele[1],"longitude":ele[0]}
        });

        this.setState({latlong:JSON.stringify(newArea)})
    }


    getCoordinates= async ()=>{

        const {area} = this.props;
        let  areaCoordinates=[];
        let areasCoordinates =[];

        // to get all areas polygons 
       const data = await axios.get("service_areas/all_areas_coordinates")

       const allareasData = await axios.get("service_areas/all_documents")

        data.data.forEach(ele=>{
         let jsonArea = JSON.parse(ele.coordinates);
         jsonArea[0] =  jsonArea[jsonArea.length-1]
         // push the Geojson featuer
         if(this.props.create || ele.id !== area.id){
            areasCoordinates.push({
                'id': Math.random()+"",
                'type': 'fill',
                'source': {
                'type': 'geojson',
                'data': {
                'type': 'Feature',
                'geometry': {
                    "type": "Polygon",
                    "coordinates":  [jsonArea.map(point=>{
                        return[parseFloat(point.longitude),parseFloat(point.latitude)]
                    })]}}},
                'layout': {},
                'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8}
                })
         }
        });

        // to get the geojson for the selected area
         if(area && area.coordinates){
            let jsonArea = JSON.parse(area.coordinates);
            areaCoordinates = [jsonArea.map(point=>{
                return[parseFloat(point.longitude),parseFloat(point.latitude)]
            })];
         // small enhancment to make the first point of the polygon as the last poit of it
         areaCoordinates[0][areaCoordinates[0].length-1] = areaCoordinates[0][0]
        };

       
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

        let personalIdArray=area?area.driver_documents.map(ele=>{
            return ele.id 
        }):[]
        let selectedDriverDocuments = area?area.driver_documents.map(ele=>{
            return ele.id + "_" + ele.name
        }):[]
        let vehicleIdArray=area ?area.vehicle_documents.map(ele=>{
            return ele.id 
        }):[]
       let selectedVehicleDocuments = area?area.vehicle_documents.map(ele=>{
            return ele.id + "_" + ele.name
        }):[]
        let luxury = false;
        let economy =false;
        area && area.vehicle_types.forEach(ele=>{
            if(ele.id===23){
                economy =true;
            }else if(ele.id===24){
                luxury = true
            }
        });

        this.setState({areaSource,
                        name:area ? area.summary.name:"",
                        country:area ? area.summary.parent.name:"",
                        activation_status:area ? area.summary.activation_status:"",
                        time_zone:area ? area.time_zone:"",
                        allareastodraw:areasCoordinates,
                        personalDocumentsSelected:selectedDriverDocuments,
                        vehicledocumentsSelected:selectedVehicleDocuments,
                        luxury,
                        economy,
                        personalDocuments:allareasData.data,
                        personalDocsToAxios:personalIdArray,
                        vehicleDocsToAxios:vehicleIdArray
                        })
    };


    personalDocumentsHandler = event => {
        let idArray=[];
        event.target.value.forEach(ele=>{
            idArray.push(ele.split("_")[0]);
        })
        this.setState({personalDocumentsSelected:event.target.value,personalDocsToAxios:idArray})
      };

    vehicledocumentsHandler = event =>{
        let idArray=[];
        event.target.value.forEach(ele=>{
            idArray.push(ele.split("_")[0]);
        })
        this.setState({vehicledocumentsSelected:event.target.value,vehicleDocsToAxios:idArray})
      };

    // on update area handler
    updateAreaHandler = () =>{
          const {area} = this.props;

          if(this.state.name === "") {
            this.setState({name_error:translate("PLEASE_CHOOSE_NAME")})
            return
        }

          const service_normal=[];
          if(this.state.luxury){
            service_normal.push(24)
          }
          if(this.state.economy){
            service_normal.push(23)
          };
        
          let params={
              country:12,
              timezone:"Asia/Amman",
              name:this.state.name,
              normal_service:service_normal,
              document:this.state.personalDocsToAxios,
              vehicledocuments:this.state.vehicleDocsToAxios,
              lat:this.state.latlong
          };


          this.setState({isLoading:true});

          if(this.props.create){
            axios.post(`/service_areas`,{},{
                params
            })
            .then(res=>{
                this.setState({isLoading:false});
                Alert.success(translate("SUCCESS_REQUEST"));
            })
            .catch(err=>{
              this.setState({isLoading:false});
              Alert.error(err.data?err.data.message:"ERROR")
            });
            return;
          }

          axios.post(`/service_areas/${area.id}`,{
              _method: "put",
              ...params
          })
          .then(res=>{
              this.setState({isLoading:false});
              Alert.success(translate("SUCCESS_REQUEST"));
          })
          .catch(err=>{
            this.setState({isLoading:false});
            Alert.error(err.data?err.data.message:"ERROR")
          })
      }
      
    render() {
      
        return (
           <div className={styles.areaWrapper}>
                
            <div >
            <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("NAME")}:</InputLabel>
                <TextField
                    name="name"
                    variant="outlined"
                    onChange={this.changeTextHandler}
                    value={this.state.name}
                    placeholder={translate("NAME")}
                />

                <div>
                    <h4 style={{color:"red"}}>{this.state.name_error}</h4>
                </div>
            </div>
            <div className={styles.normalServiceWrapper}>
                <div >
                    <h4>{translate("NORMAL_SRVICE_TYPE")}</h4>
                </div>
                <div  className={styles.normaServiceCheckboxWrapper}>
                <div >
                <FormControlLabel
                control={
                <Checkbox 
                checked={this.state.economy} 
                onChange={()=>this.setState({economy:!this.state.economy})} 
                value={23} />
                }
                label={translate("ECONOMY")}
                />
                </div>
                <div >
                <FormControlLabel
                control={
                <Checkbox 
                checked={this.state.luxury} 
                onChange={()=>this.setState({luxury:!this.state.luxury})} 
                value={24} />
                }
                label={translate("LUXURY")}
                />
                </div>
                </div>
                
          
            </div>
            <div className={styles.docements}>
                 <div className={styles.personalDocuments}>
                 <FormControl className={styles.formControl}>
                <InputLabel id="personalDocuments">{translate("PERSONAL_DOCUMENT_REQUIRED")}</InputLabel>
                <Select
                labelId="personalDocuments"
                multiple
                value={this.state.personalDocumentsSelected}
                onChange={this.personalDocumentsHandler}
                input={<Input id="select-multiple-chip-personal" />}
                renderValue={selected => (
                    <div className={styles.chips}>
                    {selected.map(value => (
                        <Chip key={value} label={value} className={styles.chip} />
                    ))}
                    </div>
                )}
                MenuProps={MenuProps}
                >
                {this.state.personalDocuments.map(document => (
                    <MenuItem key={document.name} value={document.id +"_"+ document.name}>
                    {document.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
                 </div>
                 <div className={styles.personalDocuments}>
                 <FormControl className={styles.formControl}>
                <InputLabel id="vehicledocuments">{translate("VEHICLE_DOCUMENT_REQUIRED")}</InputLabel>
                <Select
                labelId="vehicledocuments"
                multiple
                value={this.state.vehicledocumentsSelected}
                onChange={this.vehicledocumentsHandler}
                input={<Input id="select-multiple-chip-document" />}
                renderValue={selected => (
                    <div className={styles.chips}>
                    {selected.map(value => (
                        <Chip key={value} label={value} className={styles.chip} />
                    ))}
                    </div>
                )}
                MenuProps={MenuProps}
                >
                {this.state.personalDocuments.map(document => (
                    <MenuItem key={document.name} value={document.id +"_"+ document.name}>
                    {document.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
                 </div>
            </div>



            <div id="map-update" style={{direction:"ltr",position:'relative',height:400}} >
            </div>
            <div className={styles.updateArea}>
                <Button 
                color="primary" 
                variant="contained" 
                style={{margin:"0 10px"}}
                onClick={this.updateAreaHandler}>
                    {this.props.create?translate("CREATE_SERVICE-AREA"):translate("refresh")}
                </Button>
                <DangerButton
                onClick={this.props.onClose}>
                    {translate("CANCEL")}
                </DangerButton>
               
               <div style={{display:'flex',justifyContent:'center',margin:"0 15px",minWidth:20,alignItems:'center'}}>
               {this.state.isLoading?<CircularProgress size={20} />:null}
                </div>
            </div>
            </div>
            
        )
    }
}

export default areaDetails;
