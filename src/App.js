import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {AddMembers, BillUpload, SplitBill, ViewSplit, Copyright, VerifyBill} from './components';
import { css } from "@emotion/core";
import PulseLoader from "react-spinners/PulseLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  right: 50%;
`;

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
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
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const steps = ['Upload Bill', 'Verify Bill', 'Add Members', 'Review Split', 'View Split'];

export default function App() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [billFile, setBillFile] = React.useState('');
    const [billData, setBillData] = React.useState({});
    const [members, setMembers] = React.useState([]);
    const [memberSplit, setMemberSplit] = React.useState([])
    const [error, setError] = React.useState('');
    const [finalBillState, setFinalBill] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    const billUpload = async() => {
        console.log(billFile[0]);
        if(billFile) {
            setLoading(true);
            setError('');
            const formData = new FormData()
            formData.append('file', billFile[0])

            await fetch('http://3.136.154.91/detect', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data["status"] === "SUCCESS"){
                        setBillData(data);
                        setLoading(false);
                        setActiveStep(activeStep + 1);
                    }else {
                        setError("File could not be read. Upload a better photo.")
                    }

                })
                .catch(error => {
                    console.error(error)
                })
        }    else
            setError("No Valid File Added!");
    }

    const validateMembers = () => {
        if(members.length > 0) {
            setError("");
            setActiveStep(activeStep + 1);
        } else
            setError("Add at least one member");
    }

    const splitBillEqually = async () => {
        let finalBill = {};
        let totalofItems = billData['total'];
        members.forEach(member => {
            finalBill[member] = totalofItems/members.length
        })
        setFinalBill(finalBill);
    }

    const splitBill = async() => {
        let totalofItems = 0.0;
        const billItems = billData['items'].filter(item => {
            return !['tax', 'tip', 'sales tax', 'delivery fee', 'service tax', 'service fee', 'subtotal'].includes(item[0].toLowerCase())
        });
        let finalBill = {}
        billItems.forEach((item, index) => {
            totalofItems += parseFloat(item[1])
            memberSplit[index].forEach(member => {
                if(member in finalBill) {
                    finalBill[member] += parseFloat(item[1])/memberSplit[index].length
                } else {
                    finalBill[member] = parseFloat(item[1])/memberSplit[index].length
                }
            })
        });
        let servicesTotal = billData['total'] - totalofItems;
        Object.keys(finalBill).forEach(member => {
            finalBill[member] += servicesTotal*(finalBill[member]/totalofItems)
        });
        setFinalBill(finalBill);
    }

    const validateTotal = () => {
        let totalOfItems = 0.0;
        billData['items'].forEach(item => {
            totalOfItems += parseFloat(item[1])
        });
        totalOfItems = totalOfItems.toFixed(2);
        if(totalOfItems != parseFloat(billData['total'])) {
            setError("Total(" + billData['total'] + ") must match sum of items(" +totalOfItems.toString() + ")" )
            return false;
        }
        else {
            setError("")
            return true;
        }
    }

    const processAndSplitBill = () => {
        let validated = true;
        if(memberSplit.length === 0) {
            splitBillEqually().then(() => {
                setActiveStep(activeStep + 1)
            })
        } else {
            memberSplit.forEach(membersForItem => {
                if (membersForItem.length === 0) {
                    validated = false;
                }
            })
            if (validated === true) {
                setError("");
                splitBill().then(() => {
                    setActiveStep(activeStep + 1)
                });
            } else {
                setError("Select at least one person for each item");
            }
        }
    }

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                billUpload().then(() => {});
                break;
            case 1:
                validateTotal() && setActiveStep(activeStep + 1);
                break;
            case 2:
                validateMembers();
                break;
            case 3:
                processAndSplitBill();
                break;
            default:
                throw new Error('Unknown step');
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep === steps.length - 1 ? 0 : activeStep - 1);
    };

    const updateMemberList = (membersList) => {
        let newMembers = [];
        membersList.forEach(member => {
            newMembers.push(member['value'])
        })
        setMembers(prevState => newMembers);
    };

    const updateMemberSplit = (memberSplit) => {
        setMemberSplit(memberSplit)
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <BillUpload setBillFile={setBillFile}/>;
            case 1:
                return <VerifyBill billData={billData} setBilldata={setBillData} />
            case 2:
                return <AddMembers updateMemberList={updateMemberList}/>;
            case 3:
                return <SplitBill billData={billData} members={members} updateMemberSplit={updateMemberSplit} />;
            case 4:
                return <ViewSplit finalBill={finalBillState}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="absolute" color="default" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Bill Split
                    </Typography>
                </Toolbar>
            </AppBar>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        {steps[activeStep]}
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {getStepContent(activeStep)}
                        <PulseLoader
                            css={override}
                            size={10}
                            color={"#f57f17"}
                            loading={loading}
                        />
                        <div className={classes.buttons}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} className={classes.button}>
                                    {activeStep === steps.length - 1 ? 'New Bill' : 'Back'}
                                </Button>
                            )}
                            {activeStep !== steps.length-1 &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 2 ? 'Confirm Split' : 'Next'}
                            </Button>}
                        </div>
                    </React.Fragment>
                    <Typography variant="subtitle1" color="error" noWrap>
                        {error}
                    </Typography>
                </Paper>
                <Copyright/>
            </main>
        </React.Fragment>
    );
}