
import os

def generate_files_and_txt(table_names):
    tsx_content = ""
    txt_content = ""
    
    for table_name in table_names:
        dir_path = os.path.join(os.getcwd(), 'src', 'app', '(dashboard)', 'admin', 'tables', table_name)
        file_path = os.path.join(dir_path, 'page.tsx')
        
        file_content = f"""
"use client";
import GenericTable from "@/components/table";

const {table_name.capitalize()} = () => {{
  return <GenericTable table="{table_name}" endpoint="/api/operations" />;
}};
export default {table_name.capitalize()};
"""

        tsx_content += file_content

        # Create directory if it doesn't exist
        try:
            os.makedirs(dir_path, exist_ok=True)
        except OSError as error:
            print(f"Error creating directory {dir_path}: {error}")
            return

        # Write TSX file
        with open(file_path, 'w') as file:
            file.write(file_content)

        # Generate TXT content
        txt_content += f'<Item title="{table_name.capitalize()}" color={{textColor}} icon={{<Icon as={{InfoIcon}} color={{iconColor}} />}} link="/admin/tables/{table_name}" />\n'


    # Write TXT file
    with open('menu_items.txt', 'w') as txt_file:
        txt_file.write(txt_content)

    print("Files generated successfully!")

if __name__ == "__main__":
    table_names = [
        "adeudos",
        "autores",
        "cargos",
        "categorias",
        "detalles_prestamo",
        "direcciones",
        "editoriales",
        "empleados",
        "estados_prestamo",
        "generos_literarios",
        "generos_persona",
        "libros",
        "libros_autores",
        "libros_editoriales",
        "libros_generos",
        "prestamos",
        "roles_visitante",
        "tipos_usuario",
        "turnos",
        "usuarios",
        "visitantes"
    ]

    generate_files_and_txt(table_names)

