import { Request, NextFunction, Response } from "express-serve-static-core";
export declare const curl_str: (force_https: boolean, req: Request<import("express-serve-static-core").ParamsDictionary>) => string;
/**
 *	dump_curl ( output_fname: string, force_https: boolean = false )
 *
 *  @param output_fname - The full path where the curl will be written. If it is null or '', the curl will be printed on stdout
 *  @param force_https  - Sometimes, external endpoints are in HTTPS, but nginx or apache calls node in HTTP (due to proxy configuration) Set this to ``true`` to force ``https`` protocol.
 */
export declare const dump_curl: (output_fname: string, force_https?: boolean) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => void;
export declare const dump_restest: (output_fname: string, force_https?: boolean) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => void;
