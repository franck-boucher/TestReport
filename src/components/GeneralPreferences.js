import React from 'react';
import { Form, Grid, Dropdown, Segment, Checkbox } from 'semantic-ui-react';

import { LanguageOptions } from '../util/constants';

const GeneralPreferences = ({ general, handleFieldChange }) => {
  const { language, darkMode } = general;
  const toggle = () => {
    handleFieldChange(null, { id: 'darkMode', value: !darkMode });
  };
  console.log(language);
  return (
    <Segment>
      <Form>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <label>Language</label>
                <Dropdown
                  id="language"
                  fluid
                  selection
                  disabled
                  value={language}
                  onChange={handleFieldChange}
                  options={LanguageOptions}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Dark mode</label>
                <Checkbox
                  id="darkMode"
                  toggle
                  disabled
                  onChange={toggle}
                  checked={darkMode}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default GeneralPreferences;
