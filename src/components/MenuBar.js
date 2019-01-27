import React from 'react';
import { Menu, Header, Dropdown } from 'semantic-ui-react';

const MenuBar = ({ newUserStory, openFile, saveFile, preferences, about }) => {
  return (
    <Menu fixed="top">
      <Header id="app-title" size="medium">
        TestReport
      </Header>
      <Menu.Menu position="right">
        <Dropdown item icon="bars" direction="left">
          <Dropdown.Menu>
            <Dropdown.Item
              icon="file outline"
              text="New"
              onClick={newUserStory}
            />
            <Dropdown.Item
              icon="folder open outline"
              text="Open..."
              onClick={openFile}
            />
            <Dropdown.Item
              icon="save outline"
              text="Save as..."
              onClick={saveFile}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              icon="setting"
              text="Preferences"
              onClick={preferences}
            />
            <Dropdown.Item icon="info" text="About" onClick={about} />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;
