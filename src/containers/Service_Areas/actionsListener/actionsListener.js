import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import { withWidth, Snackbar, SnackbarContent, Button } from '@material-ui/core';
// import styles from "./actionsListener.module.css"
import ActionConformation from "../../../components/actionConformation/actionConformation"
import axios from "../../../axios"
import Alert from "../../../components/Alert/alert"
import PriceCardForm from "./priceCardForm"
import PromoCodeForm from "./PromoCodeForm";
import AreaForm from "./areaForm"
import CreateNotification from "../../../components/NotificationCreator/CreateNotification"





export class ActionsListener extends Component {

    
    state={
        fullWidth:true,
        maxWidth:"sm",
        open:true,
        deleteAlert:false,
        isLoading:false
    };


    componentDidMount() {
        this.widthChanged()
    };

    componentDidUpdate(prevProps) {
        if(prevProps.width !==this.props.width){
            this.widthChanged()
        }
    }

    // ui change handler for the modal width 
    widthChanged = () =>{
        let max="sm";
        if(this.props.width!=="xl" && this.props.width!=="lg" && this.props.width!=="md"){
            max=this.props.width
        };
        this.setState({maxWidth:max})
    }
    
    
//actions handlers//////////////////
updatePromo = (action)=>{
    const id = this.props.documentIdForActionListener
        axios.put(`promo_codes/${action}/${id}`)
        .then(res=>{
            this.setState({open:false},()=>{
            setTimeout(()=>{
                this.props.onCloseAction(true);
                Alert.success("تمت العملية بنجاح")
            },200)})})
        .catch(err=>{
        this.setState({open:false},()=>{
            setTimeout(()=>{
                this.props.onCloseAction(false);
                Alert.error(err.data?err.data.message:"ERROR")
            },200)})})
    };

    DEACTIVATE_PROMO = ()=> {
        this.updatePromo("deactivate");
    }

    ACTIVATE_PROMO = () =>{
        this.updatePromo("activate");
    }


    DELETE_AREA = ()=>{
        this.setState({deleteAlert:true,open:false})
    };

    // continueDelete = ()=>{
    //     const {area} = this.props;
    //     this.setState({deleteAlert:false},()=>{
    //         axios.delete("users/"+rider.personal.id)
    //     .then(res=>{
    //     setTimeout(()=>{
    //         this.props.onCloseAction(true);
    //         Alert.success("تمت العملية بنجاح")
    //         },200)  
    //     })
    //     .catch(err=>{
    //         setTimeout(()=>{
    //             this.props.onCloseAction(false);
    //             Alert.error(err.data?err.data.message:"ERROR")
    //         },200)
    //     })
    //     })
    // }


    DELETE_PROMO = () => {
        const id = this.props.documentIdForActionListener
        axios.delete(`promo_codes/${id}`)
        .then(res=>{
            this.setState({open:false},()=>{
            setTimeout(()=>{
                this.props.onCloseAction(true);
                Alert.success("تمت العملية بنجاح")
            },200)})})
        .catch(err=>{
        this.setState({open:false},()=>{
            setTimeout(()=>{
                this.props.onCloseAction(false);
                Alert.error(err.data?err.data.message:"ERROR")
            },200)})})
    }


