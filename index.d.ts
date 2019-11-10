import { Request, NextFunction, Response } from "express-serve-static-core";
export declare const curl_str: (force_https: boolean, req: Request<import("express-serve-static-core").ParamsDictionary>) => string;
export declare const dump_curl: (output_fname: any, force_https?: boolean) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => void;
export declare const dump_restest: (output_fname: any, force_https?: boolean) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => void;
