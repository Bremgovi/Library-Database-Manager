"use client";
import { useEffect, useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { Sidebar as ProSidebar } from "react-pro-sidebar";
import { Box, Text, useColorMode, useColorModeValue, ColorModeProvider, Switch, Flex, IconButton, Avatar, AvatarBadge, Icon, Link } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, ViewIcon, InfoIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

const Item = ({ title, color, icon, link }: { title: string; color: string; icon: JSX.Element; link: string }) => {
  return (
    <MenuItem component={<Link as={NextLink} href={link} />} icon={icon}>
      <Text color={color}>{title}</Text>
    </MenuItem>
  );
};

const Sidebar = ({ username }: { username: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("gray.600", "gray.300");
  const [typeName, setTypeName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch(`api/user?username=${username}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setTypeName(data.type);
        } else {
          console.error("Failed to fetch user type");
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, [username]);

  return (
    <ColorModeProvider options={{ initialColorMode: "dark" }}>
      <Box bg={useColorModeValue("gray.100", "gray.700")} minHeight="100vh">
        <ProSidebar collapsed={isCollapsed} backgroundColor={useColorModeValue("gray.100", "gray.700")}>
          <Menu
            menuItemStyles={{
              button: {
                "&:hover": {
                  backgroundColor: useColorModeValue("#CBD5E0", "#4A5568"),
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
                    {username}
                  </Text>
                  <Text fontSize="md" color="green.500">
                    {" "}
                    {typeName || "Loading..."}
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

            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item title="Cargos" color={textColor} icon={<Icon as={ViewIcon} color={iconColor} />} link="/admin/cargos" />
              <Item title="Generos Persona" color={textColor} icon={<Icon as={InfoIcon} color={iconColor} />} link="/admin/generos_persona" />
              <Item title="Autores" color={textColor} icon={<Icon as={InfoIcon} color={iconColor} />} link="/admin/autores" />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </ColorModeProvider>
  );
};

export default Sidebar;
