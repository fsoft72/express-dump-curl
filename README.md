# express-dump-curl

This `ExpressJS` middleware dumps the equivalent curl command of the request received.

The `curl` dump can be written in standard output or on a specific file and it is generally very well formatted to ease both reading and editing.


## Installation
Install the package by running one of the following commands, depending on your configuration:

```npm install --save express-dump-curl```

```yarn add express-dump-curl```


## Usage
1. Include the package in your ExpressJS app along with other dependencies.

```
const fs = require ( 'fs' );
const express = require ( 'express' );

// Include express-dump-curl as a dependency
const dump_curl = require ( 'express-curl' );

const app = express ();
...
```

2. Declare this as a middleware just above the route definitions

```
app.use ( bodyParser.json() );
app.use ( multiplart() );
...

// Include the express dump curl middleware
// if no filename is specified in the call, console.log will be
// used to dump curls
app.use ( dump_curl () );

// Alternatively, you can specify a filename in dump_curl definition
// app.use ( dump_curl ( "/ramdisk/curls.txt" ) );

...
app.use('/auth', authRouter);
app.use('/users', usersRouter);
```

From now on, every single call will be logged on console or file depending on your configuration.

* Inspired by: https://github.com/sahilnarain/express-curl