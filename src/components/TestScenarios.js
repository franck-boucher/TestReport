import React, { Component } from 'react';
import {
  Segment,
  Button,
  Accordion,
  Grid,
  Header,
  Icon
} from 'semantic-ui-react';

import { EmptyScenario } from '../util/constants';
import { generateUuid, colorStatus } from '../util/utils';
import Scenario from './Scenario';

class TestScenarios extends Component {
  state = {
    active: ''
  };
  addNewScenario = () => {
    const uuid = generateUuid();
    const newScenario = { uuid, ...EmptyScenario };
    const { scenarios } = this.props.userStoryInfos;
    scenarios.push(newScenario);
    this.props.handleFieldChange(null, { id: 'scenarios', value: scenarios });
    this.setState({ active: uuid });
  };
  setActive = uuid => {
    const active = this.state.active !== uuid ? uuid : '';
    this.setState({ active });
  };
  updateScenario = updatedScenario => {
    const { scenarios } = this.props.userStoryInfos;
    const scenario = scenarios.find(s => s.uuid === updatedScenario.uuid);
    Object.assign(scenario, updatedScenario);
    this.props.handleFieldChange(null, { id: 'scenarios', value: scenarios });
  };
  deleteScenario = uuid => {
    const { scenarios } = this.props.userStoryInfos;
    const newScenarios = scenarios.filter(scenario => scenario.uuid !== uuid);
    this.props.handleFieldChange(null, {
      id: 'scenarios',
      value: newScenarios
    });
  };
  render() {
    const scenarios = this.props.userStoryInfos.scenarios.map(scenario => (
      <AccordionSegment
        key={scenario.uuid}
        isActive={this.state.active === scenario.uuid}
        scenario={scenario}
        handleClick={this.setActive}
        handleDelete={this.deleteScenario}
      >
        <Scenario scenario={scenario} updateScenario={this.updateScenario} />
      </AccordionSegment>
    ));
    return (
      <Segment>
        {this.props.userStoryInfos.scenarios.length > 0 && (
          <Accordion>{scenarios}</Accordion>
        )}
        {this.props.userStoryInfos.scenarios.length === 0 && (
          <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
            No scenario defined
          </p>
        )}
        <Button
          primary
          basic
          onClick={this.addNewScenario}
          style={{ marginTop: '1em' }}
          fluid
          className="basic-inverted"
        >
          New scenario
        </Button>
      </Segment>
    );
  }
}

const styles = {
  centered: {
    display: 'flex',
    alignItems: 'center'
  }
};

const AccordionSegment = ({
  children,
  isActive,
  handleClick,
  scenario,
  handleDelete
}) => (
  <Segment
    color={colorStatus(scenario.testStatus)}
    style={{ paddingTop: '0', paddingBottom: '0' }}
  >
    <Accordion.Title active={isActive}>
      <Grid>
        <Grid.Column
          style={styles.centered}
          width={1}
          onClick={() => handleClick(scenario.uuid)}
        >
          <Header size="small">
            <Icon name="dropdown" />
          </Header>
        </Grid.Column>
        <Grid.Column
          style={styles.centered}
          width={10}
          onClick={() => handleClick(scenario.uuid)}
        >
          {scenario.title && <Header size="small">{scenario.title}</Header>}
          {!scenario.title && (
            <span style={{ fontStyle: 'italic' }}>
              (No title for this scenario)
            </span>
          )}
        </Grid.Column>
        <Grid.Column
          width={5}
          style={{ justifyContent: 'flex-end', ...styles.centered }}
        >
          <Button
            onClick={() => handleDelete(scenario.uuid)}
            compact
            size="tiny"
            color="red"
            inverted
            icon
          >
            <Icon name="delete" />
          </Button>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
    <Accordion.Content style={{ marginBottom: '1em' }} active={isActive}>
      {children}
    </Accordion.Content>
  </Segment>
);

export default TestScenarios;