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

async function addResource(){
  if(!fs.existsSync('package.json')){
    console.log('package.json not found\n\nYou should be inside a node.js project to add a new resource\n\n');
    process.exit(0);
  }

  let resourceName = await input('Resource Names, [seperated by space]: ');
  let resources = resourceName.split(' ');
  let appName = JSON.parse(fs.readFileSync('package.json').toString()).name;

  if(!fs.existsSync('api'))
    op.createApiDirectories(appName, false);
  
  op.createControllers(appName, resources, false);
  op.createRoutes(appName, resources, false);
  
  if(!fs.existsSync('api/models/schema.js'))
    op.createModel(appName, resources, false);
  else
    op.addSchema(resources);
  
  op.editServerJS(resources);
  console.log('\n\nNEW RESOURCES ADDED.\nNext Steps: \n1. Define Schema for new resources in api/models/schema.js');
  process.exit(0);
}

addResource();

module.exports = {
  mainFunc,
  addResource
}