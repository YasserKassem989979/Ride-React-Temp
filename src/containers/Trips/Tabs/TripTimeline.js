import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import styles from "./trips.module.css"
import {translate} from "../../../utils/translate"
const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      '& $line': {
        backgroundImage:
          'linear-gradient( 95deg,#14588d 0%,#4479a5 50%,#77acd6 100%)',
      },
    },
    completed: {
      '& $line': {
        backgroundImage:
        'linear-gradient( 95deg,#14588d 0%,#4479a5 50%,#77acd6 100%)',
      },
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
    },
  })(StepConnector);
  
  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#4479a5',
      zIndex: 1,
      color: '#fff',
      width: 40,
      height: 40,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundColor: '#4479a5',
    },
    completed: {
      backgroundColor: '#4479a5',
    },
  });
  
  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;
  
    const icons = {
      1: "fas fa-check-circle",
      2: "fas fa-user",
      3: "fas fa-tachometer-alt",
      4:"fas fa-map-marker-alt"
    };
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
      <i className={icons[props.icon]}></i>
      </div>
    );
  }

  
const TripTimeLine = (props) => {
    
    return (
        <Stepper classes={{root:styles.stepper,horizontal:styles.horizontalStepper}} activeStep={3} connector={<ColorlibConnector />}>
        {props.steps&&props.steps.map(step => {
          return step.caption ?<Step key={step.caption}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <div>
                <p style={{margin:"1px 0"}}>{translate(step.caption)}</p>
                <p style={{margin:"1px 0"}}>{step.time}</p>
              </div></StepLabel>
            </Step>:<Step key={Math.random()}></Step>
               })}
        </Stepper>
    )
}

export default TripTimeLine
