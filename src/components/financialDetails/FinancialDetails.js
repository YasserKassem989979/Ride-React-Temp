import React, { useState } from "react";
import SummaryAccountCard from "../summaryAccountCard/summaryAccountCard";
import { CircularProgress } from "@material-ui/core";
import { translate } from "../../utils/translate";
import styles from "../../containers/Riders/Tabs/tabs.module.css";
import ActionsMenu from "../actionsMenu/actionsMenu";
import axios from "../../axios";
import { TransactionsTable } from "./TransactionsTable";
import { Financial } from "../../components/GenericJV/Financial";
import Alert from "../../components/Alert/alert";

const DriverFinancialDetails = (props) => {
  let item = props.id === "driver" ? props.state.driver : props.state.rider;

  const [openFinancialModal, setOpenFinancialModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const financialDataInitial = {
    amount: 0, // Transaction amount
    description: "", // Transaction Notes
    toPersonId: item.personal.id, // Driver Id | Rider Id
    account: {}, // Admin Account
  };

  const [financialData, setFinancialData] = useState(financialDataInitial);
  // const [isAdminAccountsLoading, setIsAdminAccountsLoading] = useState(false);
  const [adminAccounts, setAdminAccounts] = useState([]);

  const _openFinancialModal = () => {
    setOpenFinancialModal(true);

    getAdminAccounts()
      .then(setAdminAccounts)
      .catch(() => {
        setOpenConfirmDialog(false);
      });
  };

  const _closeFinancialModal = () => {
    setOpenFinancialModal(false);
    setFinancialData(financialDataInitial);
  };

  const getAdminAccounts = async () => {
    return axios.get("/cash_accounts").then((response) => {
      // Format accounts
      return response.data.map((account) => {
        account.disabled = false;
        // If the account exceeded its maximum or minimum balance disable it
        if (
          (account.minimum_balance &&
            account.balance <= account.minimum_balance) ||
          (account.maximum_balance &&
            account.balance >= account.maximum_balance)
        )
          account.disabled = true;
        return account;
      });
    });
  };

  const _confirmTransaction = (jv) => {
    if (props.id == "rider") _confirmAddMoneyToWalletTransaction(jv);
    else _confirmGeneralJV(jv);
  };
  const _confirmGeneralJV = (jv) => {
    axios
      .post("/accounts/transfer", { ...jv })
      .then((response) => {
        Alert.success(translate("SUCCESS"));
        getAdminAccounts();
        _closeFinancialModal();
      })
      .catch((error) => {
        Alert.error("ERROR");
      });
  };

  const _confirmAddMoneyToWalletTransaction = (data) => {
    axios
      .post("/users/recharge_wallet", {
        amount: data.amount,
        user_id: item.personal.id,
        account_id: data.from_account,
        description: data.notes,
      })
      .catch((error) => {
        Alert.error("ERROR");
      })
      .then(() => {
        _closeFinancialModal();
      });
  };

  return (
    <>
      {/* Accounts summary cards */}
      <div className={styles.financialCardsWrapper}>
        {item &&
          item.accounts &&
          item.accounts.map((account) => {
            return (
              <SummaryAccountCard
                onClick={props.geTransactions}
                key={account.id}
                account={account}
              />
            );
          })}
      </div>

      {!props.state.isLoadingTransactions &&
        props.state.isTransactionsRequested && (
          <ActionsMenu
            object="JV"
            status={null}
            onActionClicked={_openFinancialModal}
          />
        )}

      {/* Is Loading */}
      {props.state.isLoadingTransactions ? (
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}
        >
          <CircularProgress />
        </div>
      ) : null}

      {/* If no account selected show alert */}
      {!props.state.isLoadingTransactions &&
      !props.state.isTransactionsRequested ? (
        <div className={styles.chooseAccountText}>
          <p>{translate("PLEASE_CHOOSE_ACCOUNT")}</p>
        </div>
      ) : null}

      {/* If selected account has no transactions show alert */}
      {!props.state.isLoadingTransactions &&
      props.state.isTransactionsRequested &&
      props.state.transactions.length === 0 ? (
        <div className={styles.chooseAccountText}>
          <p>{translate("NO_TRANSACTIONS")}</p>
        </div>
      ) : null}

      {/* Transactions */}
      {!props.state.isLoadingTransactions &&
      props.state.isTransactionsRequested &&
      props.state.transactions &&
      props.state.transactions.length > 0 ? (
        <TransactionsTable
          account={props.state.selectedAccount}
          height="50vh"
        />
      ) : null}
      {props.state.selectedAccount ? (
        <Financial
          open={openFinancialModal}
          onClose={_closeFinancialModal}
          admin={item.personal}
          transactions={props.state.transactions}
          fromAccounts={adminAccounts}
          toAccounts={[props.state.selectedAccount]}
          onStartTransaction={_confirmTransaction}
          account={[props.state.selectedAccount]}
        />
      ) : null}
    </>
  );
};

export default DriverFinancialDetails;
