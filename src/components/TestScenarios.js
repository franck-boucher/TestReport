import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Segment,
  Button,
  Accordion,
  Grid,
  Header,
  Icon,
  Label
} from 'semantic-ui-react';

import { EmptyScenario } from '../util/constants';
import { generateUuid, colorStatus, cloneScenario } from '../util/utils';
import Scenario from './Scenario';

class TestScenarios extends Component {
  onDragEnd = result => {
    if (!result.destination) return; // dropped outside the list
    this.reorderScenarios(result.source.index, result.destination.index);
  };
  reorderScenarios = (startIndex, endIndex) => {
    const result = Array.from(this.props.userStoryInfos.scenarios);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    this.props.handleFieldChange(null, { id: 'scenarios', value: result });
  };
  addNewScenario = () => {
    const uuid = generateUuid();
    const newScenario = { uuid, ...EmptyScenario().toJS() };
    const { scenarios } = this.props.userStoryInfos;
    scenarios.push(newScenario);
    this.props.handleFieldChange(null, { id: 'scenarios', value: scenarios });
    this.props.selectScenario(uuid);
  };
  setActive = uuid => {
    const active = this.props.selectedScenario !== uuid ? uuid : '';
    this.props.selectScenario(active);
  };
  updateScenario = updatedScenario => {
    const { scenarios } = this.props.userStoryInfos;
    const scenario = scenarios.find(s => s.uuid === updatedScenario.uuid);
    Object.assign(scenario, updatedScenario);
    this.props.handleFieldChange(null, { id: 'scenarios', value: scenarios });
  };
  cloneScenario = uuid => {
    const { scenarios } = this.props.userStoryInfos;
    const indexScenarioToClone = scenarios
      .map(scenario => scenario.uuid)
      .indexOf(uuid);
    const scenarioToClone = scenarios.find(scenario => scenario.uuid === uuid);
    const newScenario = cloneScenario(scenarioToClone);
    scenarios.splice(indexScenarioToClone + 1, 0, newScenario);
    this.props.handleFieldChange(
      null,
      {
        id: 'scenarios',
        value: scenarios
      },
      () => this.setActive(newScenario.uuid)
    );
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
    const { scenarios } = this.props.userStoryInfos;
    return (
      <Segment raised style={{ paddingTop: '1.5em' }}>
        <Label attached='top' size='large'>Test scenarios</Label>
        {this.props.userStoryInfos.scenarios.length > 0 && (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  className="accordion ui"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {scenarios.map((scenario, index) => (
                    <Draggable
                      key={scenario.uuid}
                      draggableId={scenario.uuid}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: '1em',
                            ...provided.draggableProps.style
                          }}
                        >
                          <AccordionSegment
                            isActive={
                              this.props.selectedScenario === scenario.uuid
                            }
                            scenario={scenario}
                            handleClick={this.setActive}
                            handleClone={this.cloneScenario}
                            handleDelete={this.deleteScenario}
                          >
                            <Scenario
                              scenario={scenario}
                              updateScenario={this.updateScenario}
                            />
                          </AccordionSegment>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
  handleClone,
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
          width={12}
          onClick={() => handleClick(scenario.uuid)}
        >
          {scenario.title && (
            <Header
              size="small"
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {scenario.title}
            </Header>
          )}
          {!scenario.title && (
            <span style={{ fontStyle: 'italic' }}>
              (No title for this scenario)
            </span>
          )}
        </Grid.Column>
        <Grid.Column
          width={3}
          style={{ justifyContent: 'flex-end', ...styles.centered }}
        >
          <Button
            onClick={() => handleClone(scenario.uuid)}
            compact
            size="tiny"
            color="blue"
            inverted
            icon
          >
            <Icon name="clone" />
          </Button>
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
