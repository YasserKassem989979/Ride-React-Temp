import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemText,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField
} from "@material-ui/core";
import { translate } from "../../utils/translate";
import { Field } from "../UI/feild";

export const CreateJV = ({ title = "", subtitle = "", fromAccounts = [], toAccounts = [], onCreateJVClick, onCancelClick }) => {
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState(0);
    const [notes, setNotes] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const _onCancelClick = () => {
        setFromAccount({});
        setToAccount({});
        setAmount("");
        setNotes("");
        setIsConfirmOpen(false);
        onCancelClick();
    }

    const _openConfirmDialog = () => {
        setIsConfirmOpen(true);
    };
    const _closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    const _onCreateJVClick = () => {
        onCreateJVClick({
            from_account: fromAccount.id,
            to_account: toAccount.id,
            amount: parseFloat(amount),
            notes
        })
        _onCancelClick()
    }

    return (
        <Card>
            <CardContent>
                <Typography variant='body1' component='h4'>
                    {title}
                </Typography>
                <Typography variant='subtitle1' component='p'>
                    {subtitle}
                </Typography>
                <Divider light />

                {/* From Account */}
                <FormControl fullWidth style={{ margin: "1em 0px" }}>
                    <InputLabel> {translate("FROM_ACCOUNT")} </InputLabel>
                    <Select
                        value={fromAccount}
                        onChange={({ target: { value } }) => {
                            setFromAccount(value);
                        }}>
                        {fromAccounts.map((account, index) => {
                            return (
                                <MenuItem key={"FROM_ACCOUNT_" + index} value={account}>
                                    <ListItemText primary={account.name} secondary={account.balance} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                {/* To Account */}
                <FormControl fullWidth style={{ margin: "1em 0px" }}>
                    <InputLabel> {translate("TO_ACCOUNT")} </InputLabel>
                    <Select
                        value={toAccount}
                        onChange={({ target: { value } }) => {
                            setToAccount(value);
                        }}>
                        {toAccounts.map((account, index) => {
                            return (
                                <MenuItem key={"TO_ACCOUNT_" + index} value={account}>
                                    <ListItemText primary={account.name} secondary={account.balance} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                {/* Amount */}
                <FormControl fullWidth style={{ margin: "1em 0px" }}>
                    <TextField
                        label={translate("AMOUNT")}
                        value={amount}
                        onChange={({ target: { value } }) => {
                            setAmount(value);
                        }}
                    />
                </FormControl>

                {/* Notes */}
                <FormControl fullWidth style={{ margin: "1em 0px" }}>
                    <TextField
                        label={translate("NOTES")}
                        value={notes}
                        onChange={({ target: { value } }) => {
                            setNotes(value);
                        }}
                    />
                </FormControl>
            </CardContent>
            <CardActions>
                <Button onClick={_openConfirmDialog} variant='contained'>
                    {translate("CREATE")}
                </Button>
                <Button onClick={_onCancelClick} variant='contained' color='secondary'>
                    {translate("CANCEL")}
                </Button>
            </CardActions>

            <Dialog fullWidth open={isConfirmOpen} onClose={_closeConfirmDialog}>
                <DialogTitle>{translate("CONFIRM_CREATE_JV")}</DialogTitle>
                <DialogContent>
                    <Field title={translate("FROM")} value={fromAccount.name} />
                    <hr />
                    <Field title={translate("TO")} value={toAccount.name} />
                    <hr />
                    <Field title={translate("AMOUNT")} value={amount} />
                    <hr />
                    <Field title={translate("JV_NOTES")} value={notes} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={_onCreateJVClick} variant='contained'>
                        {translate("CONFIRM")}
                    </Button>
                    <Button onClick={_onCancelClick} variant='contained' color='secondary'>
                        {translate("CANCEL")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};
