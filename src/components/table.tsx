import { useEffect, useState } from "react";
import useCustomToast from "./toasts";
import { Text, Center, Stack, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Tbody, useColorModeValue, Td, Flex, Button, Box } from "@chakra-ui/react";

interface Column {
  key: string;
  label: string;
  type: "varchar" | "int";
  length?: number;
}

interface RowData {
  [key: string]: any;
}

interface TableProps {
  table: string;
  endpoint: string;
}

const GenericTable = ({ table, endpoint }: TableProps) => {
  const [firstColumnName, setFirstColumnName] = useState<string>("");
  const [data, setData] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData>({});
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const showToast = useCustomToast();

  useEffect(() => {
    const fetchTableSchema = async () => {
      try {
        const response = await fetch(`${endpoint}?tableSchema=${table}`);
        if (response.ok) {
          const responseData = await response.json();
          setColumns(responseData.columns);
          setFirstColumnName(responseData.columns[0].key);
        } else {
          showToast("Fetch failed", "Failed to fetch table schema from the server.", "error");
        }
      } catch (error) {
        showToast("Error", "An error occurred while fetching table schema." + error, "error");
      }
    };

    fetchTableSchema();
  }, [table, endpoint, showToast]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    // Get the column configuration for the current input
    const currentColumn = columns.find((column) => column.key === name);

    if (currentColumn && currentColumn.type === "varchar") {
      if (currentColumn.length && value.length > currentColumn.length) {
        showToast("Validation Error", `Input exceeds ${currentColumn.label} length limit.`, "error");
        return;
      }
    }

    setRowData({
      ...rowData,
      [name]: value,
    });

    const matchingRow = data.find((row) => String(row[name]).toLowerCase() === String(value).toLowerCase());

    if (matchingRow) {
      setSelectedRow(matchingRow);
      setRowData(matchingRow);
    }
  };

  const handleInsert = async () => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: table, data: rowData }),
      });

      if (response.ok) {
        showToast("Insertion completed", "Data has been added successfully.", "success");
        fetchData();
      } else {
        showToast("Insertion failed", "There was an error adding the data.", "error");
      }
    } catch (error) {
      showToast("Error", "An error occurred while inserting data.", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      if (selectedRow) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ table: table, data: rowData, condition: { [firstColumnName]: selectedRow[firstColumnName] } }),
        });

        if (response.ok) {
          showToast("Modification completed", "Data has been updated successfully.", "success");
          fetchData();
        } else {
          showToast("Modification failed", "There was an error updating the data.", "error");
        }
      } else {
        showToast("No data selected", "Please select a row from the table.", "warning");
      }
    } catch (error) {
      showToast("Error", "An error occurred while modifying data.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedRow) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ table: table, deleteCondition: { [firstColumnName]: selectedRow[firstColumnName] } }),
        });

        if (response.ok) {
          showToast("Deletion completed", "Data has been deleted successfully.", "success");
          fetchData();
          setSelectedRow(null);
          setRowData({});
        } else {
          showToast("Deletion failed", "There was an error deleting the data.", "error");
        }
      } else {
        showToast("No data selected", "Please select a row from the table.", "warning");
      }
    } catch (error) {
      showToast("Error", "An error occurred while deleting data.", "error");
    }
  };

  const handleSelectRow = (row: RowData) => {
    if (selectedRow && JSON.stringify(selectedRow) === JSON.stringify(row)) {
      setSelectedRow(null);
      setRowData({});
    } else {
      setSelectedRow(row);
      setRowData(row);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${endpoint}?table=${table}`);
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData.data);
      } else {
        showToast("Fetch failed", "Failed to fetch data from the server.", "error");
      }
    } catch (error) {
      showToast("Error", "An error occurred while fetching data." + error, "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatLabel = (label: string): string => {
    const replacedLabel = label.replaceAll("ap", "Apellido");
    return replacedLabel
      .split("_")
      .map((word) => {
        const words = word.split(/(?=[A-Z])/).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
        return words.join("");
      })
      .join(" ");
  };

  return (
    <Center height="100%">
      <Stack spacing={4} width="80%">
        <Text fontSize="6xl" textAlign="center">
          Modify {table}
        </Text>
        {columns.map((column) => (
          <FormControl key={column.key}>
            <FormLabel>{formatLabel(column.label)}</FormLabel>
            <Input
              name={column.key}
              value={rowData[column.key] || ""}
              onChange={handleChange}
              placeholder={`Enter ${formatLabel(column.label)}`}
              type={column.type === "int" ? "number" : "text"}
            />
          </FormControl>
        ))}
        <Box maxH="200px" overflowY="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key}>{column.label}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row) => (
                <Tr
                  key={row.id}
                  onClick={() => handleSelectRow(row)}
                  _hover={{ bg: useColorModeValue("blue.200", "blue.800"), cursor: "pointer" }}
                  bg={selectedRow?.[firstColumnName] === row[firstColumnName] ? useColorModeValue("blue.200", "blue.800") : ""}
                >
                  {columns.map((column) => (
                    <Td key={column.key}>{row[column.key]}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Flex justifyContent="center" gap={40}>
          <Button onClick={handleInsert} colorScheme="green">
            Insert
          </Button>
          <Button onClick={handleUpdate} colorScheme="purple">
            Update
          </Button>
          <Button onClick={handleDelete} colorScheme="red">
            Delete
          </Button>
        </Flex>
      </Stack>
    </Center>
  );
};

export default GenericTable;
