import Papa from 'papaparse';
import frLocale from 'date-fns/locale/fr';
import { format } from 'date-fns';

import { EmptyCSV } from './constants';

const Store = window.require('electron-store');

export const generateUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export const iconStatus = status => {
  if (status === 'OK') return 'check';
  else if (status === 'KO') return 'delete';
  else return 'wait';
};

export const colorStatus = status => {
  if (status === 'OK') return 'green';
  else if (status === 'KO') return 'red';
  else return 'yellow';
};

export const colorPassed = percent => {
  if (percent === 100) return 'green';
  return 'red';
};

export const cloneScenario = scenario => {
  const store = new Store();
  const newScenario = { ...scenario };
  newScenario.uuid = generateUuid();
  newScenario.title = 'Copy of ' + newScenario.title;
  newScenario.testStatus = store.get('emptyScenario').testStatus;
  return newScenario;
};

export const parseCSV = csvString => {
  const { data } = Papa.parse(csvString);
  let i = 12;
  const scenarios = [];
  while (data[i] && data[i][2]) {
    scenarios.push({
      uuid: generateUuid(),
      testStatus: data[i][1],
      title: data[i][2],
      description: data[i][3],
      urlParameters: data[i][4],
      headers: data[i][5],
      expectedResult: data[i][6],
      defects: data[i][7],
      comments: data[i][8]
    });
    i++;
  }
  const userStory = {
    userStory: data[1][2],
    environment: data[2][2],
    type: data[3][2],
    author: data[4][2],
    tools: data[5][2].split(' '),
    comments: data[6][2],
    asumptions: data[7][2],
    startTestingDate: data[8][2] ? new Date(data[8][2]) : null,
    endTestingDate: data[9][2] ? new Date(data[9][2]) : null,
    scenarios
  };
  return userStory;
};

export const generateCSV = userStory => {
  const data = [...EmptyCSV.toJS()];
  data[1][2] = userStory.userStory;
  data[2][2] = userStory.environment;
  data[3][2] = userStory.type;
  data[4][2] = userStory.author;
  data[5][2] = userStory.tools.join(' ');
  data[6][2] = userStory.comments;
  data[7][2] = userStory.asumptions;
  data[8][2] = userStory.startTestingDate
    ? formatDate(userStory.startTestingDate)
    : null;
  data[9][2] = userStory.endTestingDate
    ? formatDate(userStory.endTestingDate)
    : null;
  userStory.scenarios.forEach(scenario => {
    data.push([
      '',
      scenario.testStatus,
      scenario.title,
      scenario.description,
      scenario.urlParameters,
      scenario.headers,
      scenario.expectedResult,
      scenario.defects,
      scenario.comments
    ]);
  });
  return Papa.unparse(data, { delimiter: ';' });
};

export const formatDate = date => {
  return format(date, 'MM/dd/yyyy', { locale: frLocale });
};
