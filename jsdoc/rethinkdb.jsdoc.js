/**
Options for connect.
@typedef RethinkDBConnectOptions
@property {string} host     - the host to connect to (default localhost).
@property {number} port     - the port to connect on (default 28015).
@property {string} db       - the default database (default test).
@property {string} user     - the user account to connect as (default admin).
@property {string} password - the password for the user account to connect as (default '', empty).
@property {number} timeout  - timeout period in seconds for the connection to be opened (default 20).
@property {string} ssl      - a hash of options to support SSL connections (default null). Currently, there is only one option available, and if the ssl option is specified, this key is required:
@property {string} ssl      .ca - a list of Node.js Buffer objects containing SSL CA certificates.
*/
