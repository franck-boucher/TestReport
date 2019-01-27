import React, { Component } from 'react';
import {
  Icon,
  Form,
  TextArea,
  Grid,
  Input,
  Dropdown,
  Label,
  Segment
} from 'semantic-ui-react';

import { Environments, DateConfigs } from '../util/constants';

class EmptyUserStoryPreferences extends Component {
  state = {
    toolsInput: ''
  };
  handleFieldChange = (e, { id, value }) => {
    this.setState({ [id]: value });
  };
  submitNewTool = event => {
    if (event.key === 'Enter') {
      const { toolsInput } = this.state;
      if (toolsInput) {
        const { tools } = this.props.emptyUserStory;
        tools.push(toolsInput);
        this.props.handleFieldChange(null, { id: 'tools', value: tools });
        this.setState({ toolsInput: '' });
      }
    }
  };
  removeTool = tool => {
    const newTools = this.props.emptyUserStory.tools.filter(el => el !== tool);
    this.props.handleFieldChange(null, { id: 'tools', value: newTools });
  };
  handleRef = c => {
    this.inputRef = c;
  };
  focus = () => {
    this.inputRef.focus();
  };
  render() {
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
    } = this.props.emptyUserStory;
    const labelTools = tools.map(tool => (
      <Label key={tool} color="blue" basic className="basic-inverted">
        {tool} <Icon name="close" onClick={() => this.removeTool(tool)} />
      </Label>
    ));
    const environmentOptions = Environments.map(environment => {
      return {
        key: environment,
        text: environment,
        value: environment
      };
    });
    const dateConfigOptions = DateConfigs.map(dateConfig => {
      return {
        key: dateConfig,
        text: dateConfig,
        value: dateConfig
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
              onChange={this.props.handleFieldChange}
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
                    onChange={this.props.handleFieldChange}
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
                    onChange={this.props.handleFieldChange}
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
              onChange={this.props.handleFieldChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Tools</label>
            <div
              className="ui multiple search selection dropdown"
              onClick={this.focus}
            >
              {labelTools}
              <input
                id="toolsInput"
                className="search"
                style={{ width: 'auto' }}
                value={this.state.toolsInput}
                ref={this.handleRef}
                onKeyPress={this.submitNewTool}
                onChange={e =>
                  this.handleFieldChange(e, {
                    id: e.target.id,
                    value: e.target.value
                  })
                }
              />
            </div>
          </Form.Field>
          <Form.Field>
            <label>General comments</label>
            <TextArea
              id="comments"
              value={comments}
              onChange={this.props.handleFieldChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Asumptions</label>
            <TextArea
              id="asumptions"
              value={asumptions}
              onChange={this.props.handleFieldChange}
            />
          </Form.Field>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>Start testing date</label>
                  <Dropdown
                    id="startTestingDate"
                    fluid
                    selection
                    options={dateConfigOptions}
                    value={startTestingDate}
                    onChange={this.props.handleFieldChange}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>End testing date</label>
                  <Dropdown
                    id="endTestingDate"
                    fluid
                    selection
                    options={dateConfigOptions}
                    value={endTestingDate}
                    onChange={this.props.handleFieldChange}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

export default EmptyUserStoryPreferences;
