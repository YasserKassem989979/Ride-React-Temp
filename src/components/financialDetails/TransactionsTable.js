import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  TableFooter,
  TableBody,
  CircularProgress,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { translate } from "../../utils/translate";
import axios from "../../axios";
import InfiniteScroll from "react-infinite-scroll-component";
import RefreshIcon from "@material-ui/icons/Refresh";

export const TransactionsTable = ({ account, height = "80vh" }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const _getTransactions = () => {
    axios
      .get(`/accounts/transactions/${account.id}`, {
        params: { page: currentPage },
      })
      .then((response) => {
        setTransactions([...transactions, ...response.data.data]);
        setHasMore(response.data.next_page_url);
        setCurrentPage(currentPage + 1);
      })
  };

  useEffect(() => {
    _getTransactions();
  });

  // to calculate the total of transactions amount
  let totalD = transactions
    .reduce((acc, item) => {
      return item.op === "D" ? acc + parseFloat(item.amount) : acc + 0;
    }, 0)
    .toFixed(2);
  let totalC = transactions
    .reduce((acc, item) => {
      return item.op === "C" ? acc + parseFloat(item.amount) : acc + 0;
    }, 0)
    .toFixed(2);

  const _reset = () => {
    setTransactions([]);
    setCurrentPage(0);
    setHasMore(true);
    _getTransactions();
  };

  return (
    <>
      <Toolbar style={{ background: "#eee" }}>
        <Typography variant="body1" component="h4">
          {account.name}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          style={{ margin: "0px 1em", width: "60%" }}
        >
          {account.balance + " " + account.currency}
        </Typography>
        <IconButton onClick={_reset}>
          <RefreshIcon />
        </IconButton>
      </Toolbar>
      <InfiniteScroll
        height={height}
        dataLength={transactions.length}
        hasMore={hasMore}
        next={_getTransactions}
        loader={<CircularProgress />}
      >
        <Table size="large" stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ lineHeight: "1rem" }}>#</TableCell>
              <TableCell style={{ lineHeight: "1rem" }}>
                {translate("DATE")}
              </TableCell>
              <TableCell style={{ lineHeight: "1rem" }}>
                {translate("JV_NOTE")}
              </TableCell>
              <TableCell style={{ lineHeight: "1rem" }}>
                {translate("DEBTOR")}
              </TableCell>
              <TableCell style={{ lineHeight: "1rem" }}>
                {translate("CREDITOR")}
              </TableCell>
              <TableCell style={{ lineHeight: "1rem" }}>
                {translate("BALANCE")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell component="th" scope="row">
                  {" "}
                  {row.id}{" "}
                </TableCell>
                <TableCell>
                  <Tooltip title={row.created_at}>
                    <span>
                      {row.created_at
                        ? row.created_at.slice(0, row.created_at.length - 9)
                        : "N/A"}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.jv_note}</TableCell>
                <TableCell>{row.op === "D" && row.amount}</TableCell>
                <TableCell>{row.op === "C" && row.amount}</TableCell>
                <TableCell>{row.current_balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow key={"totalcount9455549"}>
              <TableCell>{translate("TOTAL_AMOUNT")} </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{totalD}</TableCell>
              <TableCell>{totalC}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </InfiniteScroll>
    </>
  );
};
