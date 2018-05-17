const packageTemplate = (appName, appDescription) => {
  return (
    `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "${appDescription}",
  "main": "server.js",
  "scripts": {
    "test": "echo 'Error: no test specified' && exit 1"
  },
  "author": "node-init",
  "license": "ISC"
}`
  );
}

const serverjsTemplate = (resources) => {
  let rs = getRoutesDependencies(resources);
  let useRoutes = getUseRoutes(resources);
  return (
`// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const homeRoute = require('./api/routes/homeRoute');
${rs}
// Load dotenv variables
dotenv.load();

// Define PORT
const PORT = process.env.PORT || 3001;

// Connect to Database
mongoose.connect(process.env.DATABASE_URI);

// Use body parser to parse post requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Logger middleware
app.use(logger('dev'));

// Use Routes
app.use('/', homeRoute);
${useRoutes}
// Listen for HTTP Requests
app.listen(PORT, () => {
  console.log('Server is live at :'+PORT);
});
`
  );
}

const getRoutesDependencies = (resources) => {
  let routes = '';
  for(var i=0;i<resources.length;i++)
    routes += `const ${resources[i]}Route = require('./api/routes/${resources[i]}Route');
`;
  return routes;
}

const getUseRoutes = resources => {
  let use = '';

  for(var i=0;i<resources.length;i++)
    use += `app.use('/${resources[i]}', ${resources[i]}Route);
`;
  return use;
}

const routesTemplate = (resource) => {
  return (
    `// Dependencies
const express = require('express');
const router = express.Router();
const ${resource}Controller = require('./../controllers/${resource}Controller');

// Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key");
  next();
});

// GET '/${resource}' Route to get all ${resource}
router.get('/', (req, res, next) => {
  ${resource}Controller.getAll${capitalizeFirst(resource)}((err, success) => {
    if(err)
      res.status(500).json({err: err, data: null});
    else
      res.status(200).json({err: null, data: success});
  });
});

// GET '/${resource}/:${resource}Id' Route to get a particular ${resource}
router.get('/:${resource}Id', (req, res, next) => {
  ${resource}Controller.get${capitalizeFirst(resource)}(req.params.${resource}Id, (err, status, data) => {
    res.status(status).json({err: err, data: data});
  });
});

// POST '/${resource}' Route to add new ${resource}
router.post('/', (req, res, next) => {
  ${resource}Controller.add${capitalizeFirst(resource)}(req.body, (err, status, data) => {
    res.status(status).json({err: err, data: data});
  });
});

// PUT '/${resource}/:${resource}Id' Route to modify ${resource}
router.put('/:${resource}Id', (req, res, next) => {
  ${resource}Controller.modify${capitalizeFirst(resource)}(req.params.${resource}Id, req.body, (err, status, data) => {
    res.status(status).json({err: err, data: data});
  });
});

// DELETE '/${resource}/:${resource}Id' Route to delete ${resource}
router.delete('/:${resource}Id', (req, res, next) => {
  ${resource}Controller.delete${capitalizeFirst(resource)}(req.params.${resource}Id, (err, status, data) => {
    res.status(status).json({err: err, data: data});
  })
});

module.exports = router;
    `
  );
}

const controllerTemplate = resource => {
  return (
    `// Dependencies
const { ${capitalizeFirst(resource)} } = require('./../models/schema');
const { ObjectId } = require('mongodb');

// Get All ${resource}
const getAll${capitalizeFirst(resource)} = callback => {
  ${capitalizeFirst(resource)}.find({}, (err, success) => {
    return callback(err, success);
  })
}

// Get A Particular ${resource}
const get${capitalizeFirst(resource)} = (${resource}Id, callback) => {
  if(!ObjectId.isValid(${resource}Id))
    return callback('Invalid ${resource} Id', 400, null);
  
  ${capitalizeFirst(resource)}.findOne({_id: ${resource}Id}, (err, data) => {
    if(err)
      return callback(err, 500, null);
    else if(!data)
      return callback('${capitalizeFirst(resource)} Not Found', 404, null);
    else
      return callback(null, 200, data);
  });
}

// Add a ${resource}
const add${capitalizeFirst(resource)} = (data, callback) => {
  let ${resource} = new ${capitalizeFirst(resource)}(data);

  ${resource}.save((err, success) => {
    if(err)
      return callback(err, 500, null);
    else
      return callback(null, 200, success);
  });
}

// Modify a ${resource}
const modify${capitalizeFirst(resource)} = (${resource}Id, data, callback) => {
  if(!ObjectId.isValid(${resource}Id))
    return callback('Invalid ${capitalizeFirst(resource)} Id', 400, null);
  
  ${capitalizeFirst(resource)}.findOne({_id: ${resource}Id}, (err, success) => {
    if(err)
      return callback(err, 500, null);
    else if(!success)
      return callback('${capitalizeFirst(resource)} Not Found', 404, null);
    else{
      ${capitalizeFirst(resource)}.update({_id: ${resource}Id}, data, (err, success) => {
        if(err)
          return callback(err, 500, null);
        else
          return callback(null, 200, success);
      });
    }
  });
}

// Delete a ${resource}
const delete${capitalizeFirst(resource)} = (${resource}Id, callback) => {
  if(!ObjectId.isValid(${resource}Id))
    return callback('Invalid ${capitalizeFirst(resource)} Id', 400, null);
  
  ${capitalizeFirst(resource)}.findOne({_id: ${resource}Id}, (err, success) => {
    if(err)
      return callback(err, 500, null);
    else if(!success)
      return callback('${capitalizeFirst(resource)} Not Found', 404, null);
    else{
      ${capitalizeFirst(resource)}.remove({_id: ${resource}Id}, (err, success) => {
        if(err)
          return callback(err, 500, null);
        else
          return callback(null, 200, success);
      })
    }
  })
}

module.exports = {
  getAll${capitalizeFirst(resource)},
  get${capitalizeFirst(resource)},
  add${capitalizeFirst(resource)},
  modify${capitalizeFirst(resource)},
  delete${capitalizeFirst(resource)}
}
    `
  );
}

const schemaTemplate = (resources) => {
  let schema = '', modules= ''
  for (var i=0;i<resources.length;i++){
    schema += `const ${resources[i]}Schema = mongoose.Schema({

});

`;  
    modules += `${capitalizeFirst(resources[i])} : mongoose.model('${capitalizeFirst(resources[i])}', ${resources[i]}Schema),
  `;
}
  return (
    `// Dependencies
const mongoose = require('mongoose');

${schema}
module.exports = {
  ${modules}
}
    `
  );
}

const homeRouteTemplate = () => {
  return (
    `// Dependencies
const express = require('express');
const router = express.Router();

// Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key");
  next();
});

router.get('/', (req, res, next) => {
  res.send('API IS LIVE');
});

module.exports = router;
    `
  );
}

const capitalizeFirst = (word) => {
  return word[0].toUpperCase()+word.substr(1, word.length);
}

module.exports = {
  packageTemplate,
  serverjsTemplate,
  routesTemplate,
  controllerTemplate,
  schemaTemplate,
  homeRouteTemplate,
  capitalizeFirst
}