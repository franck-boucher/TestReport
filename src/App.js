import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Tab, Dimmer } from 'semantic-ui-react';

import './App.css';

import UserStoryInfos from './components/UserStoryInfos';
import TestStatus from './components/TestStatus';
import TestScenarios from './components/TestScenarios';
import MenuBar from './components/MenuBar';
import Preferences from './components/Preferences';
import About from './components/About';
import { EmptyUserStory, DialogConfig } from './util/constants';
import { parseCSV, generateCSV } from './util/utils';

const { dialog } = window.require('electron').remote;
const fs = window.require('fs');

class App extends Component {
  state = {
    userStory: { ...EmptyUserStory().toJS() },
    dimmed: false,
    selectedScenario: '',
    activeTabIndex: 0,
    preferencesModal: false,
    aboutModal: false,
    isWorkSaved: true,
    currentFilePath: ''
  };
  handleFieldChange = (e, { id, value }, callback) => {
    const { userStory } = this.state;
    userStory[id] = value;
    this.setState({ userStory, isWorkSaved: false }, callback);
  };
  handleTabChange = (e, { activeIndex }) => {
    this.setState({ activeTabIndex: activeIndex });
  };
  openModal = modal => {
    this.setState({ [modal]: true });
  };
  closeModal = modal => {
    this.setState({ [modal]: false });
  };
  selectScenario = scenarioUuid => {
    this.setState({ selectedScenario: scenarioUuid, activeTabIndex: 1 });
  };
  newUserStory = () => {
    const userStory = { ...EmptyUserStory().toJS() };
    this.setState({ userStory, currentFilePath: '' });
  };
  openFile = () => {
    this.setState({ dimmed: true });
    dialog.showOpenDialog(DialogConfig, filePaths => {
      this.setState({ dimmed: false });
      if (filePaths) {
        const fileContent = fs.readFileSync(filePaths[0]).toString();
        const userStory = parseCSV(fileContent);
        this.setState({
          userStory,
          isWorkSaved: true,
          currentFilePath: filePaths[0]
        });
      } else {
        console.error(
          'Error while trying to select file path from file system'
        );
      }
    });
  };
  saveFile = () => {
    const { currentFilePath } = this.state;
    if (!currentFilePath) {
      this.saveFileAs();
    } else {
      const csvString = generateCSV(this.state.userStory);
      fs.writeFile(currentFilePath, csvString, err => {
        if (err) {
          console.error('Error while trying to save file to file system');
        } else {
          this.setState({ isWorkSaved: true });
        }
      });
    }
  };
  saveFileAs = () => {
    const csvString = generateCSV(this.state.userStory);
    this.setState({ dimmed: true });
    dialog.showSaveDialog(DialogConfig, filePath => {
      this.setState({ dimmed: false });
      if (filePath) {
        fs.writeFile(filePath, csvString, err => {
          if (err) {
            console.error('Error while trying to save file to file system');
          } else {
            this.setState({ isWorkSaved: true, currentFilePath: filePath });
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
            userStoryInfos={this.state.userStory}
            handleFieldChange={this.handleFieldChange}
          />
        )
      },
      {
        menuItem: 'Test scenario',
        render: () => (
          <TestScenarios
            selectScenario={this.selectScenario}
            selectedScenario={this.state.selectedScenario}
            handleFieldChange={this.handleFieldChange}
            userStoryInfos={this.state.userStory}
          />
        )
      }
    ];
    return (
      <div style={{ padding: '1em 2em' }}>
        <MenuBar
          isWorkSaved={this.state.isWorkSaved}
          newUserStory={this.newUserStory}
          openFile={this.openFile}
          saveFile={this.saveFile}
          saveFileAs={this.saveFileAs}
          preferences={() => this.openModal('preferencesModal')}
          about={() => this.openModal('aboutModal')}
        />
        <Preferences
          isModalOpen={this.state.preferencesModal}
          handleClose={() => this.closeModal('preferencesModal')}
        />
        <About
          isModalOpen={this.state.aboutModal}
          handleClose={() => this.closeModal('aboutModal')}
        />
        <Dimmer active={this.state.dimmed} page />
        <Grid>
          <Grid.Column width={10}>
            <Tab
              menu={{ secondary: true, pointing: true }}
              panes={panes}
              activeIndex={this.state.activeTabIndex}
              onTabChange={this.handleTabChange}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <TestStatus
              scenarios={this.state.userStory.scenarios}
              selectScenario={this.selectScenario}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
