import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
function App() {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        size: 50,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        size: 80,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => info.getValue<Date>().toLocaleString(),
        size: 250,
      },
    ],
    []
  );

  const [data, setData] = React.useState(() => makeData(25_000));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // All important CSS styles are included as inline styles for this example. This is not recommended for your code.
  return (
    <div className="app">
      ({data.length} rows)
      <button>Refresh Data</button>
      <div
        className="container"
        style={{
          overflow: "auto", //our scrollable table container
          position: "relative", //needed for sticky header
          height: "800px", //should be a fixed height
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: "grid" }}>
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: "flex",
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <TableBody table={table} />
        </table>
      </div>
    </div>
  );
}

interface TableBodyProps {
  table: Table<Person>;
}

function TableBody({ table }: TableBodyProps) {
  const { rows } = table.getRowModel();

  return (
    <tbody>
      {rows.map((row) => {
        return <TableBodyRow key={row.id} row={row} />;
      })}
    </tbody>
  );
}

interface TableBodyRowProps {
  row: Row<Person>;
}

function TableBodyRow({ row }: TableBodyRowProps) {
  return (
    <tr
      key={row.id}
      style={{
        display: "flex",
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            style={{
              display: "flex",
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
