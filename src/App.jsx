import React, { useEffect,  useState } from "react";
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

const columns = [
  {
    accessorKey: "username",
    header: "Username",
  },

  {
    accessorKey: "name",
    header: " Name",
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
  }
];

/**
 * The main component of the application.
 * It fetches data from an API, caches it in local storage,
 * and displays it in a data table using Material-UI and TanStack Table.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //cache the data to local storage
  useEffect(() => {
    if (localStorage.getItem("data")) {
      setData(JSON.parse(localStorage.getItem("data")));
      setIsLoading(false);
      return;
    }
    const fet = async () => {
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
    fet();
  }, []);

 // console.log(data);
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    //customize the MRT components
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
  });

  if (isLoading)
    return <Box sx={{ display: "flex",justifyContent:'center' }}>{<CircularColor />}</Box>;
  return (
    <Stack sx={{ m: "2rem 0" ,width:'100%', display:'flex',alignItems:'center'}}>
      <Typography variant="h3" style={{ paddingTop: '10px', paddingBottom: '20px' }}>Data Table</Typography>
     

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/**
         * Use MRT components along side your own markup.
         * They just need the `table` instance passed as a prop to work!
         */}
        <MRT_GlobalFilterTextField table={table} style={{ Width: '100%', }}/>
      </Box>
      {/* Using Vanilla Material-UI Table components here */}
      <TableContainer>
        <Table>
          {/* Use your own markup, customize however you want using the power of TanStack Table */}
          <TableHead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell align="center" variant="head" key={header.id} style={{color:'blue',fontSize:'20px'}}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.Header ??
                            header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={row.id}  >
                {row.getVisibleCells().map((cell, _columnIndex) => (
                  <TableCell align="center" variant="body" key={cell.id}>
                    {/* Use MRT's cell renderer that provides better logic than flexRender */}
                    <MRT_TableBodyCellValue
                      cell={cell}
                      table={table}
                      staticRowIndex={rowIndex} //just for batch row selection to work
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
      <MRT_TablePagination table={table} />
    </Stack>
  );
};

export default App;
