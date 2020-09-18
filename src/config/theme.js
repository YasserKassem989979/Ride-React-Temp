import { createMuiTheme,responsiveFontSizes } from '@material-ui/core/styles';


export const theme = (dir)=>{

    return responsiveFontSizes(createMuiTheme({
      overrides: {
        // Style sheet name ⚛️
        MuiTableHead: {
          // Name of the rule
          root: {
            // Some CSS
            backgroundColor: '#e0e0e0',
            height:"35px"
          },
        },
        MuiTableCell:{
          sizeSmall:{
            padding:"6px 12px 6px 12px"
          }
        }
      },
        typography:{
            fontFamily:"Cairo",
            
        },
        zIndex:{
            mobileStepper: 1000,
            speedDial: 1050,
            appBar: 1100,
            drawer: 1200,
            modal: 1300,
            snackbar: 1400,
            tooltip: 1500
        },
        direction:dir,
        palette: {
            primary: {
             light: "#77acd6",
              main: '#4479a5',
              dark: '#14588d',
              
             
              // contrastText: will be calculated to contrast with palette.primary.main
            },
            secondary: {
              light: '#76acd7',
              main: '#14588d',
              // dark: will be calculated from palette.secondary.main,
            //  contrastText: '#ffcc00',
            },
          },
        
      }))
}


/*
PRIMARY_DARK  : "#14588d", // Status bar, ...
  PRIMARY  : "#4479a5", // Buttons, Headers, Icons, ...
  ACCENT : "#77acd6", //
  TEXT: "#FEFEFE", //
​
  WHITE : "#F2F2F2",
  BLACK : "#242a38",
  GRAY : "#a7a9ac",
​
  // Fallback(s), Backward compatibility
  DANGER: "#980000", // Errors, Network connections alerts, ...
  WARNING: "#ffa940",
​
  SECONDARY : "#4379a4",
  SECONDARY_LITE : "#76acd7",
  password= 
  */