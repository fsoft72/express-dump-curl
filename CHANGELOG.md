## Changelog

0.5.0 - TypeScript port
  - **ADD**: rewritten in TypeScript
  - **ADD**: ``curl_str ()`` method to obtain the curl as a string
  - **CHANGE**: now there no default function exported anymore. Please, fix your ``import``s!!


0.3.0 - RESTest support landed!
  - **ADD**: support for RESTest file format (partial)
  - **ADD**: new exported function ``dump_restest ()``  (defaults is always dump_curl)
  - **ADD**: new ``_safe ()`` function to output objects and strings with double quotes correctly
  - **FIX**: now CURL exports the application/json requests correctly

0.2.0 - **FIX**: Fixed a very nasty bug that used to mangle form data in multipart form submissions.

0.1.1 - **FIX**: Fixed a small typo

0.1.0 - Initial release
