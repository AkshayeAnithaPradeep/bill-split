import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const products = [
    { name: 'Product 1', desc: 'A nice thing', price: '$9.99' },
    { name: 'Product 2', desc: 'Another thing', price: '$3.45' },
    { name: 'Product 3', desc: 'Something else', price: '$6.51' },
    { name: 'Product 4', desc: 'Best thing of all', price: '$14.11' },
    { name: 'Shipping', desc: '', price: 'Free' },
];

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
}));
const VerifyBill = props => {

    const {billData, setBilldata} = props;
    const classes = useStyles();
    const [totalError, setTotalError] = useState(false);

    function handleChange(i, event) {
        const values = {...billData};
        values['items'][i][1] = event.target.value.toString();
        setBilldata(values);
        validateTotal(values);
    }

    function handleTotalChange(event) {
        const values = {...billData};
        values['total'] = event.target.value.toString();
        setBilldata(values);
        validateTotal(values);
    }

    const validateTotal = (values) => {
        console.log(values);
        let totalOfItems = 0.0;
        values['items'].forEach(item => {
            totalOfItems += parseFloat(item[1])
        });
        totalOfItems = totalOfItems.toFixed(2);
        if(totalOfItems != parseFloat(values['total']))
            setTotalError(true)
        else
            setTotalError(false)
    }


    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding>
                {billData['items'].map((product, idx) => (
                    <ListItem className={classes.listItem} key={product[0]}>
                        <ListItemText primary={product[0]} />
                        <TextField value={product[1]} onChange={e => handleChange(idx, e)}/>
                    </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total" />
                    <TextField value={billData['total']} error={totalError} onChange={handleTotalChange}/>
                </ListItem>
            </List>
        </React.Fragment>
    )
}

export default VerifyBill;