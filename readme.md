# rest-init

A Simple CLI Tool to create basic CRUD operations of a REST API

## Installation
```
npm install -g rest-init
```

This will install rest-init globally on your system

## Basic Usages

**To Create a New Rest API**
```
rest-init new
```

Answer the questions that follows and a REST Api will be created in your current working directory.
The basic Dependencies will also get installed.

List of Dependencies that will be installed :-

1. body-parser => For Parsing post request params
2. dotenv => To Load .env file variables in process.env
3. express => Express Framework
4. mongoose => elegant mongodb object modeling for node.js
5. morgan => Logger

Basic Directory Structure

```
- api
|-- controllers
|-- models
|-- routes
- node_modules
- .env
- .gitignore
- package.json
- server.js
```

After Creating Rest Api -
1. Define Your Database URI in .env file
2. Define Your Schema in api/models/schema.js

More Features are coming soon.

Happy Coding..!!