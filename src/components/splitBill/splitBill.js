import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));
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

const SplitBill = props => {
    const classes = useStyles();
    const [value, setValue] = React.useState('equal');
    const [showSplit, setShowSplit] = React.useState(false);
    const {billData, members, updateMemberSplit} = props;
    const billItems = billData['items'].filter(item => {
        return !['tax', 'tip', 'sales tax', 'delivery fee', 'service tax', 'service fee', 'subtotal'].includes(item[0].toLowerCase())
    });

    const [memberSplit, setMemberSplit] = React.useState([...Array(billItems.length)].map(() => []));

    const handleChange = (event) => {
        let tempVal = event.target.value
        setValue(tempVal);
        if(tempVal === 'equal') {
            setShowSplit(false);
            updateMemberSplit([]);
        } else {
            setShowSplit(true);
        }
    };

    const handleSelectChange = (event, index) => {
        let tempMemberSplit = [];
        billItems.forEach((item, index) => {
            tempMemberSplit.push(memberSplit[index])
        });
        tempMemberSplit[index] = event.target.value;
        setMemberSplit(tempMemberSplit);
        updateMemberSplit(tempMemberSplit);
    };

    return(
        <React.Fragment>
            <FormControl component="fieldset">
                <FormLabel >How do you want your bill to be split?</FormLabel>
                <RadioGroup aria-label="split" name="split1" value={value} onChange={handleChange}>
                    <FormControlLabel value="equal" control={<Radio />} label="Split Bill Equally" />
                    <FormControlLabel value="unequal" control={<Radio />} label="Split Bill Unequally" />
                </RadioGroup>
            </FormControl>
            {showSplit &&
            <Box className={classes.root}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {"For each item, select amongst whom it should be shared with. "}
                </Typography>
                {billItems.map((item, index) => {
                    return(
                        <FormControl component="fieldset">
                            <FormLabel component="label" color="primary">{item[0]}</FormLabel>
                            <Select
                                labelId="demo-mutiple-chip-label"
                                id="demo-mutiple-chip"
                                multiple
                                value={memberSplit[index]}
                                onChange={ e => handleSelectChange(e, index)}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {members.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={memberSplit[index].indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )
                })}
            </Box>}
        </React.Fragment>
    )
}

export default SplitBill;