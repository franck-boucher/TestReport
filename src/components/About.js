import React from 'react';
import { Modal, Header, Button, List } from 'semantic-ui-react';

const { app, shell } = window.require('electron').remote;

const About = ({ isModalOpen, handleClose }) => {
  const openLink = link => {
    shell.openExternal(link);
  };
  return (
    <Modal id="about" open={isModalOpen} size="small">
      <Header content="About TestReport" />
      <Modal.Content scrolling>
        <p>Small app that generates test reports of newly developed features</p>
        <List>
          <List.Item icon="code branch" content={app.getVersion()} />
          <List.Item
            icon="github"
            content={
              <span
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() =>
                  openLink('https://github.com/franck-boucher/TestReport')
                }
              >
                https://github.com/franck-boucher/TestReport
              </span>
            }
          />
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Nice !</Button>
      </Modal.Actions>
    </Modal>
  );
};
export default About;
