import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Tab, Dimmer, Confirm } from 'semantic-ui-react';
import { HotKeys } from 'react-hotkeys';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import './App.css';

import UserStoryInfos from './components/UserStoryInfos';
import TestStatus from './components/TestStatus';
import TestScenarios from './components/TestScenarios';
import MenuBar from './components/MenuBar';
import Preferences from './components/Preferences';
import About from './components/About';
import {
  parseFile,
  generateJSON,
  isFileJson,
  generatePdf,
  getPercentPassed
} from './util/utils';
import {
  EmptyUserStory,
  DialogConfig,
  DialogPdfConfig
} from './util/constants';

const { dialog } = window.require('electron').remote;
const fs = window.require('fs');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class App extends Component {
  state = {
    userStory: { ...EmptyUserStory().toJS() },
    dimmed: false,
    selectedScenario: '',
    activeTabIndex: 0,
    preferencesModal: false,
    aboutModal: false,
    isWorkSaved: '',
    currentFilePath: '',
    currentOperation: '',
    isConfirmModalOpen: false
  };
  keyMap = {
    NEW: ['command+n', 'ctrl+n'],
    OPEN: ['command+o', 'ctrl+o'],
    SAVE: ['command+s', 'ctrl+s'],
    SAVE_AS: ['command+shift+s', 'ctrl+shift+s']
  };
  handlers = {
    NEW: () => this.handleHotkey('NEW'),
    OPEN: () => this.handleHotkey('OPEN'),
    SAVE: () => this.handleHotkey('SAVE'),
    SAVE_AS: () => this.handleHotkey('SAVE_AS')
  };
  handleFieldChange = (e, { id, value }, callback) => {
    const { userStory } = this.state;
    userStory[id] = value;
    this.setState({ userStory, isWorkSaved: 'NOT_SAVED' }, callback);
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
  handleHotkey = operation => {
    const { currentOperation, isWorkSaved } = this.state;
    if (!currentOperation) {
      switch (operation) {
        case 'NEW':
          if (isWorkSaved === 'SAVED') this.newUserStory();
          else this.openConfirmModal(operation);
          break;
        case 'OPEN':
          if (isWorkSaved === 'SAVED') this.openFile();
          else this.openConfirmModal(operation);
          break;
        case 'SAVE':
          this.saveFile();
          break;
        case 'SAVE_AS':
          this.saveFileAs();
          break;
        default:
          break;
      }
    }
  };
  openConfirmModal = action => {
    if (!this.state.currentOperation) {
      this.setState({ isConfirmModalOpen: true, currentOperation: action });
    }
  };
  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false, currentOperation: '' });
  };
  confirmOperation = () => {
    const { currentOperation, isConfirmModalOpen } = this.state;
    if (currentOperation && isConfirmModalOpen) {
      switch (currentOperation) {
        case 'NEW':
          this.newUserStory();
          break;
        case 'OPEN':
          this.openFile();
          break;
        default:
          break;
      }
      this.closeConfirmModal();
    }
  };
  selectScenario = scenarioUuid => {
    this.setState({ selectedScenario: scenarioUuid, activeTabIndex: 1 });
  };
  newUserStory = () => {
    const userStory = { ...EmptyUserStory().toJS() };
    this.setState({ userStory, currentFilePath: '', isWorkSaved: '' });
  };
  openFile = () => {
    this.setState({ dimmed: true, currentOperation: 'OPEN' });
    dialog.showOpenDialog(DialogConfig, filePaths => {
      this.setState({ dimmed: false, currentOperation: '' });
      if (filePaths) {
        const filePath = filePaths[0];
        const fileContent = fs.readFileSync(filePath).toString();
        const userStory = parseFile(fileContent);
        this.setState({ userStory });
        if (isFileJson(filePath)) {
          this.setState({ currentFilePath: filePath, isWorkSaved: 'SAVED' });
        } else {
          // TODO : display an error
        }
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
      fs.writeFile(currentFilePath, generateJSON(this.state.userStory), err => {
        if (err) {
          console.error('Error while trying to save file to file system');
        } else {
          this.setState({ isWorkSaved: 'SAVED' });
        }
      });
    }
  };
  saveFileAs = () => {
    this.setState({ dimmed: true, currentOperation: 'SAVE_AS' });
    dialog.showSaveDialog(DialogConfig, filePath => {
      this.setState({ dimmed: false, currentOperation: '' });
      if (filePath) {
        fs.writeFile(filePath, generateJSON(this.state.userStory), err => {
          if (err) {
            console.error('Error while trying to save file to file system');
          } else {
            this.setState({ isWorkSaved: 'SAVED', currentFilePath: filePath });
          }
        });
      } else {
        console.error(
          'Error while trying to select file path from file system'
        );
      }
    });
  };
  savePdfAs = () => {
    this.setState({ dimmed: true, currentOperation: 'SAVE_PDF_AS' });
    dialog.showSaveDialog(DialogPdfConfig, filePath => {
      this.setState({ dimmed: false, currentOperation: '' });
      if (filePath) {
        const pdf = generatePdf(this.state.userStory);
        const pdfDocGenerator = pdfMake.createPdf(pdf);
        let pdfDoc = pdfDocGenerator.getStream();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.end();
      } else {
        console.error(
          'Error while trying to select file path from file system'
        );
      }
    });
  };
  render() {
    const { isConfirmModalOpen } = this.state;
    const isWorkSaved =
      this.state.isWorkSaved === 'SAVED' || this.state.isWorkSaved === '';
    const percentPassed = getPercentPassed(this.state.userStory);
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
      <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
        <div style={{ padding: '1em 2em' }}>
          <MenuBar
            isWorkSaved={this.state.isWorkSaved}
            newUserStory={
              isWorkSaved
                ? this.newUserStory
                : () => this.openConfirmModal('NEW')
            }
            openFile={
              isWorkSaved ? this.openFile : () => this.openConfirmModal('OPEN')
            }
            saveFile={this.saveFile}
            saveFileAs={this.saveFileAs}
            savePdfAs={this.savePdfAs}
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
          <Confirm
            open={isConfirmModalOpen}
            content="You have unsaved work, do you want to proceed anyway ?"
            confirmButton="Continue"
            cancelButton="Cancel"
            onCancel={this.closeConfirmModal}
            onConfirm={this.confirmOperation}
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
                percentPassed={percentPassed}
              />
            </Grid.Column>
          </Grid>
        </div>
      </HotKeys>
    );
  }
}

export default App;
