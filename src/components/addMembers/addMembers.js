import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    button: {
        margin: theme.spacing(1),
    },
}));


const AddMembers = props => {
    const classes = useStyles();
    const [fields, setFields] = React.useState([{ value: null }]);
    const {updateMemberList} = props;

    function handleChange(i, event) {
        const values = [...fields];
        values[i].value = event.target.value;
        setFields(values);
        updateMemberList(values)
    }

    function handleAdd() {
        const values = [...fields];
        values.push({ value: null });
        setFields(values);
        updateMemberList(values)
    }

    function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
        updateMemberList(values)
    }

    return (
        <React.Fragment>

            {fields.map((field, idx) => {
                return (
                    <div key={`${field}-${idx}`}>
                        <TextField
                            type="text"
                            placeholder="Name"
                            value={field.value || ""}
                            onChange={e => handleChange(idx, e)}
                        />
                        <Button type="button" onClick={() => handleRemove(idx)} startIcon={<CloseIcon />} className={classes.button}>
                        </Button>
                    </div>
                );
            })}
            <Button type="button" onClick={() => handleAdd()} startIcon={<AddIcon />} className={classes.button}>
                Add Member
            </Button>
        </React.Fragment>
    )
}

export default AddMembers;