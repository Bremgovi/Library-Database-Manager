"use client";

import { useState, useEffect } from "react";
import { Center, Stack, Text, Input, Button, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import useCustomToast from "@/components/toasts";

interface Cargo {
  id_cargo: number;
  descripcion: string;
}

const ModifyCargos = () => {
  const [cargo, setCargo] = useState<Cargo>({ id_cargo: 0, descripcion: "" });
  const showToast = useCustomToast();
  const [cargosList, setCargosList] = useState<Cargo[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setCargo({
      ...cargo,
      [name]: value,
    });
  };

  const handleInsert = async () => {
    const response = await fetch("/api/operations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "cargos",
        data: cargo,
      }),
    });
    if (response.ok) {
      showToast("Insertion completed", "Cargo has been added successfully.", "success");
      fetchCargos();
    } else {
      showToast("Insertion failed", "There was an error adding the cargo.", "error");
    }
  };

  const handleModify = async () => {
    if (selectedCargo) {
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "cargos",
          data: cargo,
          condition: { id_cargo: selectedCargo.id_cargo },
        }),
      });
      if (response.ok) {
        showToast("Modification completed", "Cargo has been updated successfully.", "success");
        fetchCargos();
      } else {
        showToast("Modification failed", "There was an error updating the cargo.", "error");
      }
    } else {
      showToast("No cargo selected", "Please select a cargo from the table.", "warning");
    }
  };

  const handleDelete = async () => {
    if (selectedCargo) {
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "cargos",
          deleteCondition: { id_cargo: selectedCargo.id_cargo },
        }),
      });
      if (response.ok) {
        showToast("Deletion completed", "Cargo has been deleted successfully.", "success");
        fetchCargos();
        setSelectedCargo(null);
        setCargo({ id_cargo: 0, descripcion: "" });
      } else {
        showToast("Deletion failed", "There was an error deleting the cargo.", "error");
      }
    } else {
      showToast("No cargo selected", "Please select a cargo from the table.", "warning");
    }
  };

  const handleSelectCargo = (selected: Cargo) => {
    setSelectedCargo(selected);
    setCargo(selected);
  };

  const fetchCargos = async () => {
    try {
      const response = await fetch("/api/operations?table=cargos");
      if (response.ok) {
        const data = await response.json();
        setCargosList(data.data);
      } else {
        showToast("Fetch failed", "Failed to fetch cargos from the database.", "error");
      }
    } catch (error) {
      showToast("Error", "An error occurred while fetching cargos.", "error");
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  return (
    <Center height="100%">
      <Stack spacing={4} width="80%">
        <Text fontSize="6xl" textAlign="center">
          Modify Cargos
        </Text>
        <FormControl>
          <FormLabel>ID Cargo</FormLabel>
          <Input name="id_cargo" value={cargo.id_cargo} onChange={handleChange} type="number" placeholder="Enter ID Cargo" />
        </FormControl>
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Input name="descripcion" value={cargo.descripcion} onChange={handleChange} placeholder="Enter Descripción" />
        </FormControl>

        <Box maxH="200px" overflowY="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID Cargo</Th>
                <Th>Descripción</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cargosList.map((cargo) => (
                <Tr
                  key={cargo.id_cargo}
                  onClick={() => handleSelectCargo(cargo)}
                  _hover={{ bg: useColorModeValue("blue.200", "blue.800"), cursor: "pointer" }}
                  bg={selectedCargo?.id_cargo === cargo.id_cargo ? useColorModeValue("blue.200", "blue.800") : ""}
                >
                  <Td>{cargo.id_cargo}</Td>
                  <Td>{cargo.descripcion}</Td>
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

export default ModifyCargos;
