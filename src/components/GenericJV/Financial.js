import React, { useState } from "react";
import {
    Typography,
    Paper,
    Dialog,
    DialogActions,
    Modal,
    TextField,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Button,
    IconButton,
    AppBar,
    Box,
    Divider
} from "@material-ui/core";
import { translate } from "../../utils/translate";
import BackIcon from "@material-ui/icons/ArrowForward";
import { TransactionsTable } from "../financialDetails/TransactionsTable";
import styles from "../../containers/Riders/Tabs/tabs.module.css";
import { CreateJV } from "./CreateJV";


export const Financial = ({ open, onClose, transactions, onStartTransaction, admin, fromAccounts, toAccounts, account }) => {

    let _account = account[0]|| account;
    let DeptAccountsTypes = [ 
        "CASH",
        "BANK",
        "CLAIM",
        "AR",
     ];

     let CreditAccountsTypes = [ 
        "AP",
        "WALLET",
     ];

     let blackListedAccounts = [
        "EX",
     ];

    const [_fromAccounts, setFromAccounts] = useState(fromAccounts);
    const [_toAccounts, setToAccounts] = useState(toAccounts);
    const [_open, setOpen] = useState(false);
    const [_title, setTitle] = useState("SETTLE_CLAIM");
    const isDept=type=>DeptAccountsTypes.includes(type);
    const isDisabled=type=>blackListedAccounts.includes(type);

    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <Toolbar>
                <IconButton onClick={onClose}>
                    <BackIcon />
                </IconButton>
                <Typography variant='body2' component='h4' style={{ width: "100%" }}>
                    {admin.firstName} {admin.lastName}{admin.full_name}
                </Typography>
                <Typography variant='h5' component='h2' style={{ width: "100%" }}>
                    {_account.name} ({_account.balance})
                </Typography>
                
                {/*"REINFORCING"*/}
                <Button
                disabled={ isDisabled(_account.type) } 
                color="primary"
                endIcon={<i className="fa fa-level-up-alt"/>}
                onClick={()=>{
                    setTitle(translate( isDept(_account.type) ? "REINFORCING" : "ADD_MONEY") )

                    setFromAccounts(fromAccounts);
                    setToAccounts(toAccounts)

                    setOpen(true)
                }}> {translate( isDept(_account.type) ? "REINFORCING" : "ADD_MONEY")} 
                </Button>
                <Divider light orientation={"vertical"} style={{ margin: "1em" }}/>
                {/* SETTLEMENT */}
                <Button
                disabled={ isDisabled(_account.type) || !isDept(_account.type) } 
                color="primary"
                endIcon={<i className="fa fa-level-down-alt"/>}
                onClick={()=>{
                    setTitle(translate("SETTLEMENT") )
                    setFromAccounts(toAccounts);
                    setToAccounts(fromAccounts);
                    setOpen(true)
                }}> {translate("SETTLEMENT")} 
                </Button>
            </Toolbar>

            <Dialog open={_open} onClose={()=>{ setOpen(false) }}>
                <CreateJV
                    onCancelClick={()=>{ setOpen(false) }}
                    fromAccounts={_fromAccounts}
                    toAccounts={_toAccounts}
                    title={_title}
                    subtitle="Transfer money"
                    onCreateJVClick={onStartTransaction}
                />
            </Dialog>
            <div style={{ overflowY: "scroll" }}>
                <Paper elevation={0} style={{ height: "100%" }}>
                    <TransactionsTable account={_account} />
                </Paper>
            </div>
        </Dialog>
    );
};
