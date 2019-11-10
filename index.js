"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * dump_curl v 0.5.0 - By Fabio Rotondo (fabio.rotondo@gmail.com)
 *
 * 0.5.0 - ADD: curl_str () method to obtain the curl as a string
 * 		   ADD: rewritten in TypeScript
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
const fs_1 = require("fs");
const _safe = (txt) => {
    const s = JSON.stringify(txt);
    if (s.charAt(0) === '"')
        return s.slice(1, -1);
    return s.replace(/"/g, '\\"');
};
const _build_restest = (params) => {
    const _headers = [];
    const _body = [];
    try {
        if (params.body)
            for (const key in params.body)
                _body.push(`				"${key}": "${_safe(params.body[key])}"`);
        const heads = _headers.join(",\n");
        const body = _body.join(",\n");
        const action = `			"action": "${params.verb.toLowerCase()}"`;
        const url = `			"url": "${params.url}"`;
        let _params = '';
        if (_body.length) {
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
    }
    catch (e) {
        console.error(e);
    }
    return '';
};
const _build_curl = (params) => {
    const _headers = [];
    const _body = [];
    try {
        if (params.headers) {
            if (params.headers['content-length'])
                delete params.headers['content-length'];
            for (const key in params.headers)
                _headers.push(`-H "${key}:${_safe(params.headers[key])}"`);
        }
        if (params.body) {
            if (params.headers && params.headers['content-type'] && (params.headers['content-type'] === 'application/json')) {
                _body.push(`-d '${JSON.stringify(params.body)}'`);
            }
            else {
                for (const key in params.body)
                    _body.push(`-d "${key}=${_safe(params.body[key])}"`);
            }
        }
        const heads = _headers.join(" \\\n ");
        const body = _body.join(" \\\n ");
        return `curl -X ${params.verb.toUpperCase()} \\\n ${heads} \\\n ${body} \\\n '${params.url}'\n\n\n`;
    }
    catch (e) {
        console.error(e);
    }
    return '';
};
exports.curl_str = (force_https, req) => {
    const params = { url: null, verb: null, headers: {}, body: {} };
    const prot = force_https ? "https" : req.protocol;
    params.url = prot + '://' + (req.headers.host || req.hostname) + req.originalUrl;
    params.verb = req.method.toUpperCase();
    if (req.headers)
        params.headers = { ...req.headers };
    if (req.body)
        params.body = { ...req.body };
    return _build_curl(params);
};
const _dump_curl = function (output_fname, force_https, req, res, next) {
    const cx = exports.curl_str(force_https, req);
    if (!output_fname)
        console.log(cx);
    else {
        fs_1.appendFileSync(output_fname, cx);
    }
    next();
};
const _dump_restest = function (output_fname, force_https, req, res, next) {
    const params = { url: null, verb: null, headers: {}, body: {} };
    params.url = req.originalUrl;
    params.verb = req.method.toLowerCase();
    if (req.headers)
        params.headers = { ...req.headers };
    if (req.body)
        params.body = { ...req.body };
    const cx = _build_restest(params);
    if (!output_fname)
        console.log(cx);
    else {
        fs_1.appendFileSync(output_fname, cx);
    }
    next();
};
/**
 *	dump_curl ( output_fname: string, force_https: boolean = false )
 *
 *  @param output_fname - The full path where the curl will be written. If it is null or '', the curl will be printed on stdout
 *  @param force_https  - Sometimes, external endpoints are in HTTPS, but nginx or apache calls node in HTTP (due to proxy configuration) Set this to ``true`` to force ``https`` protocol.
 */
exports.dump_curl = (output_fname, force_https = false) => (req, res, next) => _dump_curl(output_fname, force_https, req, res, next);
exports.dump_restest = (output_fname, force_https = false) => (req, res, next) => _dump_restest(output_fname, force_https, req, res, next);
//# sourceMappingURL=index.js.map