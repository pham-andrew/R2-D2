import { NavLink } from 'react-router-dom'
import '../App.css'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {Switch, Route} from "react-router-dom";



const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
    },
  }));

export default function Enroute () {

    const useStyles = useStyles()
    
    return (

      <div className={classes.root}>
      <Button variant="contained" color="primary">
        <NavLink exact to="/request-status/cancelled"
        style={{fontWeight: "bold", color: "white", textDecoration: "none"}} >Cancelled Requests</NavLink>
      </Button>
      <Button variant="contained" color="primary">
        <NavLink exact to="/request-status/completed"
        style={{fontWeight: "bold", color: "white", textDecoration: "none"}} >Completed Requests</NavLink>
      </Button>
      <Button variant="contained" color="primary">
        <NavLink exact to="/request-status/enroute"
        style={{fontWeight: "bold", color: "white", textDecoration: "none"}} >En route Requests</NavLink>
      </Button>
      <Button variant="contained" color="primary">
        <NavLink exact to="/request-status/pending"
        style={{fontWeight: "bold", color: "white", textDecoration: "none"}} >Pending Requests</NavLink>
      </Button>
      <Button variant="contained" color="primary">
        <NavLink exact to="/request-status/status"
        style={{fontWeight: "bold", color: "white", textDecoration: "none"}} >Status Page</NavLink>
      </Button>
    </div>
    )
}