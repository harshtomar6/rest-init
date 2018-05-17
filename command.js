#!/usr/bin/env node

// Dependencies
const program = require('commander');
const { mainFunc, addResource } = require('./index');

program
  .version('0.0.4')
  .description(' A light-weight CLI Tool for creating basic CRUD operations of REST API')

program
  .command('new')
  .description('Creates A New Node.js And Express.js REST API')
  .action(() => mainFunc());

program.command('resource')
  .description('Creates Routes, and Controllers for a new Resource of an existing REST API')
  .action(() => addResource());

program.parse(process.argv);