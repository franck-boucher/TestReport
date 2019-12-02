import React, { Component, Fragment } from 'react';
import { Grid, Tab, Button, Dimmer } from 'semantic-ui-react';

import UserStoryInfos from '../components/UserStoryInfos';
import TestStatus from '../components/TestStatus';
import TestScenarios from '../components/TestScenarios';
import { getPercentPassed, saveAsDialog, savePdfAsDialog } from '../util/utils';

class UserStory extends Component {

  state = {
    dimmed: false
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

  render() {
    const userStoryContent = this.props.userStory.content;
    const userStoryMetadata = this.props.userStory.metadata;
    const percentPassed = getPercentPassed(userStoryContent);
    const panes = [
      {
        menuItem: 'User story infos',
        render: () => (
          <UserStoryInfos
            userStoryInfos={userStoryContent}
            handleFieldChange={this.handleFieldChange}
          />
        )
      },
      {
        menuItem: 'Test scenario',
        render: () => (
          <TestScenarios
            selectScenario={this.selectScenario}
            selectedScenario={userStoryMetadata.selectedScenario}
            handleFieldChange={this.handleFieldChange}
            userStoryInfos={userStoryContent}
          />
        )
      }
    ];
    return (
      <Fragment>

        <Dimmer active={this.state.dimmed} page />

        <div style={{ textAlign: 'right' }}>
          <USButton basic icon='file pdf' onClick={this.savePdfAs} />
          <USButton basic icon='download' onClick={this.saveFileAs} />
          <USButton primary icon='cloud upload' disabled style={{ paddingLeft: '2em', paddingRight: '2em' }} />
        </div>

        <div style={{ padding: '1em 0' }}>
          <Grid>
            <Grid.Column width={10}>
              <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                activeIndex={userStoryMetadata.activeTabIndex}
                onTabChange={this.handleTabChange}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <TestStatus
                scenarios={userStoryContent.scenarios}
                selectScenario={this.selectScenario}
                percentPassed={percentPassed}
              />
            </Grid.Column>
          </Grid>
        </div>

      </Fragment>
    );
  }
}

const USButton = ({ style, ...props }) => (
  <Button style={{ marginLeft: '0.5em', ...style }} compact {...props} />
)

export default UserStory;
