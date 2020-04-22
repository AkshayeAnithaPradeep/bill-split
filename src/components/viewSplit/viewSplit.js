import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    }
}));
const ViewSplit = props => {
    const finallBill = props.finalBill;
    const classes = useStyles();
    return (
        <React.Fragment>
            <Paper className={classes.paper}>
                <Typography component="h6" variant="h6" align="center">
                    {"What Each Owes"}
                </Typography>
                {Object.keys(finallBill).map(member => (
                    <div>
                        <Typography component="body1" align={"center"}>
                            {member + " owes $" + finallBill[member].toFixed(2).toString()}
                        </Typography>
                    </div>
                ))}
            </Paper>
        </React.Fragment>
    )
}

export default ViewSplit;