import React, { Fragment } from 'react';
import { Segment, Message, Icon, Header } from 'semantic-ui-react';

import { iconStatus, colorStatus, colorPassed } from '../util/utils';

const TestStatus = ({ scenarios, selectScenario, percentPassed }) => {
  const scenariosResultTests = scenarios.map(scenario => (
    <Message
      key={scenario.uuid}
      onClick={() => selectScenario(scenario.uuid)}
      color={colorStatus(scenario.testStatus)}
      style={{ cursor: 'pointer' }}
    >
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
      <Segment color={colorPassed(percentPassed)}>
        <Header as="h4" style={{ textAlign: 'center' }}>
          {percentPassed}% passed
        </Header>
      </Segment>
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
};

export default TestStatus;
