/*
 * dump_curl v 0.3.0 - By Fabio Rotondo (fabio.rotondo@gmail.com)
 * 
 * 0.3.0 - ADD: support for RESTest file format (partial)
 * 		   ADD: new exported function dump_restest ()  (defaults is always dump_curl)
 * 		   ADD: new _safe () function to output objects and strings with double quotes correctly
 * 		   FIX: now CURL exports the application/json requests correctly
 * 	
 * 0.2.0 - Removed a nasty bug that used to mangle multipart form submissions
 * 
 * Inspired by: https://github.com/sahilnarain/express-curl
*/
const fs = require ( "fs" );

const _safe = ( txt ) => {
	const s = JSON.stringify ( txt );

	if ( s.charAt ( 0 ) === '"' ) return s.slice ( 1, -1 );
	return s.replace ( /"/g, '\\"' );
};

const _build_restest = ( params ) =>
{
	const _headers = [];
	const _body = [];

	try {
		/*  // Headers are not yet supported by RESTest
		if ( params.headers ) 
		{
			if ( params.headers [ 'content-length' ] ) delete params.headers [ 'content-length' ];

			for ( let key in params.headers ) _headers.push ( `            "${key}": "${_safe(params.headers[key])}"` );
		}
		*/

		if ( params.body ) 
		{
			for ( let key in params.body ) _body.push ( `				"${key}": "${_safe(params.body[key])}"` );
		}

		const heads = _headers.join ( ",\n" );
		const body  = _body.join ( ",\n" );
		const action = `			"action": "${params.verb.toLowerCase()}"`;
		const url = `			"url": "${params.url}"`;
		let _params = '';

		if ( _body.length )
		{
			_params = `,
			"params": {
${body}
			}
			`;
		}

		return `		{
${action},
${url}${_params}
		},
`;
	} catch ( e ) {
		console.error ( e );
	}
};

const _build_curl = ( params ) =>
{
	const _headers = [];
	const _body = [];

	try {
		if ( params.headers ) 
		{
			if ( params.headers [ 'content-length' ] ) delete params.headers [ 'content-length' ];

			for ( let key in params.headers ) _headers.push ( `-H "${key}:${_safe(params.headers[key])}"` );
		}

		if ( params.body ) 
		{
			if ( params.headers && params.headers [ 'content-type' ] && ( params.headers [ 'content-type' ] === 'application/json' ) )
			{
				_body.push ( `-d '${JSON.stringify(params.body)}'` );
			} else {
				for ( let key in params.body ) _body.push ( `-d "${key}=${_safe(params.body[key])}"` );
			}
		}

		const heads = _headers.join ( " \\\n " );
		const body  = _body.join ( " \\\n " );

		return `curl -X ${params.verb.toUpperCase()} \\\n ${heads} \\\n ${body} \\\n '${params.url}'\n\n\n`;
	} catch ( e ) {
		console.error ( e );
	}
};

const _dump_curl = function ( output_fname, force_https, req, res, next, restest ) 
{
	const params = {};
	const prot = force_https ? "https" : req.protocol;

	params.url  = prot + '://' + ( req.headers.host || req.hostname ) + req.originalUrl;
	params.verb = req.method.toUpperCase();

	req.headers ? params.headers = { ...req.headers } : null;
	req.body ? params.body = { ...req.body } : null;

	const cx = _build_curl ( params, restest );

	if ( ! output_fname ) 
		console.log ( cx );
	else
	{
		fs.appendFileSync ( output_fname, cx );
	}

	next ();
};

const _dump_restest = function ( output_fname, force_https, req, res, next ) 
{
	const params = {};
	const prot = force_https ? "https" : req.protocol;

	params.url  = req.originalUrl;
	params.verb = req.method.toLowerCase();

	req.headers ? params.headers = { ...req.headers } : null;
	req.body ? params.body = { ...req.body } : null;

	const cx = _build_restest ( params );

	if ( ! output_fname ) 
		console.log ( cx );
	else
	{
		fs.appendFileSync ( output_fname, cx );
	}

	next ();
};

const dump_curl    = ( output_fname, force_https = false ) => ( req, res, next ) => _dump_curl ( output_fname, force_https, req, res, next );
const dump_restest = ( output_fname, force_https = false ) => ( req, res, next ) => _dump_restest ( output_fname, force_https, req, res, next );

module.exports.default = dump_curl;
module.exports.dump_restest = dump_restest;
module.exports.dump_curl = dump_curl;