import type { ReactNode } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: unknown, row: T) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
};

function DataTable<T extends { id: number }>({
  columns,
  data,
}: Props<T>) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.header)}
                className="text-left p-4"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.map((row) => (

            <tr
              key={row.id}
              className="border-b hover:bg-gray-50 transition"
            >

              {columns.map((column) => (

                <td
                  key={String(column.header)}
                  className="p-4"
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : String(row[column.accessor])}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;