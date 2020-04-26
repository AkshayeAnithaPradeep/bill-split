import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from "@material-ui/icons/Add";

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
        fontSize: '1.2rem'
    },
    title: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    }
}));
const VerifyBill = props => {

    const {billData, setBilldata} = props;
    const classes = useStyles();
    const [totalError, setTotalError] = useState(false);
    const [modalValue, setModalValue] = useState('')

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    function handleRemove(idx) {
        const values = {...billData};
        values['items'].splice(idx, 1);
        setBilldata(values);
        validateTotal(values);
    }

    function handleAdd() {
        const values = {...billData};
        values['items'].push([modalValue, 0.0]);
        setBilldata(values);
        validateTotal(values);
        setOpen(false);
        setModalValue('');
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

    function handleNewItemChange(event) {
        setModalValue(event.target.value);
    }


    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Items
            </Typography>
            <List disablePadding>
                {billData['items'].map((product, idx) => (
                    <ListItem className={classes.listItem} key={product[0]}>
                        <Button type="button" onClick={() => handleRemove(idx)} startIcon={<CloseIcon />} className={classes.button}>
                        </Button>
                        <ListItemText primary={product[0]} />
                        <TextField value={product[1]} onChange={e => handleChange(idx, e)}/>
                    </ListItem>
                ))}
                <Button type="button" onClick={handleClickOpen} startIcon={<AddIcon />} className={classes.button}>
                    Add Item
                </Button>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total" classes={{primary:classes.total}}/>
                    <TextField value={billData['total']} error={totalError} onChange={handleTotalChange}/>
                </ListItem>
            </List>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="itemName"
                        label="Item Name"
                        type="text"
                        value={modalValue}
                        onChange={handleNewItemChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default VerifyBill;