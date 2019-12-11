import React, { Fragment, Component, useState } from 'react';
import { Modal, Header, Button, Icon, Accordion } from 'semantic-ui-react';

import GeneralPreferences from './GeneralPreferences';
import EmptyUserStoryPreferences from './EmptyUserStoryPreferences';
import EmptyScenarioPreferences from './EmptyScenarioPreferences';
import { TabIcon } from "../util/ui";

const Store = window.require('electron-store');

class PreferencesForm extends Component {
  state = {};
  componentDidMount = () => {
    const store = new Store();
    this.setState(store.store);
  };
  handleGeneralChange = (e, { id, value }) => {
    const { general } = this.state;
    general[id] = value;
    this.setState({ general });
  };
  handleUserStoryChange = (e, { id, value }) => {
    const { emptyUserStory } = this.state;
    emptyUserStory[id] = value;
    this.setState({ emptyUserStory });
  };
  handleScenarioChange = (e, { id, value }) => {
    const { emptyScenario } = this.state;
    emptyScenario[id] = value;
    this.setState({ emptyScenario });
  };
  onModalMount = () => {
    const store = new Store();
    this.setState(store.store);
  };
  savePreferences = () => {
    const store = new Store();
    store.store = this.state;
    this.props.handleClose();
  };
  render() {
    const { isModalOpen, handleClose } = this.props;
    const panels = [
      {
        key: 'general',
        title: {
          content: <Header as="span">General</Header>
        },
        content: {
          content: (
            <GeneralPreferences
              general={this.state.general}
              handleFieldChange={this.handleGeneralChange}
            />
          )
        }
      },
      {
        key: 'pre-filled-user-story',
        title: {
          content: <Header as="span">User story pre-filled values</Header>
        },
        content: {
          content: (
            <EmptyUserStoryPreferences
              emptyUserStory={this.state.emptyUserStory}
              handleFieldChange={this.handleUserStoryChange}
            />
          )
        }
      },
      {
        key: 'pre-filled-scenario',
        title: {
          content: <Header as="span">Scenario pre-filled values</Header>
        },
        content: {
          content: (
            <EmptyScenarioPreferences
              emptyScenario={this.state.emptyScenario}
              handleFieldChange={this.handleScenarioChange}
            />
          )
        }
      }
    ];
    return (
      <Modal
        id="preferences"
        open={isModalOpen}
        onMount={this.onModalMount}
        size="large"
      >
        <Header content="Preferences" />
        <Modal.Content scrolling>
          <Accordion fluid panels={panels} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="green" onClick={this.savePreferences}>
            <Icon name="checkmark" /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const Preferences = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <Fragment>
      <TabIcon name='setting' onClick={() => setModalOpen(true)} />

      <PreferencesForm isModalOpen={isModalOpen} handleClose={() => setModalOpen(false)} />

    </Fragment>
  );
}

export default Preferences;
