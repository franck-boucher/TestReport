import React from 'react';
import { Form, Input, TextArea, Dropdown, Grid } from 'semantic-ui-react';

import { TestStatuses } from '../util/constants';
import ExpendableLabel from './ExpendableLabel';

const Scenario = ({ scenario, updateScenario }) => {
  const handleFieldChange = (e, { id, value }) => {
    scenario[id] = value;
    updateScenario(scenario);
  };
  const statusOptions = TestStatuses.map(status => {
    return { key: status, text: status, value: status };
  });
  return (
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
                value={scenario.title}
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
                value={scenario.testStatus}
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
          value={scenario.description}
          onChange={handleFieldChange}
        />
      </Form.Field>
      <Form.Field>
        <label>URL parameters</label>
        <Input
          id="urlParameters"
          icon="code"
          iconPosition="left"
          value={scenario.urlParameters}
          onChange={handleFieldChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Headers</label>
        <TextArea
          id="headers"
          value={scenario.headers}
          onChange={handleFieldChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Expected result</label>
        <TextArea
          id="expectedResult"
          value={scenario.expectedResult}
          onChange={handleFieldChange}
        />
      </Form.Field>
      <Form.Field>
        <ExpendableLabel label="Defects" defaultExpended={!!scenario.defects}>
          <TextArea
            id="defects"
            value={scenario.defects}
            onChange={handleFieldChange}
          />
        </ExpendableLabel>
      </Form.Field>
      <Form.Field>
        <ExpendableLabel label="Comments" defaultExpended={!!scenario.comments}>
          <TextArea
            id="comments"
            value={scenario.comments}
            onChange={handleFieldChange}
          />
        </ExpendableLabel>
      </Form.Field>
    </Form>
  );
};

export default Scenario;
