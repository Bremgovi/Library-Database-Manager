import { useEffect, useState } from "react";
import useCustomToast from "./toasts";
import { Text, Center, Stack, FormControl, FormLabel, Input, Table, Thead, Tr, Th, Tbody, useColorModeValue, Td, Flex, Button, Box } from "@chakra-ui/react";

interface Column {
  key: string;
  label: string;
}

interface RowData {
  [key: string]: any;
}

interface TableProps {
  table: string;
  columns: Column[];
  endpoint: string;
}

const GenericTable = ({ table, columns, endpoint }: TableProps) => {
  const firstColumnName = columns[0]?.key;
  const [data, setData] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData>({});
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const showToast = useCustomToast();

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setRowData({
      ...rowData,
      [name]: value,
    });
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

  const handleModify = async () => {
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

  return (
    <Center height="100%">
      <Stack spacing={4} width="80%">
        <Text fontSize="6xl" textAlign="center">
          Modify {table}
        </Text>
        {columns.map((column) => (
          <FormControl key={column.key}>
            <FormLabel>{column.label}</FormLabel>
            <Input name={column.key} value={rowData[column.key] || ""} onChange={handleChange} placeholder={`Enter ${column.label}`} />
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
          <Button onClick={handleModify} colorScheme="purple">
            Modify
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
