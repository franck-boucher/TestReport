import React, { Component, Fragment } from 'react';
import { Segment, Message, Icon, Header } from 'semantic-ui-react';

import { iconStatus, colorStatus } from '../util/utils';

class TestStatus extends Component {
  render() {
    const scenariosResultTests = this.props.scenarios.map(scenario => (
      <Message key={scenario.uuid} color={colorStatus(scenario.testStatus)}>
        <Icon name={iconStatus(scenario.testStatus)} />
        {scenario.title && <span>{scenario.title}</span>}
        {!scenario.title && (
          <span style={{ fontStyle: 'italic' }}>
            (No title for this scenario)
          </span>
        )}
      </Message>
    ));
    return (
      <Fragment>
        <Header id="test-status" as="h3" dividing>
          Test statuses
        </Header>
        <Segment style={{ paddingTop: '1.5em' }}>
          {scenariosResultTests.length > 0 && scenariosResultTests}
          {scenariosResultTests.length === 0 && (
            <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
              No scenario defined
            </p>
          )}
        </Segment>
      </Fragment>
    );
  }
}

export default TestStatus;
