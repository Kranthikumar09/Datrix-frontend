import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EmptyState from "./EmptyState";

/**
 * Responsive applications list: MUI Table on desktop, stacked cards on mobile.
 * columns: [{ id, label, align?, render: (row) => node }]
 * actions: (row) => node rendered in Actions column / card footer
 */
const ApplicationsDataList = ({
  columns,
  rows,
  emptyTitle = "No records found",
  emptyMessage = "There are no items to display.",
  getRowKey = (row) => row.id,
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!rows.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {rows.map((row) => (
          <Paper
            key={getRowKey(row)}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
          >
            <Stack spacing={1.25}>
              {columns.map((col) => (
                <Box key={col.id}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {col.label}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {col.render ? col.render(row) : row[col.id] ?? "N/A"}
                  </Typography>
                </Box>
              ))}
              {actions ? (
                <Stack direction="row" spacing={1} sx={{ pt: 0.5, flexWrap: "wrap" }}>
                  {actions(row)}
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small" aria-label="applications table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align || "left"} sx={{ fontWeight: 700 }}>
                {col.label}
              </TableCell>
            ))}
            {actions ? (
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Action
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)} hover>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || "left"}>
                  {col.render ? col.render(row) : row[col.id] ?? "N/A"}
                </TableCell>
              ))}
              {actions ? (
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {actions(row)}
                  </Stack>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicationsDataList;
