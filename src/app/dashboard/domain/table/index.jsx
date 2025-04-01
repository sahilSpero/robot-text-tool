import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import LoopRoundedIcon from "@mui/icons-material/LoopRounded";

// import DeleteIcon from "../../../assets/deleteIcon.svg";

import { formatDate } from "@/utils";

const DomainTable = ({ getDomain, handleDelete, deletingId }) => {
  return (
    <TableContainer
      sx={{
        borderRadius: "16px",
        background: "#fff",
        overflow: "hidden",
        transition: "0.3s",
        padding: { xs: "15px", sm: "20px", md: "30px 50px" },
        width: "80%",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "400px",
        backgroundColor: "#fafafa",
      }}>
      <Table
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
        }}
        aria-label="styled table">
        <TableHead>
          <TableRow>
            {["Domain Name", "Created At", "Action"].map((head, index) => (
              <TableCell
                key={index}
                sx={{
                  color: "#f13624",
                  fontWeight: "500",
                  fontSize: { xs: "14px", sm: "16px" },
                  padding: { xs: "12px 10px", sm: "16px 18px" },
                  textAlign: index === 0 ? "left" : "center",
                  whiteSpace: "nowrap",
                }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {getDomain.map((row, index) => {
            const isDeleting = deletingId === row._id;
            return (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f3f3f3" : "#fff",
                }}>
                <TableCell
                  sx={{
                    color: "#000",
                    fontWeight: "500",
                    fontSize: { xs: "14px", sm: "16px" },
                    padding: { xs: "10px", sm: "12px 16px" },
                    whiteSpace: "nowrap",
                  }}>
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{
                    color: "#000",
                    fontWeight: "500",
                    fontSize: { xs: "14px", sm: "16px" },
                    padding: { xs: "10px", sm: "12px 16px" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}>
                  {formatDate(row.createdAt)}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {isDeleting ? (
                    <LoopRoundedIcon className="spin-icon" />
                  ) : (
                    <img
                      src={'/assets/deleteIcon.svg'}
                      alt="Delete Icon"
                      width="20"
                      height="20"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(row._id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DomainTable;
