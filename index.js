/*
 * dump_curl v 0.2.0 - By Fabio Rotondo (fabio.rotondo@gmail.com)
 * 
 * 0.2.0 - Removed a nasty bug that used to mangle multipart form submissions
 * 
 * Inspired by: https://github.com/sahilnarain/express-curl
*/
const fs = require ( "fs" );

const _build = ( params ) =>
{
	const _headers = [];
	const _body = [];

	try {
		if ( params.headers ) 
		{
			if ( params.headers [ 'content-length' ] ) delete params.headers [ 'content-length' ];

			for ( let key in params.headers ) _headers.push ( `-H '${key}:${params.headers[key]}'` );
		}

		if ( params.body ) 
		{
			if ( params.headers && params.headers [ 'content-type' ] && params.headers [ 'content-type' ] === 'application/json' )
			{
				_body.push ( `-d '${JSON.stringify(params.body)}'` );
			} else {
				for ( let key in params.body ) _body.push ( `-d '${key}=${params.body[key]}'` );
			}
		}

		const heads = _headers.join ( " \\\n " );
		const body  = _body.join ( " \\\n " );

		return `curl -X ${params.verb.toUpperCase()} \\\n ${heads} \\\n ${body} \\\n '${params.url}'\n\n\n`;
	} catch ( e ) {
		console.error ( e );
	}
};

const _dump_curl = function ( output_fname, force_https, req, res, next ) 
{
	const params = {};
	const prot = force_https ? "https" : req.protocol;

	params.url  = prot + '://' + ( req.headers.host || req.hostname ) + req.originalUrl;
	params.verb = req.method.toUpperCase();

	req.headers ? params.headers = { ...req.headers } : null;
	req.body ? params.body = { ...req.body } : null;

	const cx = _build ( params );

	if ( ! output_fname ) 
		console.log ( cx );
	else
	{
		fs.appendFileSync ( output_fname, cx );
	}

	next ();
};

const dump_curl = ( output_fname, force_https = false ) => ( req, res, next ) => _dump_curl ( output_fname, force_https, req, res, next );

module.exports = dump_curl;