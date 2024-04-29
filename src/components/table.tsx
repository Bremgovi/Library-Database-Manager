import { Key, use, useEffect, useState } from "react";
import useCustomToast from "./toasts";
import { Column, RowData, TableProps } from "./data/interfaces";
import {
  Text,
  Center,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  useColorModeValue,
  Td,
  Flex,
  Button,
  Box,
  Select,
  Tooltip,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

const GenericTable = ({ table, endpoint, idColumns, radioColumns }: TableProps) => {
  const [firstColumnName, setFirstColumnName] = useState<string>("");
  const [data, setData] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData>({});
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [placeholder, setPlaceholder] = useState<RowData | null>(null);
  const [radioData, setRadioData] = useState<{ [key: string]: RowData[] }>({});
  const [idData, setIdData] = useState<String[]>([]);
  const showToast = useCustomToast();

  /* FETCH table schema */
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
  }, []);

  /* Handle Data fetching */
  const fetchData = async () => {
    const fetchNormalData = async () => {
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

    const fetchIdData = async () => {
      if (idColumns) {
        try {
          const requestBody = {
            table: table,
            idColumns: idColumns,
          };

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
          if (response.ok) {
            const responseData = await response.json();
            setData(responseData.data);
            for (const element of responseData.idData) {
              const concatenatedValue = Object.values(element)
                .reduce((acc: string, value) => acc + " " + value, "")
                .trim();
              setIdData((prevArray) => [...prevArray, concatenatedValue]);
            }
          } else {
            console.error(`Failed to fetch id columns`);
          }
        } catch (error) {
          console.error("Some error occurred while fetching id columns data", error);
        }
      }
    };

    if (idColumns) {
      fetchIdData();
    } else {
      fetchNormalData();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  /* Fetch Radio Columns data*/
  useEffect(() => {
    const fetchRadioData = async () => {
      if (radioColumns) {
        try {
          const radioDataToUpdate: { [key: string]: { id: any; description: string }[] } = {}; // Initialize radioDataToUpdate object
          for (const radioColumn of radioColumns) {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ radioColumn }),
            });
            if (response.ok) {
              const responseData = await response.json();
              const updatedData = responseData.data.map((item: any) => ({
                id: item[radioColumn.idColumn],
                description: item[radioColumn.descriptionColumn],
              }));
              radioDataToUpdate[radioColumn.idColumn] = updatedData;
            } else {
              console.error(`Failed to fetch radio columns`);
            }
          }
          setRadioData((prevRadioData) => ({ ...prevRadioData, ...radioDataToUpdate }));
        } catch (error) {
          console.error("Some error occurred while fetching radio columns data", error);
        }
      }
    };

    fetchRadioData();
  }, []);

  /**/
  useEffect(() => {
    const fetchIdData = () => {
      if (idData) {
      }
    };
    fetchIdData();
  }, []);

  /* DEBUG DATA VALUES */
  useEffect(() => {
    console.log("ID DATA: " + idData);
    console.log("DATA: " + data.map((row) => JSON.stringify(row)));
  }, [idData, data]);

  const removeIntegersFromFields = (row: RowData, fieldsToTransform: string[]): RowData => {
    const transformedRow: RowData = { ...row };

    fieldsToTransform.forEach((field) => {
      if (typeof transformedRow[field] === "string") {
        transformedRow[field] = transformedRow[field].replace(/[0-9]/g, "");
        transformedRow[field] = transformedRow[field].trimStart();
      }
    });
    return transformedRow;
  };

  /* Handle input */
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    const currentColumn = columns.find((column) => column.key === name);
    if (currentColumn && currentColumn.type === "boolean") {
      setRowData({
        ...rowData,
        [name]: value === "Si",
      });
      return;
    }

    if (radioColumns) {
      for (const radioColumn of radioColumns) {
        if (radioColumn.idColumn === name) {
          setRowData({
            ...rowData,
            [name]: value,
          });
          return;
        }
      }
    }

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
      const userInput = value.toLowerCase();

      let matchingRow;
      if (idData) {
        let idColumnsArray = idColumns?.map((idColumn) => idColumn.idColumn) || [];
        const transformedData = data.map((row) => removeIntegersFromFields(row, idColumnsArray));
        matchingRow = transformedData.find((row) => String(row[name]).toLowerCase() === userInput);
      } else {
        matchingRow = data.find((row) => String(row[name]).toLowerCase() === userInput);
      }
      if (matchingRow) {
        setPlaceholder(matchingRow);
      }
    }
  };

  /* Handle autocompletion */
  const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (placeholder) {
        const updatedRowData: RowData = {};
        const updatedSelectedRow: RowData = {};

        for (const key in placeholder) {
          if (key.startsWith("id_") && typeof placeholder[key] === "string") {
            const [numericPart, stringPart] = placeholder[key].split(" ", 2);
            updatedRowData[key] = parseInt(numericPart, 10);
            updatedSelectedRow[key] = `${numericPart} ${stringPart}`;
          } else {
            updatedRowData[key] = placeholder[key];
            updatedSelectedRow[key] = placeholder[key];
          }
        }

        setRowData(updatedRowData);
        setSelectedRow(updatedSelectedRow);
      }
    }
  };

  /* Handle SQL operations */
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
        const defaultMessage = `There was an error ${operation === "delete" ? "deleting" : operation === "update" ? "updating" : operation + "ing"} the data.`;

        showToast(responseData.title || defaultTitle, responseData.message || defaultMessage, "error");
      }
    } catch (error) {
      showToast("Error", `An error occurred while ${operation === "delete" ? "deleting" : operation === "update" ? "updating" : operation + "ing"} the data.`, "error");
    }
  };

  /* Handle row selection */
  const handleSelectRow = (row: RowData) => {
    const displayedRow: RowData = { ...row };

    for (const key in displayedRow) {
      if (key.startsWith("id_") && typeof displayedRow[key] === "string") {
        const numericPart = displayedRow[key].split(" ")[0];
        displayedRow[key] = parseInt(numericPart, 10);
      }
    }
    if (selectedRow && JSON.stringify(selectedRow) === JSON.stringify(displayedRow)) {
      setSelectedRow(null);
      setRowData({});
    } else {
      setSelectedRow(displayedRow);
      setRowData(displayedRow);
    }
  };

  /* Handle Label format */
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

  /* Handle INPUT field rendering */
  const renderInput = (column: Column) => {
    const renderRadioInput = (column: Column) => {
      return (
        <RadioGroup
          name={column.key}
          onChange={(nextValue: string) => handleChange({ target: { name: column.key, value: nextValue } })}
          value={String(rowData[column.key] || "")} // Ensure the value is converted to string for comparison
        >
          <Stack direction="row">
            {radioData[column.key] &&
              radioData[column.key].map((option: any, index: any) => (
                <Radio key={index} value={String(option.id)}>
                  {" "}
                  {option.description}
                </Radio>
              ))}
          </Stack>
        </RadioGroup>
      );
    };

    const renderDateInput = (column: Column) => (
      <Input
        name={column.key}
        value={rowData[column.key] || ""}
        onChange={handleChange}
        placeholder={`Select ${formatLabel(column.label)}`}
        type="date"
        onKeyDown={handleTabPress}
      />
    );
    const renderBooleanInput = (column: Column) => (
      <Select name={column.key} value={rowData[column.key] ? "Si" : "No"} onChange={handleChange}>
        <option value="Si">Si</option>
        <option value="No">No</option>
      </Select>
    );
    const renderDefaultInput = (column: Column) => {
      const placeholderValue = placeholder && placeholder[column.key] ? placeholder[column.key] : `Enter ${formatLabel(column.label)}`;
      const inputType = column.type === "int" ? (column.key === firstColumnName ? "number" : column.key.includes("id") ? "text" : "number") : "text";

      return <Input name={column.key} value={rowData[column.key] || ""} onChange={handleChange} placeholder={placeholderValue} type={inputType} onKeyDown={handleTabPress} />;
    };

    if (column.type === "date") {
      return renderDateInput(column);
    }

    if (column.type === "boolean") {
      return renderBooleanInput(column);
    }

    if (radioColumns) {
      for (const radioColumn of radioColumns) {
        if (radioColumn.idColumn === column.key) {
          return renderRadioInput(column);
        }
      }
    }

    return renderDefaultInput(column);
  };

  /* Handle table view and design */
  return (
    <Center height="100%">
      <Stack spacing={4} maxWidth="70%">
        <Text fontSize="6xl" textAlign="center">
          Modify {table}
        </Text>
        <Box maxHeight="400px" overflowY="auto" padding="30px">
          {columns.map((column) => (
            <FormControl key={column.key}>
              <FormLabel>{formatLabel(column.label)}</FormLabel>
              {renderInput(column)}
            </FormControl>
          ))}
        </Box>
        <Box maxH="200px" overflowY="auto" borderRadius="10px" backgroundColor="rgba(255, 255, 255, 0.037)">
          <Table variant="simple">
            <Thead backgroundColor="rgba(255, 255, 255, 0.037)">
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key} textAlign="center">
                    {column.label}
                  </Th>
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
                      <Td key={column.key} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="250px">
                        <Tooltip label={column.type === "boolean" ? (row[column.key] ? "Si" : "No") : row[column.key]} placement="top">
                          <div style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>
                            {column.type === "boolean" ? (row[column.key] ? "Si" : "No") : row[column.key]}
                          </div>
                        </Tooltip>
                      </Td>
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
        <Flex justifyContent="center" gap={40} marginTop="20px">
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
