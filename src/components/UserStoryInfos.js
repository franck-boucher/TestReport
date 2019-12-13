import React from 'react';
import {
  Form,
  Input,
  Grid,
  TextArea,
  Dropdown
} from 'semantic-ui-react';

import TagsInput from './TagsInput';
import ExpendableLabel from './ExpendableLabel'
import { Environments } from '../util/constants';
import { ExpendableSegment, PercentPassedLabel } from "../util/ui";

const UserStoryInfos = ({ isRemote, percentPassed, userStoryInfos, handleFieldChange }) => {
  const {
    userStory,
    environment,
    author,
    tools,
    comments
  } = userStoryInfos;
  const environmentOptions = Environments.map(environment => {
    return {
      key: environment,
      text: environment,
      value: environment
    };
  });
  return (
    <ExpendableSegment label='User story infos'>
      <Form>
        <Grid columns={4}>
          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <label>User story ID</label>
                <Input
                  id="userStory"
                  icon="linkify"
                  iconPosition="left"
                  value={userStory}
                  onChange={handleFieldChange}
                  placeholder="ID-XXXX"
                  disabled={isRemote}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Author</label>
                <Input
                  id="author"
                  icon="user outline"
                  iconPosition="left"
                  value={author}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Environment</label>
                <Dropdown
                  id="environment"
                  fluid
                  selection
                  options={environmentOptions}
                  value={environment}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Percent passed</label>
                <PercentPassedLabel percent={percentPassed} />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form.Field>
          <TagsInput
            label="Tools"
            id="tools"
            tags={tools}
            handleFieldChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <ExpendableLabel label="General comments" defaultExpended={!!comments}>
            <TextArea
              id="comments"
              value={comments}
              onChange={handleFieldChange}
            />
          </ExpendableLabel>
        </Form.Field>
      </Form>
    </ExpendableSegment>
  );
};

export default UserStoryInfos;
