const express = require( "express" );
const path = require( "path" );
const bodyParser = require( "body-parser" );
//const cors = require( "cors" );
const ejs = require( "ejs" );

const refresh = require( "./refresh.js" );

const app = express();
// const server = require( "http" ).createServer( app );
// const port = process.env.PORT || 6969;

// View Engine Setup
app.set( "views" , path.join( __dirname , "public" , "views" ) );
app.set( "view engine" , "ejs" );
app.engine( "html" , ejs.renderFile );

// Set Static Folder
//app.use( express.static( path.join( __dirname , "public"  ) ) );

// Setup Middleware
//app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

// Cross-Origin Stuff
// app.use( cors() );
//
// const whitelist = [ "http://localhost:6969/youtubeAuth" ,  "https://accounts.google.com" , "https://google.com" ];
// const corsOptions = {
//   origin: "*" ,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE" ,
//   preflightContinue: true ,
//   optionsSuccessStatus: 204 ,

// }
// // app.use(function(req, res, next) {
// //   res.header("Access-Control-Allow-Origin", "*");
// //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// //   next();
// // });
// app.get( "/youtubeAuth" , cors( corsOptions ) , function( req , res , next ) {
//     res.render( "youtubeAuth.html" );
// });

// Main-Routes
app.get( "/" , ( req , res , next ) => {
	res.send( "You Found the Spotify Browser Token Server" );
});

app.get( "/ping" , ( req , res , next ) => {
	res.send( "pong" );
});

app.get( "/refresh" , async ( req , res , next ) => {
	const refreshed_token = await refresh();
	res.json( { "token": refreshed_token } );
});

module.exports = app;