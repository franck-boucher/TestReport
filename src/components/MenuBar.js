import React, { Component, Fragment } from 'react';
import { Menu, Header, Dropdown, Confirm } from 'semantic-ui-react';

class MenuBar extends Component {
  state = {
    confirmModalAction: '',
    isConfirmModalOpen: false
  };
  openConfirmModal = action => {
    this.setState({ isConfirmModalOpen: true, confirmModalAction: action });
  };
  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false, confirmModalAction: '' });
  };
  confirm = () => {
    const { confirmModalAction, isConfirmModalOpen } = this.state;
    if (confirmModalAction && isConfirmModalOpen) {
      switch (confirmModalAction) {
        case 'new':
          this.props.newUserStory();
          break;
        case 'open':
          this.props.openFile();
          break;
        default:
          break;
      }
      this.closeConfirmModal();
    }
  };
  render() {
    const {
      isWorkSaved,
      newUserStory,
      openFile,
      saveFile,
      preferences,
      about
    } = this.props;
    const { isConfirmModalOpen } = this.state;
    return (
      <Fragment>
        <Confirm
          open={isConfirmModalOpen}
          content="You have unsaved work, do you want to proceed anyway ?"
          confirmButton="Continue"
          cancelButton="Cancel"
          onCancel={this.closeConfirmModal}
          onConfirm={this.confirm}
        />
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
                  onClick={
                    isWorkSaved
                      ? newUserStory
                      : () => this.openConfirmModal('new')
                  }
                />
                <Dropdown.Item
                  icon="folder open outline"
                  text="Open..."
                  onClick={
                    isWorkSaved ? openFile : () => this.openConfirmModal('open')
                  }
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
      </Fragment>
    );
  }
}

export default MenuBar;
