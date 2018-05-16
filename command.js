#!/usr/bin/env node

// Dependencies
const program = require('commander');
const { mainFunc } = require('./index');

program
  .version('0.0.3')
  .description(' A light-weight CLI Tool for creating basic CRUD operations of REST API')

program
  .command('new')
  .description('Creates A New Node.js And Express.js REST API')
  .action(() => mainFunc());

program.parse(process.argv);