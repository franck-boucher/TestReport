import { Map, List } from 'immutable';
import { generateUuid } from './utils'

const Store = window.require('electron-store');

export const Environments = ['DEV', 'RCT', 'PROD'];

export const TestStatuses = ['PENDING', 'OK', 'KO'];

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
  return Map({
    content: {
      userStory: emptyUserStory.userStory,
      environment: emptyUserStory.environment,
      type: emptyUserStory.type,
      author: emptyUserStory.author,
      tools: List(emptyUserStory.tools),
      comments: emptyUserStory.comments,
      asumptions: emptyUserStory.asumptions,
      scenarios: List(emptyUserStory.scenarios)
    },
    metadata: {
      uuid: generateUuid(),
      summary: '',
      isRemote: false,
      remote: '',
      reportAttachmentId: '',
      reportPdfAttachmentId: '',
      selectedScenario: '',
      activeTabIndex: 0
    }
  });
};

export const DialogConfig = {
  properties: ['openFile'],
  filters: [
    { name: 'Json Files', extensions: ['json', 'JSON'] },
    { name: 'All Files', extensions: ['*'] }
  ]
};

export const DialogPdfConfig = {
  properties: ['openFile'],
  filters: [{ name: 'PDF Files', extensions: ['pdf', 'PDF'] }]
};