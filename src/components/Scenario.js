import React, { Component } from 'react';
import { Form, Input, TextArea, Dropdown, Grid } from 'semantic-ui-react';

import { TestStatuses } from '../util/constants';

class Scenario extends Component {
  handleFieldChange = (e, { id, value }) => {
    const { scenario } = this.props;
    scenario[id] = value;
    this.props.updateScenario(scenario);
  };
  render() {
    const {
      testStatus,
      title,
      description,
      urlParameters,
      headers,
      expectedResult,
      defects,
      comments
    } = this.props.scenario;
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
                  value={title}
                  onChange={this.handleFieldChange}
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
                  onChange={this.handleFieldChange}
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
            onChange={this.handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>URL parameters</label>
          <Input
            id="urlParameters"
            icon="code"
            iconPosition="left"
            value={urlParameters}
            onChange={this.handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Headers</label>
          <TextArea
            id="headers"
            value={headers}
            onChange={this.handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Expected result</label>
          <TextArea
            id="expectedResult"
            value={expectedResult}
            onChange={this.handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Defects</label>
          <TextArea
            id="defects"
            value={defects}
            onChange={this.handleFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Comments</label>
          <TextArea
            id="comments"
            value={comments}
            onChange={this.handleFieldChange}
          />
        </Form.Field>
      </Form>
    );
  }
}

export default Scenario;
