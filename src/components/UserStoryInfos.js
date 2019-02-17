import React from 'react';
import {
  Form,
  Input,
  Grid,
  TextArea,
  Segment,
  Dropdown
} from 'semantic-ui-react';

import Datepicker from './Datepicker';
import TagsInput from './TagsInput';
import { Environments } from '../util/constants';

const UserStoryInfos = ({ userStoryInfos, handleFieldChange }) => {
  const {
    userStory,
    environment,
    type,
    author,
    tools,
    comments,
    asumptions,
    startTestingDate,
    endTestingDate
  } = userStoryInfos;
  const environmentOptions = Environments.map(environment => {
    return {
      key: environment,
      text: environment,
      value: environment
    };
  });
  return (
    <Segment>
      <Form>
        <Form.Field>
          <label>User story</label>
          <Input
            id="userStory"
            icon="linkify"
            iconPosition="left"
            value={userStory}
            onChange={handleFieldChange}
            placeholder="http://..."
          />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
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
          </Grid.Row>
        </Grid>
        <Form.Field>
          <label>Type</label>
          <Input
            id="type"
            icon="question circle outline"
            iconPosition="left"
            value={type}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <TagsInput
            label="Tools"
            id="tools"
            tags={tools}
            handleFieldChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>General comments</label>
          <TextArea
            id="comments"
            value={comments}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Asumptions</label>
          <TextArea
            id="asumptions"
            value={asumptions}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <label>Start testing date</label>
                <Datepicker
                  id="startTestingDate"
                  value={startTestingDate}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>End testing date</label>
                <Datepicker
                  id="endTestingDate"
                  value={endTestingDate}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default UserStoryInfos;
