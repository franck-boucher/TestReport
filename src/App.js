import React, { Component, Fragment } from 'react';
import { Icon, Dimmer } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import UserStory from './components/UserStory'
import NewTabPane from './components/NewTabPane'
import Tabs from './components/Tabs';
import { openDialog, parseFile } from './util/utils';
import { EmptyUserStory } from './util/constants';
import { getUserstoryAttachment } from './components/jira/jiraFunctions'

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
          name: userStory.content.userStory,
          title: (<UserStoryTab userStory={userStory} closeUserStory={this.closeUserStory} />),
          content: (<UserStory userStory={userStory} handleChange={this.handleChange} />)
        }
      });
    return panes;
  }

  createReport = (userStoryId, userStorySummary) => {
    const userStory = { ...EmptyUserStory().toJS() };
    userStory.content.userStory = userStoryId;
    userStory.metadata.summary = userStorySummary;
    userStory.metadata.isRemote = true;
    userStory.metadata.remote = 'jira';

    const { userStories } = this.state;
    userStories.push(userStory);
    this.setState({ userStories });
  }

  openReport = (userStorySummary, report) => {
    getUserstoryAttachment(report.content)
      .then(json => {
        const userStory = { ...EmptyUserStory().toJS() };
        userStory.content = json;
        userStory.metadata.summary = userStorySummary;
        userStory.metadata.isRemote = true;
        userStory.metadata.remote = 'jira';
        userStory.metadata.reportAttachmentId = report.id;

        const { userStories } = this.state;
        userStories.push(userStory);
        this.setState({ userStories });
      })
  }

  render() {
    const panes = this.buildPanes();
    return (
      <Fragment>
        <Dimmer active={this.state.dimmed} page />
        <Tabs tabs={panes} fallback={
          <NewTabPane
            createReport={this.createReport}
            openReport={this.openReport}
            onClickNew={this.newUserStory}
            onClickOpen={this.openFile} />
        } />
      </Fragment>
    );
  }

}

const UserStoryTab = ({ userStory, closeUserStory }) => (
  <Fragment>
    {userStory.content.userStory || 'New userstory'}
    <Icon name='close'
      onClick={() => closeUserStory(userStory.metadata.uuid)}
      style={{ marginLeft: '0.75em', marginRight: 0 }} />
  </Fragment>
)

export default App;
