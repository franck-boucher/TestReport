import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Input } from 'semantic-ui-react';
import frLocale from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr-FR', frLocale);

class Datepicker extends Component {
  render() {
    const { id, onChange, value, ...props } = this.props;
    return (
      <DatePicker
        {...props}
        id={id}
        customInput={<CustomInput />}
        value={value.toLocaleDateString('fr-FR')}
        onChange={value => onChange(null, { id, value })}
        locale="fr-FR"
        dateFormat="dd/mm/yyyy"
      />
    );
  }
}

class CustomInput extends React.Component {
  render() {
    return (
      <Input
        icon="calendar alternate outline"
        iconPosition="left"
        {...this.props}
      />
    );
  }
}

export default Datepicker;
