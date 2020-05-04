const process = require( "process" );
const fs = require( "fs" );
const path = require( "path" );
const global_package_path = process.argv[ 0 ].split( "/bin/node" )[ 0 ] + "/lib/node_modules";
const puppeteer = require( path.join( global_package_path ,  "puppeteer" ) );

const SPOTIFY_USERNAME = "";
const SPOTIFY_PASSWORD = "";

( async ()=> {
	const browser = await puppeteer.launch( { headless: true } );
	const page = await browser.newPage();
	await page.setViewport( { width: 1200 , height: 720 } )
	await page.goto( "https://accounts.spotify.com/en/login?continue=https:%2F%2Fopen.spotify.com%2F" , { waitUntil: "networkidle0" } );
	await page.type( "#login-username" , SPOTIFY_USERNAME );
	await page.type( "#login-password" , SPOTIFY_PASSWORD );
	await page.click( "#login-button" );
	await page.waitForNavigation( { waitUntil: "networkidle0" } );
	const local_storage_clone = await page.evaluate( () => {
		return localStorage;
	});
	const cookies_clone = await page.cookies();
	let token_info = await page.evaluate( () => {
		const token_script = document.getElementById( "config" );
		const token_json = token_script.text.trim();
		const token_info = JSON.parse( token_json );
		return token_info;
	});
	await browser.close();
	console.log( token_info );
	console.log( token_info[ "accessToken" ] );
	console.log( token_info[ "accessTokenExpirationTimestampMs" ] );
	token_info[ "expire_time" ] = Math.floor( token_info[ "accessTokenExpirationTimestampMs" ] /  1000 );
	token_info[ "seconds_left" ] = ( token_info[ "expire_time" ] - Math.floor( new Date().getTime() / 1000 ) );
	const json_out_obj = {
		"config": {
			"express": {
				"host": "127.0.0.1" ,
				"port": 9898
			}
		} ,
		"spotify": {
			"username": SPOTIFY_USERNAME ,
			"password": SPOTIFY_PASSWORD
		} ,
		"cookies": cookies_clone ,
		"token_info": token_info
	};
	fs.writeFileSync( 'spotify_browser_token_server.json' , JSON.stringify( json_out_obj ) );
})();

