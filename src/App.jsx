import React, { useEffect, useMemo, useState } from "react";
import CircularColor from "./components/circular.progress";
import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
  flexRender,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const App = () => {
  // Define the columns for the data table
  const columns = useMemo(() => [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "website",
      header: "Website",
    },
    {
      accessorKey: "address.city",
      header: "Address",
    },
    {
      accessorKey: "company.name",
      header: "Company",
    },
  ]);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API and cache it in local storage
  useEffect(() => {
    if (localStorage.getItem("data")) {
      setData(JSON.parse(localStorage.getItem("data")));
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setData(data);
        setIsLoading(false);
        localStorage.setItem("data", JSON.stringify(data));
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Initialize the Material React Table
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
  });

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {<CircularColor />}
      </Box>
    );

  return (
    <Stack sx={{ m: "2rem 0", width: "100%", display: "flex", alignItems: "center" }}>
      <Typography variant="h3" style={{ paddingTop: "10px", paddingBottom: "20px" }}>
        Data Table
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Global filter input */}
        <MRT_GlobalFilterTextField table={table} style={{ Width: "100%" }} />
      </Box>

      <TableContainer>
        <Table>
          {/* Table header */}
          <TableHead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell align="center" variant="head" key={header.id} style={{ color: "blue", fontSize: "20px" }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.Header ?? header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          {/* Table body */}
          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, _columnIndex) => (
                  <TableCell align="center" variant="body" key={cell.id}>
                    {/* Use MRT's cell renderer */}
                    <MRT_TableBodyCellValue cell={cell} table={table} staticRowIndex={rowIndex} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Alert banner */}
      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />

      {/* Table pagination */}
      <MRT_TablePagination table={table} />
    </Stack>
  );
};

export default App;
