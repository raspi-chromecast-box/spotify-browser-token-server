# Spotify Browser Token Server

## On Host VPS

#### nano basic config file into
```
~/.config/personal/spotify_browser_token_server.json
```
```
{
    "express": {
        "host": 127.0.0.1 ,
        "port": 9898
    } ,
    "spotify": {
        "username": "" ,
        "password": ""
    }
}
```
```
chmod 777 ~/.config/personal/spotify_browser_token_server.json
```

## Build Docker Container

```
sudo docker build -t spotify-browser-token-server .
```

## Run Docker Container

```
sudo docker rm -f spotify-browser-token-server
sudo docker run -dit --restart='always' \
--user pptruser \
--name 'spotify-browser-token-server' \
-v ~/.config/personal/spotify_browser_token_server.json:/home/pptruser/.config/personal/spotify_browser_token_server.json:rw \
-p 9898:9898 \
spotify-browser-token-server
```