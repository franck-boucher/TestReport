import { Map, List } from 'immutable';

const Store = window.require('electron-store');

export const Environments = ['DEV', 'RCT', 'PROD'];

export const TestStatuses = ['PENDING', 'OK', 'KO'];

export const DateConfigs = ['YESTERDAY', 'TODAY', 'TOMORROW'];

export const LanguageOptions = [
  { key: 'en', value: 'en', text: 'English' },
  { key: 'fr', value: 'fr', text: 'Français' }
];

export const EmptyScenario = () => {
  const store = new Store();
  const emptyScenario = store.get('emptyScenario');
  return Map({ ...emptyScenario });
};

export const EmptyUserStory = () => {
  const store = new Store();
  const emptyUserStory = store.get('emptyUserStory');
  const startTestingDate = dateConfig(emptyUserStory.startTestingDate);
  const endTestingDate = dateConfig(emptyUserStory.endTestingDate);
  return Map({
    userStory: emptyUserStory.userStory,
    environment: emptyUserStory.environment,
    type: emptyUserStory.type,
    author: emptyUserStory.author,
    tools: List(emptyUserStory.tools),
    comments: emptyUserStory.comments,
    asumptions: emptyUserStory.asumptions,
    startTestingDate,
    endTestingDate,
    scenarios: List(emptyUserStory.scenarios)
  });
};

export const dateConfig = config => {
  switch (config) {
    case 'TODAY':
      return new Date();
    case 'TOMORROW':
      return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    case 'YESTERDAY':
      return new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    default:
      return new Date();
  }
};

export const DialogConfig = {
  properties: ['openFile'],
  filters: [
    { name: 'CSV Files', extensions: ['csv', 'CSV'] },
    { name: 'All Files', extensions: ['*'] }
  ]
};

export const EmptyCSV = List([
  List(['', '', '', '', '', '', '', '']),
  List(['', 'User story:', '', '', '', '', '', '']),
  List(['', 'Environment:', '', '', '', '', '', '']),
  List(['', 'Type:', '', '', '', '', '', '']),
  List(['', 'Author:', '', '', '', '', '', '']),
  List(['', 'Tools:', '', '', '', '', '', '']),
  List(['', 'General comment:', '', '', '', '', '', '']),
  List(['', 'Asumptions: ', '', '', '', '', '', '']),
  List(['', 'Start testing date:', '', '', '', '', '', '']),
  List(['', 'End testing date', '', '', '', '', '', '']),
  List(['', '', '', '', '', '', '', '']),
  List([
    '',
    'Test status',
    'Scenario title',
    'Scenario description',
    'URL parameters',
    'Headers',
    'Expected result',
    'Defects',
    'Comments'
  ])
]);
