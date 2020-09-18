import React, { Component } from 'react'
import styles from "./homepage.module.css"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux"
import {loginAction} from "../../store/actions/loginAction"
import LinearProgress from '@material-ui/core/LinearProgress';
import { theme } from '../../config/theme';
import {translate} from "../../utils/translate";
import Alert from '../../components/Alert/alert';
import AlertProvider from "../../components/Alert/AlertComponent" 
export class HomePage extends Component {

    state={
        email:"",
        password:"",
        email_error:false,
        password_error:false,
    };


    componentDidUpdate(prevProps, prevState) {
        if(this.props.error_message && prevProps.error_message !== this.props.error_message){
            Alert.error(this.props.error_message)
        }
    }
    



    emailHandler =(e)=>{
        //regexp to check if the format of the entered email is valid
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(String(e.target.value).toLowerCase())){
            this.setState({
                email:e.target.value,
                email_error:false
            })
        }else{
            this.setState({
                email:e.target.value,
                email_error:true
            })
        }
       
    };

    passwordHandler = (e)=>{
        this.setState({password:e.target.value,password_error:false})
    }



    loginHandler = ()=>{

        if(this.state.email_error){
            return
        }
        if(this.state.email===""){
            this.setState({email_error:true})
            return
        }
        if(this.state.password===""){
            this.setState({password_error:true})
            return
        }

        this.props.Login(this.state.email,this.state.password)
    }


    render() {
        return (
            
                
            <div className={styles.container}>
                <div className={styles.progressBar}>
                  {this.props.isLoading?<LinearProgress />:null}
                </div>
                <div className={styles.loginBox_wraper}>
                <div className={styles.LoginBox}>
                    <div className={styles.LoginBox_Title} ><h1 style={{color:theme().palette.primary.main}}>RIDE</h1>
                    </div>
                    
                    <div className={styles.LoginBox_Input}>
                    <TextField
                     classes={{root:styles.inputLabel}}
                     required
                     error={this.state.email_error}
                     value={this.state.email}
                     onChange={this.emailHandler}
                     label={translate("EMAIL")}
                     margin="normal"
                     type="email"
                     variant="outlined"/>
                     </div>
                    <div className={styles.LoginBox_Input}>
                    <TextField 
                    classes={{root:styles.inputLabel}}
                    onKeyPress={(e)=>{
                        if(e.key==="Enter"){
                            this.loginHandler()
                        }
                    }}
                    required
                    error={this.state.password_error}
                    value={this.state.password}
                    onChange={this.passwordHandler}
                     label={translate("PASSWORD")}
                     type="password"
                     margin="normal"
                     variant="outlined"/>
                     </div>
                     <div className={styles.LoginBox_Input}>
                     <Button 
                     type="submit"
                     onClick={this.loginHandler}
                     variant="contained" 
                     color="primary" 
                     style={{marginTop:15}} >
                      {translate("LOGIN")}
                    </Button>
                     </div>
                    
                </div>
                </div>
                <AlertProvider/>
            </div>
            
        )
    }
};


const mapStateToProps = (state)=>{
    return {
        isLoading:state.auth.isLoading,
        error_message:state.auth.error_message,
        direction:state.userPrefrence.direction
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        Login:(email,pass)=>dispatch(loginAction(email,pass))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
