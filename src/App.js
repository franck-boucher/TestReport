import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Tab, Menu, Header, Dropdown, Dimmer } from 'semantic-ui-react';

import './App.css';

import UserStoryInfos from './components/UserStoryInfos';
import TestStatus from './components/TestStatus';
import TestScenarios from './components/TestScenarios';
import { EmptyUserStory, DialogConfig } from './util/constants';
import { parseCSV, generateCSV } from './util/utils';

const { dialog } = window.require('electron').remote;
const fs = window.require('fs');

class App extends Component {
  state = {
    userStory: '',
    environment: 'RCT',
    type: 'Manual functional testing',
    author: '',
    tools: ['Postman'],
    comments: '',
    asumptions: '',
    startTestingDate: new Date(),
    endTestingDate: new Date(),
    scenarios: [],
    dimmed: false
  };
  handleFieldChange = (e, { id, value }) => {
    this.setState({ [id]: value });
  };
  newUserStory = () => {
    const newState = { ...this.state, ...EmptyUserStory };
    this.setState(newState);
  };
  openFile = () => {
    this.setState({ dimmed: true });
    dialog.showOpenDialog(DialogConfig, filePaths => {
      this.setState({ dimmed: false });
      if (filePaths) {
        const fileContent = fs.readFileSync(filePaths[0]).toString();
        const userStory = parseCSV(fileContent);
        this.setState({ ...userStory });
      } else {
        console.error(
          'Error while trying to select file path from file system'
        );
      }
    });
  };
  saveFile = () => {
    const csvString = generateCSV(this.state);
    this.setState({ dimmed: true });
    dialog.showSaveDialog(DialogConfig, filePath => {
      this.setState({ dimmed: false });
      if (filePath) {
        fs.writeFile(filePath, csvString, err => {
          if (err) {
            console.error('Error while trying to save file to file system');
          }
        });
      } else {
        console.error(
          'Error while trying to select file path from file system'
        );
      }
    });
  };
  render() {
    const panes = [
      {
        menuItem: 'User story infos',
        render: () => (
          <UserStoryInfos
            userStoryInfos={this.state}
            handleFieldChange={this.handleFieldChange}
          />
        )
      },
      {
        menuItem: <Menu.Item key="messages">Test scenarios</Menu.Item>,
        render: () => (
          <TestScenarios
            handleFieldChange={this.handleFieldChange}
            userStoryInfos={this.state}
          />
        )
      }
    ];
    const dropdownMenu = (
      <Dropdown icon="bars" direction="left">
        <Dropdown.Menu>
          <Dropdown.Item
            icon="file outline"
            text="New"
            onClick={this.newUserStory}
          />
          <Dropdown.Item
            icon="folder open outline"
            text="Open..."
            onClick={this.openFile}
          />
          <Dropdown.Item
            icon="save outline"
            text="Save as..."
            onClick={this.saveFile}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
    return (
      <div style={{ padding: '1em 2em' }}>
        <Menu fixed="top">
          <Header id="app-title" size="medium">
            TestReport
          </Header>
          <Menu.Menu position="right">
            <Menu.Item>{dropdownMenu}</Menu.Item>
          </Menu.Menu>
        </Menu>
        <Dimmer active={this.state.dimmed} page />
        <Grid>
          <Grid.Column width={10}>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          </Grid.Column>
          <Grid.Column width={6}>
            <TestStatus scenarios={this.state.scenarios} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
