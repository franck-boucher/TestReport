# TestReport

This app is used to generate CSV test reports of _to-be-tested_ developed features of a project.
This project is still at its early stages, so keep in mind the workflow and pre-filled values are still oriented to my experiences and needs. For now.

![Screenshot of the app](https://i.imgur.com/IKyjGPN.png)

## Features

- Filling test infos related to the user story
- Creating mutiple test scenarios
- Creating, updating (load/save) reports

## Getting started

Within embedded Electron:
```
git clone https://github.com/franck-boucher/TestReport.git
yarn install
yarn dev
```
or simply `yarn start` for the browser version.

Build the Electron packed app:
```
yarn electron-build
```

## TODO

- Keep track of currently saved file, not asking of new path to save it
- Shortcuts (new, open, save)
- Tabs
- Open file from / register to related issues on issue tracking apps (Jira, Redmine, ...)
