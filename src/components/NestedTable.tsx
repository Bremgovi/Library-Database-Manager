import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import useCustomToast from "./toasts";
import { Column, RowData, TableProps } from "./data/interfaces";
import { getSession } from "next-auth/react";
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
  Box,
  Tooltip,
  RadioGroup,
  Radio,
  IconButton,
  Button,
} from "@chakra-ui/react";
import Select from "react-select";
import { SearchIcon } from "@chakra-ui/icons";
const NestedTable = ({ table, endpoint, idColumns, radioColumns, checkColumns, foreignKeyColumn, primaryKeyValue, sendDataToParent }: TableProps) => {
  const [firstColumnName, setFirstColumnName] = useState<string>("");
  const [data, setData] = useState<RowData[]>([]);
  const [rowData, setRowData] = useState<RowData>({});
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [idValue, setIdValue] = useState<String>("");
  const [placeholder, setPlaceholder] = useState<RowData | null>(null);
  const [radioData, setRadioData] = useState<{ [key: string]: RowData[] }>({});
  const [idData, setIdData] = useState<String[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<any>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(1);
  const showToast = useCustomToast();

  const admin = "Administrador";

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch(`/api/user?username=${session?.user.username}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setUserType(data.type);
          setEmployeeId(data.employeeId[Object.keys(data.employeeId)[0]]);
        } else {
          console.error("Failed to fetch user type");
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };
    if (session) {
      fetchUserType();
    }
  }, [session, employeeId]);

  useEffect(() => {
    if (primaryKeyValue) {
      const event = {
        target: {
          name: foreignKeyColumn || "",
          value: primaryKeyValue,
        },
      };
      handleChange(event);
    }
  }, [primaryKeyValue]);
  // Colors
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const backgroundColor = useColorModeValue("rgba(0, 0, 0, 0.037)", "rgba(255, 255, 255, 0.037)");
  const header = useColorModeValue("rgba(0, 0, 0, 0.037)", "rgba(255, 255, 255, 0.037)");

  // Function to update search query state
  const handleSearchInputChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchQuery(e.target.value);
  };

  // Filtered data based on search query
  const filteredData = data?.filter((row) =>
    Object.values(row).some((value) => {
      if (value !== null && value !== undefined) {
        try {
          return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        } catch (error) {
          console.error("Error while converting value to string:", error);
          console.log("Problematic value:", value);
          return false;
        }
      }
      return false;
    })
  );

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

  useEffect(() => {
    if (sendDataToParent) {
      sendDataToParent(rowData);
    }
  }, [rowData]);

  const removeIntegersFromFields = (row: RowData, fieldsToTransform: string[]): RowData => {
    const transformedRow: RowData = { ...row };
    let id = "";
    fieldsToTransform.forEach((field) => {
      if (typeof transformedRow[field] === "string") {
        id = transformedRow[field].replace(/(^\d+)(.+$)/i, "$1");
        transformedRow[field] = transformedRow[field].replace(/[0-9]/g, "");
        transformedRow[field] = transformedRow[field].trimStart();
      }
    });
    return { idValue: id, data: transformedRow };
  };

  /* Handle input */
  const handleChange = (e: { target: { name: string; value: any } }) => {
    let { name, value } = e.target;
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
      value = String(value);
      const userInput = value.toLowerCase();

      let matchingRow;
      var idValue;
      var index = -1;
      if (idData) {
        let idColumnsArray = idColumns?.map((idColumn) => idColumn.idColumn) || [];
        const transformedData = data.map((row) => removeIntegersFromFields(row, idColumnsArray).data);
        idValue = data.map((row) => removeIntegersFromFields(row, idColumnsArray).idValue);
        index = transformedData.findIndex((row) => String(row[name]).toLowerCase() === userInput);
        matchingRow = transformedData.find((row) => String(row[name]).toLowerCase() === userInput);
      } else {
        matchingRow = data.find((row) => String(row[name]).toLowerCase() === userInput);
      }

      if (matchingRow) {
        if (idValue && index !== -1) {
          setIdValue(idValue[index]);
        }
        setPlaceholder(matchingRow);
        return;
      }
    }
  };

  /* Handle autocompletion */
  const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let idColumnsArray = idColumns?.map((idColumn) => idColumn.idColumn) || [];

    if (e.key === "Tab") {
      e.preventDefault();
      if (placeholder) {
        const updatedRowData: RowData = {};
        const updatedSelectedRow: RowData = {};

        for (const key in placeholder) {
          if (key.startsWith("id_") && typeof placeholder[key] === "string") {
            const [numericPart, stringPart] = placeholder[key].split(" ", 2);

            if (idColumnsArray.includes(key)) {
              updatedRowData[key] = idValue;
              updatedSelectedRow[key] = idValue;
            } else {
              updatedRowData[key] = parseInt(numericPart);
              updatedSelectedRow[key] = `${numericPart} ${stringPart}`;
            }
          } else {
            updatedRowData[key] = placeholder[key];
            updatedSelectedRow[key] = placeholder[key];
          }
        }
        setRowData(updatedRowData);
        setSelectedRows([...selectedRows, updatedSelectedRow]);
      }
    }
  };

  /* Handle row selection */
  const handleSelectRow = (row: RowData) => {
    const displayedRow: RowData = { ...row };
    const isRowSelected = selectedRows.some((selectedRow) => selectedRow[firstColumnName] === row[firstColumnName]);

    for (const key in displayedRow) {
      let idColumnsArray = idColumns?.map((idColumn) => idColumn.idColumn) || [];
      if (idColumnsArray?.includes(key) && typeof displayedRow[key] === "string") {
        const numericPart = displayedRow[key].split(" ")[0];
        displayedRow[key] = parseInt(numericPart, 10);
      }
    }

    if (isRowSelected) {
      setSelectedRows(selectedRows.filter((selectedRow) => selectedRow[firstColumnName] !== row[firstColumnName]));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
    if (selectedRows[0]) {
      let originalJson = JSON.parse(JSON.stringify(selectedRows[0]));
      for (let key in originalJson) {
        if (key.includes("id_")) {
          let value = originalJson[key];
          if (typeof value === "string") {
            const numericPart = value.split(" ")[0];
            originalJson[key] = parseInt(numericPart, 10);
          }
        }
      }
      if (selectedRows && JSON.stringify(originalJson) === JSON.stringify(displayedRow)) {
        setRowData({});
      } else {
        setRowData(displayedRow);
      }
    } else {
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
    const styles = {
      control: (baseStyles: any, state: any) => ({
        ...baseStyles,
        color: "white",
        backgroundColor: "transparent",
      }),
      menu: (baseStyles: any) => ({
        ...baseStyles,
        backgroundColor: "rgba(35, 34, 45, 1)",
        color: "white",
      }),
      option: (baseStyles: any, state: { isFocused: any }) => ({
        ...baseStyles,
        backgroundColor: state.isFocused ? "rgba(87, 86, 107, 1)" : "transparent",
      }),
      singleValue: (baseStyles: any) => ({
        ...baseStyles,
        color: "white",
      }),
      input: (baseStyles: any) => ({
        ...baseStyles,
        color: "white", // Change color for input text here
      }),
      menuList: (baseStyles: any) => ({
        ...baseStyles,
        maxHeight: 300,
      }),
    };
    const renderRadioInput = (column: Column) => {
      const isRadioColumn = radioColumns?.some((rc) => rc.idColumn === column.key);
      const isCheckColumn = checkColumns?.some((cc) => cc.idColumn === column.key);

      if (isRadioColumn && !isCheckColumn) {
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
      } else {
        const options = radioData[column.key]?.map((option: any) => ({
          value: String(option.id),
          label: option.description,
        }));

        const handleChangeReactSelect = (selectedOption: any) => {
          handleChange({ target: { name: column.key, value: selectedOption ? selectedOption.value : "" } });
        };

        return (
          <Select
            styles={styles}
            name={column.key}
            placeholder="Search..."
            options={options}
            onChange={handleChangeReactSelect}
            value={options?.find((option) => option.value === String(rowData[column.key] || ""))}
            isSearchable={true}
          />
        );
      }
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

    const renderBooleanInput = (column: Column, options: any) => (
      <Select
        name={column.key}
        styles={styles}
        value={{ value: rowData[column.key] ? "Si" : "No", label: rowData[column.key] ? "Si" : "No" }}
        onChange={(selectedOption) => handleChange({ target: { name: column.key, value: selectedOption ? selectedOption.value : "" } })}
        options={options}
      />
    );

    const renderDefaultInput = (column: Column) => {
      const placeholderValue = placeholder && placeholder[column.key] ? placeholder[column.key] : `Enter ${formatLabel(column.label)}`;
      const inputType = column.type === "int" ? (column.key === firstColumnName ? "number" : column.key.includes("id") ? "text" : "number") : "text";
      if (column.key === foreignKeyColumn) {
        return <Input name={column.key} value={0} onChange={handleChange} placeholder={placeholderValue} type={inputType} onKeyDown={handleTabPress} hidden />;
      } else {
        return <Input name={column.key} value={rowData[column.key] || ""} onChange={handleChange} placeholder={placeholderValue} type={inputType} onKeyDown={handleTabPress} />;
      }
    };

    if (column.type === "date") {
      return renderDateInput(column);
    }

    if (column.type === "boolean") {
      const options = [
        { value: "Si", label: "Si" },
        { value: "No", label: "No" },
      ];
      return renderBooleanInput(column, options);
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

  const handleOperation = async (operation: "insert" | "update" | "delete") => {
    try {
      let requestBody: any = { table: table };

      switch (operation) {
        case "insert":
          requestBody.data = rowData;
          break;
        case "update":
          requestBody.data = rowData;
          requestBody.condition = { [firstColumnName]: selectedRows.map((selectedRow) => selectedRow[firstColumnName])[0] };
          break;
        case "delete":
          requestBody.deleteCondition = { [firstColumnName]: selectedRows.map((selectedRow) => selectedRow[firstColumnName]) };
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
      showToast("Error", `An error occurred while ${operation === "delete" ? "deleting" : operation === "update" ? "updating" : operation + "ing"} the data.` + error, "error");
    }
  };

  /* Handle table view and design */
  return userType === admin ? (
    <Center height="100%">
      <Stack spacing={4} maxWidth="90%" backgroundColor="rgba(155,155,155,0.1)" padding={30} margin={5} borderRadius={10}>
        <Text fontSize="6xl" textAlign="center">
          {formatLabel(table)}
        </Text>
        <Box maxHeight="300px" overflowY="auto" padding="30px" paddingTop="0px">
          {columns.map((column) =>
            column.key === foreignKeyColumn ? null : (
              <FormControl key={column.key}>
                <FormLabel>{formatLabel(column.label)}</FormLabel>
                {renderInput(column)}
              </FormControl>
            )
          )}
        </Box>
        {/* Search input field */}
        <Flex>
          <IconButton aria-label="Search" icon={<SearchIcon color={iconColor} />} variant="ghost" fontSize="20px" mr="2" />
          <Input value={searchQuery} onChange={handleSearchInputChange} placeholder="Search..." backgroundColor={backgroundColor} />
        </Flex>
        <Box maxH="200px" overflowY="auto" borderRadius="10px" backgroundColor={backgroundColor}>
          <Table variant="simple">
            <Thead backgroundColor={header}>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.key} textAlign="center">
                    {column.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {filteredData?.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  _hover={{ bg: useColorModeValue("blue.200", "blue.800"), cursor: "pointer" }}
                  onClick={() => handleSelectRow(row)}
                  bg={selectedRows.some((selectedRow) => selectedRow[firstColumnName] === row[firstColumnName]) ? useColorModeValue("blue.200", "blue.800") : ""}
                >
                  {Object.values(row).map((value, columnIndex) => (
                    <Td key={columnIndex} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxWidth="250px">
                      <Tooltip label={value} placement="top">
                        <div style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>
                          {typeof value === "boolean" ? (value ? "Si" : "No") : value}
                        </div>
                      </Tooltip>
                    </Td>
                  ))}
                </Tr>
              ))}
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
  ) : null;
};

export default NestedTable;