    CREATE_NOTIFICATION = (data) => {
        this.setState({isLoading:true})
        data.append('area',this.props.area.id)
        axios.post('/service_areas/notify',data,{
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
              }
        })
        .then(res=>{
            this.setState({open:false,isLoading:false},()=>{
                setTimeout(()=>{
                    this.props.onCloseAction(false);
                    Alert.success("تمت العملية بنجاح")
                },200)})
        })
        .catch(err=>{
            this.setState({open:false,isLoading:false},()=>{
                setTimeout(()=>{
                    this.props.onCloseAction(false);
                    Alert.error(err.data?err.data.message:"ERROR")
                },200)})
        });
    };

    render() {
        const {whatIsTheAction}=this.props
        let actionView = null;
        switch(whatIsTheAction){
            case "UPDATE_SERVICE-AREA_ACTIVE":
                return (
                    <Dialog
                    onClose={()=>this.props.onCloseAction(false)} 
                    maxWidth="lg"
                    fullScreen
                    open={this.state.open}
                    fullWidth={this.state.fullWidth}
                  >
                    <AreaForm
                    create={false}
                    area={this.props.area}
                    onClose={()=>this.props.onCloseAction(false)}
                    />
                    </Dialog>);

            case "CREATE_SERVICE-AREA":
                return (
                    <Dialog
                    onClose={()=>this.props.onCloseAction(false)} 
                    maxWidth="lg"
                    open={this.state.open}
                    fullWidth={this.state.fullWidth}
                  >
                    <AreaForm
                    create={true}
                    onClose={()=>this.props.onCloseAction(false)}
                    />
                    </Dialog>);

            case "DELETE_SERVICE-AREA_ACTIVE":
                actionView = (
                    <ActionConformation
                        actionName={whatIsTheAction}
                        cancelActionHandler={()=>this.props.onCloseAction(false)}
                        actionHandler={this.DELETE_AREA}
                        color="#980000"/>
                        );
                break;
            case "UPDATE_PRICE-CARD_NO-STATUS":
                    return <PriceCardForm
                    create={false}
                    area={this.props.area}
                    onCloseAction={this.props.onCloseAction}
                    priceCard={this.props.priceCard}/>
            case "CREATE_PRICE-CARD":
                    return <PriceCardForm
                    create={true}
                    area={this.props.area}
                    onCloseAction={this.props.onCloseAction}
                    priceCard={null}/>
            case "UPDATE_PROMO-CODE_ACTIVE":
                  actionView = (
                  <PromoCodeForm
                  create={false}
                  area={this.props.area}
                  promoDetails={this.props.promoDetails}
                  onClose={this.props.onCloseAction}
                  />);
                  break;
            case "UPDATE_PROMO-CODE_INACTIVE":
                    actionView = (<PromoCodeForm
                    area={this.props.area}
                    promoDetails={this.props.promoDetails}
                    onClose={this.props.onCloseAction}
                    />);
                    break;
            case "DEACTIVATE_PROMO-CODE_ACTIVE":
                actionView = (
                    <ActionConformation
                        actionName={whatIsTheAction}
                        cancelActionHandler={()=>this.props.onCloseAction(false)}
                        actionHandler={this.DEACTIVATE_PROMO}
                        color="#980000"/>
                        );
                     break;
            case "DELETE_PROMO-CODE_ACTIVE":
                actionView = (
                    <ActionConformation
                        actionName={whatIsTheAction}
                        cancelActionHandler={()=>this.props.onCloseAction(false)}
                        actionHandler={this.DELETE_PROMO}
                        color="#980000"/>);
                break;
            case "DELETE_PROMO-CODE_INACTIVE":
                actionView = (
                    <ActionConformation
                        actionName={whatIsTheAction}
                        cancelActionHandler={()=>this.props.onCloseAction(false)}
                        actionHandler={this.DELETE_PROMO}
                        color="#980000"/>);
                    break;
            case "ACTIVATE_PROMO-CODE_INACTIVE":
                actionView = (
                    <ActionConformation
                        actionName={whatIsTheAction}
                        cancelActionHandler={()=>this.props.onCloseAction(false)}
                        actionHandler={this.ACTIVATE_PROMO}
                        color="green"/>);
                    break;
            case "CREATE_PROMO-CODE":
                actionView = (
                <PromoCodeForm
                create={true}
                area={this.props.area}
                promoDetails={this.props.promoDetails}
                onClose={this.props.onCloseAction}
                  />);
                  break;
            case "CREATE_NOTIFICATION":
                actionView = (
                    <CreateNotification
                    actionName={whatIsTheAction}
                    cancelActionHandler={()=>this.props.onCloseAction(false)}
                    actionHandler={this.CREATE_NOTIFICATION}
                    isLoading={this.state.isLoading}
                    />
                        );
                         break;
            default:
                actionView=(<div></div>)
        }


        return (
            <>
            <Dialog
            onClose={()=>this.props.onCloseAction(false)} 
            fullWidth={this.state.fullWidth}
            maxWidth={this.state.maxWidth}
            open={this.state.open}
            aria-labelledby="max-width-dialog-title"
          >
           {actionView}
            </Dialog>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.deleteAlert}
                >
                <SnackbarContent
                style={{backgroundColor:"#D3392F"}}
                message={
                <p>لا يمكن التراجع عند القيام بالعملية</p>
                }
                action={[
                    <Button 
                    style={{color:"#D3392F",backgroundColor:"#fff"}}
                    key="fkfkfkfkfkfk"
                    size="small"
                    onClick={this.continueDelete}>
                   حذف الراكب
                </Button>,
                <Button
                style={{color:"#fff"}}
                key="fkjkgifikfojf"
                size="small"
                onClick={()=>this.props.onCloseAction(false)}>
                تراجع
            </Button>]}
            />
             </Snackbar>
            </>
        )
    }
}


export default withWidth()(connect()(ActionsListener));
