import React, { Component } from 'react';
import {
  Form,
  Input,
  Label,
  Icon,
  Grid,
  TextArea,
  Segment,
  Dropdown
} from 'semantic-ui-react';

import Datepicker from './Datepicker';
import { Environments } from '../util/constants';

class UserStoryInfos extends Component {
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
        const { tools } = this.props.userStoryInfos;
        tools.push(toolsInput);
        this.props.handleFieldChange(null, { id: 'tools', value: tools });
        this.setState({ toolsInput: '' });
      }
    }
  };
  removeTool = tool => {
    const { tools } = this.props.userStoryInfos;
    if (tools.includes(tool)) {
      tools.splice(tools.indexOf(tool), 1);
      this.props.handleFieldChange(null, { id: 'tools', value: tools });
    }
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
    } = this.props.userStoryInfos;
    const { handleFieldChange } = this.props;
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
  }
}

export default UserStoryInfos;
