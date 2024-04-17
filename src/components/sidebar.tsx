import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

const SidebarNext = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>
      {children}
    </div>
  );
};

export default SidebarNext;
