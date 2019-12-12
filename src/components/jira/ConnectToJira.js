import React, { Fragment, useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';

import { connectToJira } from './jiraFunctions'
import { updateRemoteConfig, buildConfig } from '../../util/utils'
import { InputField } from '../../util/ui'

const ConnectToJira = ({ updateRemote }) => {

  const [isModalOpen, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const [error, setError] = useState('');

  const submit = (values) => {
    const { url, username, password } = values;
    connectToJira(url, username, password)
      .then(response => response.json())
      .then(json => handleResponse(json, values))
      .catch(() => setError('Could not connect to Jira'));
  };

  const handleResponse = (response, values) => {
    if (response && response.active) {
      const config = buildConfig(values)
      updateRemoteConfig(config);
      updateRemote(config)
    } else {
      setError('Your account is not active');
    }
  };

  return (
    <Fragment>
      <ConnectModal isModalOpen={isModalOpen} closeModal={closeModal} submit={submit} />

      <Button primary size='big' style={{ marginBottom: '1.5em' }} onClick={openModal}>
        Connect with Jira
      </Button>

      {error && (
        <div style={{ color: 'red' }}>{error}</div>
      )}
    </Fragment>
  );
};


const ConnectModal = ({ isModalOpen, closeModal, submit }) => {

  const onSubmit = (values) => {
    submit(values);
    closeModal();
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal} size='tiny'>
      <Modal.Header>Connect to Jira</Modal.Header>
      <Modal.Content style={{ paddingBottom: '1em' }}>
        <Formik initialValues={{ url: '', username: '', password: '' }} onSubmit={onSubmit}>
          {() => (
            <Form>
              <div className="ui form">
                <Field name="url" as={InputField} title='Jira URL' placeholder='https://...' />
                <Field name="username" as={InputField} title='Username' placeholder='johnDoe' />
                <Field type="password" name="password" as={InputField} title='Password' placeholder='**********' />
              </div>
              <div style={customActionsStyle}>
                <Button onClick={closeModal}>Cancel</Button>
                <Button primary type="submit" style={{ marginLeft: '0.5em' }}>Connect</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

const customActionsStyle = {
  textAlign: 'right',
  marginTop: '1.5em',
  marginBottom: '0.5em'
};

export default ConnectToJira;