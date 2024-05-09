"use client";
import NestedTable from "@/components/NestedTable";
import GenericTable from "@/components/Table";

const idColumns = [
  { foreignTable: "empleados", idColumn: "id_empleado", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "visitantes", idColumn: "id_visitante", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "estados_prestamo", idColumn: "id_estado", columns: ["descripcion"] },
];
const unchangeableColumn = "id_empleado";
const radioColumns = [
  { foreignTable: "estados_prestamo", idColumn: "id_estado", descriptionColumn: "descripcion" },
  { foreignTable: "visitantes", idColumn: "id_visitante", descriptionColumn: "nombre" },
];
const checkColumns = [{ foreignTable: "visitantes", idColumn: "id_visitante", descriptionColumn: "nombre" }];

const nestedTableIdColumns = [{ foreignTable: "libros", idColumn: "id_libro", columns: ["titulo"] }];
const nestedTableRadioColumns = [{ foreignTable: "libros", idColumn: "id_libro", descriptionColumn: "titulo" }];
const nestedTableCheckColumns = [{ foreignTable: "libros", idColumn: "id_libro", descriptionColumn: "titulo" }];

const Prestamos = () => {
  return (
    <GenericTable
      table="prestamos"
      childTable="detalles_prestamo"
      endpoint="/api/operations"
      idColumns={idColumns}
      radioColumns={radioColumns}
      checkColumns={checkColumns}
      unchangeableColumn={unchangeableColumn}
    >
      <NestedTable
        table="detalles_prestamo"
        endpoint="/api/operations"
        idColumns={nestedTableIdColumns}
        radioColumns={nestedTableRadioColumns}
        checkColumns={nestedTableCheckColumns}
        unchangeableColumn={unchangeableColumn}
      ></NestedTable>
    </GenericTable>
  );
};
export default Prestamos;
