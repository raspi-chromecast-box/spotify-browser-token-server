const process = require( "process" );
const http = require( "http" )
const ip = require( "ip" );
const path = require( "path" );
const JFODB = require( "jsonfile-obj-db" );

process.on( "unhandledRejection" , function( reason , p ) {
	console.error( reason, "Unhandled Rejection at Promise" , p );
	console.trace();
	process.exit( 1 );
});
process.on( "uncaughtException" , function( err ) {
	console.error( err , "Uncaught Exception thrown" );
	console.trace();
	process.exit( 1 );
});

( async ()=> {

	//const config = require( path.join( process.env.HOME , ".config" , "personal" , "spotify_browser_token_server.json" ) );
	const db = new JFODB( path.join( process.env.HOME , ".config" , "personal" , "spotify_browser_token_server.json" ) );
	module.exports.db = db;

	// await require( "./utils.js" ).store_config_to_redis( config );
	const port = db.self.config.express.port || 9898;
	const express_app = require( "./express_app.js" );

	const server = http.createServer( express_app );
	server.listen( port , () => {
		const localIP = ip.address();
		console.log( "\tServer Started on :" );
		console.log( "\thttp://" + localIP + ":" + port );
		console.log( "\t\t or" );
		console.log( "\thttp://localhost:" + port );
	});

	process.on( "SIGINT" , async function () {
		process.exit( 1 );
	});

})();