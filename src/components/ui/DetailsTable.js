import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

/**
 * Key/value details table for application detail pages.
 * rows: [{ label, value }]
 */
const DetailsTable = ({ rows = [] }) => (
  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
    <Table size="small" aria-label="application details">
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell
              component="th"
              scope="row"
              sx={{ width: { xs: "40%", sm: "32%" }, fontWeight: 700, bgcolor: "background.subtle", verticalAlign: "top" }}
            >
              {row.label}
            </TableCell>
            <TableCell>
              {typeof row.value === "string" || typeof row.value === "number" ? (
                <Typography variant="body2" component="div">
                  {row.value}
                </Typography>
              ) : (
                row.value
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DetailsTable;
