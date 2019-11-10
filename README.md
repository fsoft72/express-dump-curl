# express-dump-curl

This `ExpressJS` middleware dumps the equivalent curl command of the request received.

The `curl` dump can be written in standard output or on a specific file and it is generally very well formatted to ease both reading and editing.


## Installation
Install the package by running one of the following commands, depending on your configuration:

```bash
npm install --save express-dump-curl
```

```bash
yarn add express-dump-curl
```


## Usage
1. Include the package in your ExpressJS app along with other dependencies.

```javascript
const fs = require ( 'fs' );
const express = require ( 'express' );

// Include express-dump-curl as a dependency
const dump_curl = require ( 'express-dump-curl' ).dump_curl;

const app = express ();
...
```

2. Declare this as a middleware just above the route definitions

```javascript
app.use ( bodyParser.json() );
app.use ( multiplart() );
...

// There are two parameters you can pass at the `dump_curl()` middleware:
//
// dump_curl ( output_file,  force_https )
//
// - output_file   - a complete filepath where to save the curls.
//                  if the path is not specified, stdout will be used.
//
// - force_https   - a flag T/F. If true, the protocol of the CURL will always
//                   be "https" reguardless of the real protocol used.

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

There are two parameters you can pass at the `dump_curl()` middleware:

`dump_curl ( output_file,  force_https )`

 - `output_file`   - a complete filepath where to save the curls.
                   if the path is not specified, stdout will be used.

 - `force_https`   - a flag T/F. If true, the protocol of the CURL will always
                   be "https" reguardless of the real protocol used.

## Additional APIs

You can do even more with this module, in fact there are two extra methods you can use in your software.

`dump_restest ( output_file, force_https )`

Is identical to `dump_curl()` but it dumps a JSON in RESTest format (the RESTest application has not been delivered yet).

`curl_str ( force_https )`  returns a string with the CURL. The method is the same used inside `dump_curl()`