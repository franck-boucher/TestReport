import React, { useState } from 'react';
import { Input, Header, Button, Segment, Label } from 'semantic-ui-react'
import { Formik, Form, Field } from 'formik';

import { fetchUserstory, findReport } from './jira/jiraFunctions'

const OpenRemoteUs = ({ openReport, createReport }) => {

  const [userStory, setUserStory] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = ({ search }, { setSubmitting }) => {
    fetchUserstory(search)
      .then(response => response.json())
      .then(json => {
        setUserStory(json);
        setError('');
      })
      .catch(() => {
        setError('Error while trying to retrieve userstory');
        setUserStory(null);
        setSubmitting(false);
      });
  }

  const report = findReport(userStory);
  const isReportPresent = !!report;

  const proceed = () => {
    if (userStory) {
      if (isReportPresent) openReport(userStory.fields.summary, report)
      else createReport(userStory.key, userStory.fields.summary)
    }
  }

  return (
    <div style={{ marginBottom: '1em' }}>

      {userStory && (
        <Segment raised>
          <Label color={userStory.fields.status.statusCategory.colorName} ribbon>
            [{userStory.fields.status.statusCategory.name}] {userStory.key}
          </Label>

          <div style={{ marginBottom: '1.5em' }}>
            <Header style={{ marginTop: '1em' }} size='small'>{userStory.fields.summary}</Header>
            {isReportPresent ? (
              <p style={{ fontStyle: 'italic' }}>A report is already existing for this userstory</p>
            ) : (
                <p style={{ fontStyle: 'italic' }}>No test report found for this userstory</p>
              )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setUserStory(null)}>Cancel</Button>
            <Button primary onClick={proceed} style={{ marginLeft: '0.5em' }}>
              {isReportPresent ? 'Open current report' : 'Create a new report'}
            </Button>
          </div>
        </Segment>
      )}

      {!userStory && (
        <Formik initialValues={{ search: '' }} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Header size='small' textAlign='center'>Select an Userstory from Jira</Header>
              <Field name="search" as={Input} icon='search' placeholder='ID-XXXX' />
              <Button primary type='submit' icon='arrow right'
                disabled={isSubmitting}
                loading={isSubmitting}
                style={{ marginLeft: '0.5em' }} />

              {error && (
                <div style={{ color: 'red' }}>{error}</div>
              )}
            </Form>
          )}
        </Formik>
      )}

    </div>
  );
};

export default OpenRemoteUs;