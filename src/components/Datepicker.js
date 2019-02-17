import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Input } from 'semantic-ui-react';
import frLocale from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr-FR', frLocale);

const Datepicker = ({ id, onChange, value, ...props }) => (
  <DatePicker
    {...props}
    id={id}
    customInput={
      <Input icon="calendar alternate outline" iconPosition="left" />
    }
    value={value.toLocaleDateString('fr-FR')}
    onChange={value => onChange(null, { id, value })}
    locale="fr-FR"
    dateFormat="dd/mm/yyyy"
  />
);

export default Datepicker;
