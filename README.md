# Spotify Browser Token Server

## Spotify seems to 'know' via the reCAPTCHA service, if you try to login via Docker , so just generate cookies

## 1.) On Normal 'Non-Docker' Computer , Run

```
node generateConfigFileWithLoginCookies.js
```

## 2.) Copy JSON
```
cat spotify_browser_token_server.json
```

## 3.) On Host Docker Machine ( raspberry pi ) , paste JSON into file
```
nano  ~/.config/personal/spotify_browser_token_server.json
```

```
chmod 777 ~/.config/personal/spotify_browser_token_server.json
```

## 4.) Build Docker Container

```
sudo docker build -t spotify-browser-token-server .
```

## 5.) Run Docker Container

```
sudo docker run -dit --restart='always' \
--user pptruser \
--name 'spotify-browser-token-server' \
-v ~/.config/personal/spotify_browser_token_server.json:/home/pptruser/.config/personal/spotify_browser_token_server.json:rw \
-p 9898:9898 \
spotify-browser-token-server
```

## 6.) Refresh Token

```
curl http://127.0.0.1:9898/refresh
```