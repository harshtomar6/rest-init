// Dependencies
const fs = require('fs');
const os = require('os');
const util = require('./util');
const template = require('./templates');
const DIR_NAME = process.cwd()+'/';

const createAppDirectory = (appName) => {
  try{
    fs.mkdirSync(DIR_NAME+appName);
    console.log("CREATED DIRECTORY: "+appName);
  }catch(err){
    throw new Error(err);
  }
}

const createPackageJson = (appName, appDescription) => {
  try{
    fs.writeFileSync(DIR_NAME+appName+'/package.json', 
      template.packageTemplate(appName, appDescription));
    console.log('WRITTEN package.json');
  }catch(err){
    throw new Error(err);
  }
}

const installDependencies = (appName, callback) => {
  let command = 'npm install express mongoose body-parser dotenv morgan --save'
  console.log('INSTALLING DEPENDENCIES...');
  util.execCmd(command, DIR_NAME+appName, callback);
}

const createServerjs = (appName, resources) => {
  try{
    fs.writeFileSync(DIR_NAME+appName+'/server.js', 
      template.serverjsTemplate(resources));
    console.log('WRITTEN server.js');
  }catch(err){
    throw new Error(err);
  }
}

const createApiDirectories = (appName) => {
  try{
    fs.mkdirSync(DIR_NAME+appName+'/api');
    console.log("CREATED DIRECTORY: api");
    fs.mkdirSync(DIR_NAME+appName+'/api/routes');
    console.log("CREATED DIRECTORY: routes");
    fs.mkdirSync(DIR_NAME+appName+'/api/controllers');
    console.log("CREATED DIRECTORY: controllers");
    fs.mkdirSync(DIR_NAME+appName+'/api/models');
    console.log("CREATED DIRECTORY: models");
  }catch(err){
    throw new Error(err);
  }
}

const createControllers = (appName, resources) => {
  try{
    for(var i=0; i<resources.length;i++){
      fs.writeFileSync(`${DIR_NAME}${appName}/api/controllers/${resources[i]}Controller.js`,
        template.controllerTemplate(resources[i]));
      console.log(`WRITTEN ${resources[i]}Controller.js`);
    }
  }catch(err){
    throw new Error(err);
  }
}

const createRoutes = (appName, resources) => {
  try{
    fs.writeFileSync(`${DIR_NAME}${appName}/api/routes/homeRoute.js`,
        template.homeRouteTemplate());
    console.log(`WRITTEN homeRoute.js`);
    for(var i=0; i<resources.length;i++){
      fs.writeFileSync(`${DIR_NAME}${appName}/api/routes/${resources[i]}Route.js`,
        template.routesTemplate(resources[i]));
      console.log(`WRITTEN ${resources[i]}Route.js`);
    }
  }catch(err){
    throw new Error(err);
  }
}

const createModel = (appName, resources) => {
  try{
    fs.writeFileSync(`${DIR_NAME}${appName}/api/models/schema.js`,
      template.schemaTemplate(resources));
    console.log(`WRITTEN schema.js`);
  }catch(err){
    throw new Error(err);
  }
}

const createDotEnv = (appName) => {
  try{
    fs.writeFileSync(DIR_NAME+appName+'/.env', 
      `DATABASE_URI=YOUR_DATABASE_URL
      `);
    console.log('WRITTEN .env');
  }catch(err){
    throw new Error(err);
  }
}

const createDotGitIgnore = (appName) => {
  try{
    fs.writeFileSync(DIR_NAME+appName+'/.gitignore', 
      `node_modules
.env
      `);
    console.log('WRITTEN .gitignore');
  }catch(err){
    throw new Error(err);
  }
}

module.exports = {
  createAppDirectory,
  createPackageJson,
  createServerjs,
  installDependencies,
  createApiDirectories,
  createDotEnv,
  createDotGitIgnore,
  createModel,
  createControllers,
  createRoutes
}
