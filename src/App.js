import React, { Component, Fragment } from 'react';
import { Tab, Icon, Menu, Dimmer } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import UserStory from './components/UserStory'
import NewTabPane from './components/NewTabPane'
import { openDialog, parseFile } from './util/utils';
import { EmptyUserStory } from './util/constants';

class App extends Component {

  state = {
    userStories: [],
    dimmed: false,
    isConfirmModalOpen: false
  };

  newUserStory = () => {
    const userStory = { ...EmptyUserStory().toJS() };
    const { userStories } = this.state;
    userStories.push(userStory);
    this.setState({ userStories });
  };

  openFile = () => {
    this.setState({ dimmed: true });
    openDialog(fileContent => {
      const userStoryContent = parseFile(fileContent);
      const userStory = { ...EmptyUserStory().toJS() };
      userStory.content = userStoryContent;
      const { userStories } = this.state;
      userStories.push(userStory);
      this.setState({ userStories });
    }, () => this.setState({ dimmed: false }))
  };

  closeUserStory = userStoryUuid => {
    const userStories = this.state.userStories
      .filter(userStory => userStory.metadata.uuid !== userStoryUuid);
    this.setState({ userStories });
  }

  handleChange = (userStoryUuid, dataType, field, data, callback) => {
    const { userStories } = this.state;
    const userStory = userStories.find(userStory => userStory.metadata.uuid === userStoryUuid)
    if (userStory) {
      userStory[dataType][field] = data;
      this.setState({ userStories }, callback);
    }
  };

  buildPanes = () => {
    const panes = this.state.userStories
      .map(userStory => {
        return {
          menuItem: (
            <Menu.Item key='us-id' style={{ paddingRight: '0.5em' }}>
              <UserStoryTab userStory={userStory} closeUserStory={this.closeUserStory} />
            </Menu.Item>
          ), render: () =>
            <Tab.Pane>
              <UserStory userStory={userStory} handleChange={this.handleChange} />
            </Tab.Pane>
        }
      });
    return panes;
  }

  render() {
    const panes = this.buildPanes();
    return (
      <Fragment>
        <Dimmer active={this.state.dimmed} page />
        {panes.length ?
          <Tab id="tabs" panes={panes} />
          :
          <NewTabPane onClickNew={this.newUserStory} onClickOpen={this.openFile} />
        }
      </Fragment>
    );
  }

}

const UserStoryTab = ({ userStory, closeUserStory }) => (
  <Fragment>
    {userStory.content.userStory || 'New userstory'}
    <Icon name='close'
      onClick={() => closeUserStory(userStory.metadata.uuid)}
      style={{ marginLeft: '0.75em' }} />
  </Fragment>
)

export default App;
