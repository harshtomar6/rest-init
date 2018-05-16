// Dependencies
const os = require('os');
const fs = require('fs');
const util = require('./util');
const op = require('./operations');
const templates = require('./templates');
const { input } = util;

let appName = '', appDescription = '', appResources=[];

async function mainFunc(){
  let appName = await input('App Name: ');
  let appDescription = await input('App Description: ');
  let appResources = await input('App Resource, [seperated by space]: ');
  appResources = appResources.split(' ');

  op.createAppDirectory(appName);
  op.createPackageJson(appName, appDescription);
  op.createServerjs(appName, appResources);
  op.createApiDirectories(appName);
  op.createDotEnv(appName)
  op.createDotGitIgnore(appName);
  op.createControllers(appName, appResources);
  op.createRoutes(appName, appResources);
  op.createModel(appName, appResources);
  op.installDependencies(appName, function(){
    console.log(`\n\n${appName} REST API CREATED !`);
    console.log(`Next Steps: \n1. Define DATABASE_URI in .env file\n2. Define Schema in api/models/schema.js file.\n`);
    console.log('HAPPY CODING');
    process.exit(0);
  });
}
module.exports = {
  mainFunc
}