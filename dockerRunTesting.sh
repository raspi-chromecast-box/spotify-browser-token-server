#!/bin/bash
sudo docker rm -f spotify-browser-token-server
sudo docker run -it \
--user pptruser \
--name 'spotify-browser-token-server' \
-v ~/.config/personal/spotify_browser_token_server.json:/home/pptruser/.config/personal/spotify_browser_token_server.json:rw \
-p 9898:9898 \
spotify-browser-token-server