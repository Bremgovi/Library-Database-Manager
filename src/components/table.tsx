import { useEffect, useState } from "react";
import useCustomToast from "./toasts";
import { Text, Center, Stack, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Tbody, useColorModeValue, Td, Flex, Button, Box } from "@chakra-ui/react";

interface Column {
  key: string;
  label: string;
  type: any;
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
  const [placeholder, setPlaceholder] = useState<RowData | null>(null);
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
    if (data) {
      const matchingRow = data.find((row) => String(row[name]).toLowerCase() === String(value).toLowerCase());

      if (matchingRow) {
        setPlaceholder(matchingRow);
        setSelectedRow(matchingRow);
        //setRowData(matchingRow);
      }
    }
  };
  const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (placeholder) {
        setRowData(placeholder);
        setSelectedRow(placeholder);
      }
    }
  };
  const handleOperation = async (operation: "insert" | "update" | "delete") => {
    try {
      let requestBody: any = { table: table };

      switch (operation) {
        case "insert":
          requestBody.data = rowData;
          break;
        case "update":
          requestBody.data = rowData;
          requestBody.condition = { [firstColumnName]: selectedRow![firstColumnName] };
          break;
        case "delete":
          requestBody.deleteCondition = { [firstColumnName]: selectedRow![firstColumnName] };
          break;
        default:
          throw new Error("Invalid operation type");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      if (response.ok) {
        const completionMessage = `${operation.charAt(0).toUpperCase() + operation.slice(1)} Completed`;
        showToast(completionMessage, `Data has been ${operation === "delete" ? "deleted" : operation === "update" ? "updated" : "inserted"} successfully.`, "success");
        fetchData();
      } else {
        const defaultTitle = `${operation.charAt(0).toUpperCase() + operation.slice(1)} Failed`;
        const defaultMessage = `There was an error ${operation === "delete" ? "deleting" : operation + "ing"} the data.`;

        showToast(responseData.title || defaultTitle, responseData.message || defaultMessage, "error");
      }
    } catch (error) {
      showToast("Error", `An error occurred while ${operation}ing data.`, "error");
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

  const renderInput = (column: Column) => {
    if (column.type === "date") {
      return (
        <Input
          name={column.key}
          value={rowData[column.key] || ""}
          onChange={handleChange}
          placeholder={`Select ${formatLabel(column.label)}`}
          type="date"
          onKeyDown={handleTabPress}
        />
      );
    }

    if (placeholder && placeholder[column.key]) {
      return (
        <Input
          name={column.key}
          value={rowData[column.key] || ""}
          onChange={handleChange}
          placeholder={placeholder[column.key]}
          type={column.type === "int" ? "number" : "text"}
          onKeyDown={handleTabPress}
        />
      );
    } else {
      return (
        <Input
          name={column.key}
          value={rowData[column.key] || ""}
          onChange={handleChange}
          placeholder={`Enter ${formatLabel(column.label)}`}
          type={column.type === "int" ? "number" : "text"}
        />
      );
    }
  };

  return (
    <Center height="100%">
      <Stack spacing={4} width="80%">
        <Text fontSize="6xl" textAlign="center">
          Modify {table}
        </Text>
        <Box maxHeight="400px" overflowY="auto">
          {columns.map((column) => (
            <FormControl key={column.key}>
              <FormLabel>{formatLabel(column.label)}</FormLabel>
              {renderInput(column)}
            </FormControl>
          ))}
        </Box>
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
              {data ? (
                data.map((row) => (
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
                ))
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        <Flex justifyContent="center" gap={40}>
          <Button onClick={() => handleOperation("insert")} colorScheme="green">
            Insert
          </Button>
          <Button onClick={() => handleOperation("update")} colorScheme="purple">
            Update
          </Button>
          <Button onClick={() => handleOperation("delete")} colorScheme="red">
            Delete
          </Button>
        </Flex>
      </Stack>
    </Center>
  );
};

export default GenericTable;
