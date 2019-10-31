import React from 'react';
import {
  Form,
  TextArea,
  Grid,
  Input,
  Dropdown,
  Segment
} from 'semantic-ui-react';

import { TestStatuses } from '../util/constants';

const EmptyScenarioPreferences = ({ emptyScenario, handleFieldChange }) => {
  const {
    testStatus,
    title,
    description,
    urlParameters,
    headers,
    currentResult,
    expectedResult,
    defects,
    comments
  } = emptyScenario;
  const statusOptions = TestStatuses.map(status => {
    return { key: status, text: status, value: status };
  });
  return (
    <Segment>
      <Form>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={11}>
              <Form.Field>
                <label>Title</label>
                <Input
                  id="title"
                  icon="bookmark outline"
                  iconPosition="left"
                  value={title}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={5}>
              <Form.Field>
                <label>Test status</label>
                <Dropdown
                  id="testStatus"
                  fluid
                  selection
                  options={statusOptions}
                  value={testStatus}
                  onChange={handleFieldChange}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form.Field>
          <label>Description</label>
          <TextArea
            id="description"
            value={description}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>URL parameters</label>
          <Input
            id="urlParameters"
            icon="code"
            iconPosition="left"
            value={urlParameters}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Headers</label>
          <TextArea id="headers" value={headers} onChange={handleFieldChange} />
        </Form.Field>
        <Form.Field>
          <label>Current result</label>
          <TextArea
            id="currentResult"
            value={currentResult}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Expected result</label>
          <TextArea
            id="expectedResult"
            value={expectedResult}
            onChange={handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Defects</label>
          <TextArea id="defects" value={defects} onChange={handleFieldChange} />
        </Form.Field>
        <Form.Field>
          <label>Comments</label>
          <TextArea
            id="comments"
            value={comments}
            onChange={handleFieldChange}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default EmptyScenarioPreferences;
