import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Pagination from "@material-ui/lab/Pagination";
import Button from "../CustomButtons/Button.js";
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

function CustomTable(props) {
  const classes = useStyles();

  const tableHead = ["번호", "주제", "글제목", "작성자", "등록일"];
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const globalPosts = useSelector((state) => state.posts);

  useEffect(() => {
    const newData = [];
    for (let i = 0; i < globalPosts.length; i++) {
      newData.push([
        globalPosts[i].id,
        globalPosts[i].header,
        globalPosts[i].title,
        globalPosts[i].writer,
        globalPosts[i].regiDate,
      ]);
    }
    setAllData(newData);
    setTableData(newData.slice(0, 10));
  }, [globalPosts]);

  const handlePage = (event, value) => {
    const startNum = (value - 1) * 10;
    const endNum = value * 10 - 1;
    setTableData(allData.slice(startNum, endNum));
  };

  const addPost = (e) => {
    props.history.push("/table/addtable");
  };

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        {tableHead !== undefined ? (
          <TableHead className={classes["TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {prop.map((index, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      <RouterLink to={`/board/EditPost/${prop[0]}`}>
                        {index}
                      </RouterLink>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div style={{ float: "right" }}>
        <Button
          variant="contained"
          color="primary"
          className="write-btn"
          onClick={addPost}
        >
          글쓰기
        </Button>
      </div>
      <div className={classes.root}>
        <Pagination
          count={parseInt(globalPosts.length / 10) + 1}
          shape="rounded"
          onChange={handlePage}
        />
      </div>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
export default withRouter(CustomTable);
