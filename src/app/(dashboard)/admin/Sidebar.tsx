"use client";
import { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { Sidebar as ProSidebar } from "react-pro-sidebar";
import { Box, Text, useColorMode, useColorModeValue, ColorModeProvider, Switch, Flex, IconButton, Avatar, AvatarBadge, Icon } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, ViewIcon, InfoIcon } from "@chakra-ui/icons";

const Item = ({ title, selected, setSelected, color, icon }: { title: string; selected: string; setSelected: (value: string) => void; color: string; icon: JSX.Element }) => {
  return (
    <MenuItem onClick={() => setSelected(title)} active={selected === title} icon={icon}>
      <Text color={color}>{title}</Text>
    </MenuItem>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("gray.600", "gray.300");

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
                    Username
                  </Text>
                  <Text fontSize="md" color="green.500">
                    Type of user
                  </Text>
                </Flex>
              </Box>
            )}

            {/* DARK MODE TOGGLE */}
            <Flex alignItems="center" justifyContent="center" marginBottom="20px">
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon color="black" />}
                onClick={toggleColorMode}
                variant="ghost"
                fontSize="20px"
                mr="2"
              />
              {isCollapsed ? null : <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />}
            </Flex>

            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item title="Dashboard" selected={selected} setSelected={setSelected} color={textColor} icon={<Icon as={ViewIcon} color={iconColor} />} />
              <Item title="Contacts" selected={selected} setSelected={setSelected} color={textColor} icon={<Icon as={InfoIcon} color={iconColor} />} />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </ColorModeProvider>
  );
};

export default Sidebar;
