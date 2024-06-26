"use client";
import { useEffect, useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { Sidebar as ProSidebar } from "react-pro-sidebar";
import { Box, Text, useColorMode, useColorModeValue, ColorModeProvider, Switch, Flex, IconButton, Avatar, AvatarBadge, Icon, Link, Button, Input } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, InfoIcon, SearchIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
const Item = ({ title, color, icon, link }: { title: string; color: string; icon: JSX.Element; link: string }) => {
  return (
    <MenuItem component={<Link as={NextLink} href={link} />} icon={icon}>
      <Text color={color}>{title}</Text>
    </MenuItem>
  );
};

const Sidebar = ({ session }: { session: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const backgroundColor = useColorModeValue("gray.100", "gray.700");
  const backgroundHover = useColorModeValue("#CBD5E0", "#4A5568");

  const [userType, setUserType] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(1);
  const [employeePosition, setEmployeePosition] = useState<string | null>("");
  const [searchTerm, setSearchTerm] = useState("");
  const menuItems = [
    { title: "Adeudos", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/adeudos" },
    { title: "Autores", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/autores" },
    { title: "Cargos", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/cargos" },
    { title: "Categorias", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/categorias" },
    { title: "Direcciones", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/direcciones" },
    { title: "Editoriales", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/editoriales" },
    { title: "Empleados", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/empleados" },
    { title: "Estados_prestamo", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/estados_prestamo" },
    { title: "Generos_literarios", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/generos_literarios" },
    { title: "Generos_persona", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/generos_persona" },
    { title: "Libros", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/libros" },
    { title: "Libros_autores", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/libros_autores" },
    { title: "Libros_editoriales", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/libros_editoriales" },
    { title: "Libros_generos", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/libros_generos" },
    { title: "Prestamos", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/prestamos" },
    { title: "Roles_visitante", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/roles_visitante" },
    { title: "Tipos_usuario", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/tipos_usuario" },
    { title: "Turnos", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/turnos" },
    { title: "Usuarios", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/usuarios" },
    { title: "Visitantes", color: textColor, icon: <Icon as={InfoIcon} color={iconColor} />, link: "/admin/tables/visitantes" },
  ];
  const filteredMenuItems = menuItems.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) && ((userType === "Administrador" && employeePosition === "Bibliotecario") || !item.link.includes("/admin/"))
    );
  });

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch(`/api/user?username=${session?.user.username}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setUserType(data.type);
          setEmployeeId(data.employeeId[Object.keys(data.employeeId)[0]]);
          setEmployeePosition(data.employeePosition);
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
  }, [session, employeeId, employeePosition]);

  return session?.user ? (
    <ColorModeProvider options={{ initialColorMode: "light" }}>
      <Box bg={backgroundColor} minHeight="100vh" width={isCollapsed ? "80px" : "250px"}>
        <ProSidebar collapsed={isCollapsed} backgroundColor={backgroundColor} collapsedWidth="80px">
          <Menu
            menuItemStyles={{
              button: {
                "&:hover": {
                  backgroundColor: backgroundHover,
                },
              },
            }}
          >
            {/* LOGO AND MENU ICON */}
            <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={<HamburgerIcon />} style={{ marginBottom: "20px" }}>
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" marginLeft="15px">
                  <Text fontSize="xl">Dashboard</Text>
                </Box>
              )}
            </MenuItem>

            {/* PROFILE */}
            {!isCollapsed && (
              <Box marginBottom="25px">
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Avatar size="2xl" name="Emilio" src="https://avatars.githubusercontent.com/u/89049877?v=4">
                    <AvatarBadge boxSize="0.7em" bg="green.500" />
                  </Avatar>
                  <Text fontSize="2xl" fontWeight="bold" mt="2">
                    {session?.user.username || "Loading..."}
                  </Text>
                  <Text fontSize="md" color="green.500">
                    {" "}
                    {userType || "Loading..."}
                  </Text>
                </Flex>
              </Box>
            )}

            {/* DARK MODE TOGGLE */}
            <Flex alignItems="center" justifyContent="center" marginBottom="20px">
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === "dark" ? <SunIcon color="white" /> : <MoonIcon color="black" />}
                onClick={toggleColorMode}
                variant="ghost"
                fontSize="20px"
                mr="2"
              />
              {isCollapsed ? null : <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />}
            </Flex>

            {/* SEARCH INPUT */}
            <Box marginBottom="20px" marginRight="10px">
              <Flex alignItems="center" justifyContent="center">
                <IconButton aria-label="Search" icon={<SearchIcon color={iconColor} />} variant="ghost" fontSize="20px" mr="2" />
                {isCollapsed ? null : <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />}
              </Flex>
            </Box>

            {/* MENU ITEMS */}
            <Box
              paddingLeft={isCollapsed ? undefined : "10%"}
              maxHeight="300px"
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "0px",
                  background: "transparent",
                },
                overflowY: "scroll",
              }}
            >
              {filteredMenuItems.map((item) => (
                <Item key={item.title} title={item.title} color={item.color} icon={item.icon} link={item.link} />
              ))}
            </Box>
          </Menu>
        </ProSidebar>
        <Flex width="80%" alignItems="flex-end" justifyContent="flex-end" display={isCollapsed ? "none" : "flex"}>
          <Button
            onClick={() => {
              signOut({ redirect: true, callbackUrl: `${window.location.origin}` });
            }}
            bgColor="#de295c"
            color="white"
            _hover={{ opacity: "0.7", transition: "1s" }}
            variant="solid"
          >
            Sign out
          </Button>
        </Flex>
      </Box>
    </ColorModeProvider>
  ) : null;
};

export default Sidebar;
