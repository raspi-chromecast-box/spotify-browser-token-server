const puppeteer = require( "puppeteer" );

const db = require( "./main.js" ).db;

function are_cookies_still_valid() {
	if ( !!db.self[ "cookies" ] ) {
		const now = new Date().getTime();
		for ( let i = 0; i < db.self[ "cookies" ].length; ++i ) {
			if ( !!db.self[ "cookies" ][ "expires" ] ) {
				if ( ( db.self[ "cookies" ][ "expires" ][ i ] - now ) < 3 ) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}

function fresh_login_and_get_token_info() {
	return new Promise( async ( resolve , reject ) => {
		try {
			const browser = await puppeteer.launch({
				headless: true ,
				args: [ '--disable-dev-shm-usage' , '--no-sandbox' ] ,
			});
			const page = await browser.newPage();
			await page.setViewport( { width: 1200 , height: 720 } )
			await page.goto( "https://accounts.spotify.com/en/login?continue=https:%2F%2Fopen.spotify.com%2F" , { waitUntil: "networkidle0" } );
			await page.type( "#login-username" , db.self[ "spotify" ][ "username" ] );
			await page.type( "#login-password" , db.self[ "spotify" ][ "password" ] );
			await page.click( "#login-button" );
			await page.waitForNavigation( { waitUntil: "networkidle0" } );
			const local_storage_clone = await page.evaluate( () => {
				return localStorage;
			});
			const cookies_clone = await page.cookies();
			const token_info = await page.evaluate( () => {
				const token_script = document.getElementById( "config" );
				const token_json = token_script.text.trim();
				const token_info = JSON.parse( token_json );
				return token_info;
			});
			await browser.close();
			db.self[ "local_storage" ] = local_storage_clone;
			db.self[ "cookies" ] = cookies_clone;
			db.self[ "token_info" ] = token_info;
			db.self[ "token_info" ][ "expire_time" ] = Math.floor( token_info[ "accessTokenExpirationTimestampMs" ] /  1000 );
			db.self[ "token_info" ][ "seconds_left" ] = ( db.self[ "token_info" ][ "expire_time" ] - Math.floor( new Date().getTime() / 1000 ) );
			db.save();
			resolve( token_info );
			return;
		}
		catch( error ) { console.log( error ); resolve( false ); return; }
	});
}

function cookie_login_and_get_token_info() {
	return new Promise( async ( resolve , reject ) => {
		try {
			const browser = await puppeteer.launch({
				headless: true ,
				args: [ '--disable-dev-shm-usage' , '--no-sandbox' ] ,
			});
			const page = await browser.newPage();
			await page.setViewport( { width: 1200 , height: 720 } )
			for ( let cookie of db.self[ "cookies" ] ) {
				await page.setCookie( cookie );
			}
			await page.goto( "https://open.spotify.com" , { waitUntil: "networkidle0" } );
			const local_storage_clone = await page.evaluate( () => {
				return localStorage;
			});
			const cookies_clone = await page.cookies();
			const token_info = await page.evaluate( () => {
				const token_script = document.getElementById( "config" );
				const token_json = token_script.text.trim();
				const token_info = JSON.parse( token_json );
				return token_info;
			});
			await browser.close();
			db.self[ "local_storage" ] = local_storage_clone;
			db.self[ "cookies" ] = cookies_clone;
			db.self[ "token_info" ] = token_info;
			db.self[ "token_info" ][ "expire_time" ] = Math.floor( token_info[ "accessTokenExpirationTimestampMs" ] /  1000 );
			db.self[ "token_info" ][ "seconds_left" ] = ( db.self[ "token_info" ][ "expire_time" ] - Math.floor( new Date().getTime() / 1000 ) );
			db.save();
			resolve( token_info );
			return;
		}
		catch( error ) { console.log( error ); resolve( false ); return; }
	});
}

function generate() {
	return new Promise( async ( resolve , reject ) => {
		try {
			if ( are_cookies_still_valid() ) {
				console.log( "Cookies are Still Valid , Reusing" );
				const result = await cookie_login_and_get_token_info();
				resolve( result );
				return;
			}
			console.log( "Cookies have Expired , Re-Logging-In" );
			const result = await fresh_login_and_get_token_info();
			resolve( result );
			return;
		}
		catch( error ) { console.log( error ); resolve( false ); return; }
	});
}

function refresh() {
	return new Promise( async ( resolve , reject ) => {
		try {
			if ( !db.self[ "token_info" ] ) {
				console.log( "Token Info Is Empty, Refreshing" );
				const result = await generate();
				resolve( result );
				return;
			}
			if ( !db.self[ "token_info" ][ "seconds_left" ] ) {
				console.log( "Token Info Empty, Refreshing" );
				const result = await generate();
				resolve( result );
				return;
			}
			db.self[ "token_info" ][ "seconds_left" ] = ( db.self[ "token_info" ][ "expire_time" ] - Math.floor( new Date().getTime() / 1000 ) );
			db.save();
			if ( db.self[ "token_info" ][ "seconds_left" ] < 300 ) {
				console.log( "Spotify Token is About to Expire in " + db.self[ "token_info" ][ "seconds_left" ].toString() + " Seconds" );
				const result = await generate();
				resolve( result );
				return;
			}
			console.log( "Spotify Token is Still Valid for " + db.self[ "token_info" ][ "seconds_left" ].toString() + " Seconds" );
			resolve( db.self[ "token_info" ] );
			return;
			setTimeout( () => {
				resolve( false );
				return;
			} , 40000 );
		}
		catch( error ) { console.log( error ); resolve( false ); return; }
	});
}

module.exports = refresh;