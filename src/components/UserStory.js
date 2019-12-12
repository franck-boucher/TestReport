import React, { Component, Fragment } from 'react';
import { Button, Dimmer } from 'semantic-ui-react';

import UserStoryInfos from '../components/UserStoryInfos';
import TestScenarios from '../components/TestScenarios';
import { getPercentPassed, saveAsDialog, savePdfAsDialog } from '../util/utils';
import { uploadUserstory } from "./jira/jiraFunctions";

class UserStory extends Component {

  state = {
    dimmed: false,
    uploading: false
  };

  handleFieldChange = (e, { id, value }, callback) => {
    const { uuid } = this.props.userStory.metadata;
    this.props.handleChange(uuid, 'content', id, value, callback);
  };

  handleTabChange = (e, { activeIndex }) => {
    const { uuid } = this.props.userStory.metadata;
    this.props.handleChange(uuid, 'metadata', 'activeTabIndex', activeIndex);
  };

  selectScenario = scenarioUuid => {
    const { uuid } = this.props.userStory.metadata;
    this.props.handleChange(uuid, 'metadata', 'selectedScenario', scenarioUuid);
    this.props.handleChange(uuid, 'metadata', 'activeTabIndex', 1);
  };

  saveFileAs = () => {
    this.setState({ dimmed: true });
    saveAsDialog(this.props.userStory, () => this.setState({ dimmed: false }));
  };

  savePdfAs = () => {
    this.setState({ dimmed: true });
    savePdfAsDialog(this.props.userStory, () => this.setState({ dimmed: false }));
  };

  upload = () => {
    const { userStory } = this.props;
    if (userStory.content.userStory && userStory.metadata.isRemote) {
      this.setState({ uploading: true });
      uploadUserstory(userStory)
        .then(attachment => {
          this.setState({ uploading: false });
          if (attachment) {
            const { uuid } = this.props.userStory.metadata;
            this.props.handleChange(uuid, 'metadata', 'reportAttachmentId', attachment.id);
          }
        })
    }
  }

  render() {
    const { dimmed, uploading } = this.state;
    const userStoryContent = this.props.userStory.content;
    const userStoryMetadata = this.props.userStory.metadata;
    const { isRemote, summary } = userStoryMetadata;
    const percentPassed = getPercentPassed(userStoryContent);
    return (
      <Fragment>

        <Dimmer active={dimmed} page />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className='ui small header' style={{ fontWeight: 'bold', marginBottom: 0, alignSelf: 'center' }}>{summary || ''}</span>
          <span>
            <USButton basic icon='file pdf' onClick={this.savePdfAs} />
            <USButton basic icon='download' onClick={this.saveFileAs} />
            <USButton primary icon='cloud upload' onClick={this.upload} disabled={!isRemote || uploading} loading={uploading} style={{ paddingLeft: '2em', paddingRight: '2em' }} />
          </span>
        </div>

        <div style={{ padding: '1em 0' }}>
          <UserStoryInfos
            isRemote={isRemote}
            summary={summary}
            percentPassed={percentPassed}
            userStoryInfos={userStoryContent}
            handleFieldChange={this.handleFieldChange}
          />

          <TestScenarios
            selectScenario={this.selectScenario}
            selectedScenario={userStoryMetadata.selectedScenario}
            handleFieldChange={this.handleFieldChange}
            userStoryInfos={userStoryContent}
          />
        </div>

      </Fragment>
    );
  }
}

const USButton = ({ style, ...props }) => (
  <Button style={{ marginLeft: '0.5em', ...style }} compact {...props} />
)

export default UserStory;
