import React, { Component, Fragment } from 'react';
import { Menu, Header, Dropdown, Label } from 'semantic-ui-react';

const os = require('os');

class MenuBar extends Component {
  cmdOrCtrl = () => {
    return os.platform === 'win32' ? 'Ctrl' : 'Cmd';
  };
  render() {
    const {
      newUserStory,
      openFile,
      saveFile,
      saveFileAs,
      preferences,
      about,
      isWorkSaved
    } = this.props;
    const cmdOrCtrl = this.cmdOrCtrl();
    return (
      <Fragment>
        <Menu fixed="top">
          <Header id="app-title" size="medium">
            TestReport
          </Header>
          <Menu.Menu position="right">
            {isWorkSaved && (
              <Label
                basic
                color={isWorkSaved === 'SAVED' ? 'green' : 'grey'}
                size="small"
                style={{ margin: '0.7em 1.1em' }}
              >
                {isWorkSaved === 'SAVED' ? 'Saved' : 'Not saved'}
              </Label>
            )}
            <Dropdown item icon="bars" direction="left">
              <Dropdown.Menu style={{ width: 'max-content' }}>
                <Dropdown.Item
                  icon="file outline"
                  text="New"
                  description={`${cmdOrCtrl} + N`}
                  onClick={newUserStory}
                />
                <Dropdown.Item
                  icon="folder open outline"
                  text="Open..."
                  description={`${cmdOrCtrl} + O`}
                  onClick={openFile}
                />
                <Dropdown.Item
                  icon="save outline"
                  text="Save..."
                  description={`${cmdOrCtrl} + S`}
                  onClick={saveFile}
                />
                <Dropdown.Item
                  icon="save outline"
                  text="Save as.."
                  description={`${cmdOrCtrl} + Shift + S`}
                  onClick={saveFileAs}
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
      </Fragment>
    );
  }
}

export default MenuBar;
