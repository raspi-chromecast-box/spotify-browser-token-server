#!/bin/bash
sudo docker run -dit --restart='always' \
--name 'spotify-browser-token-server' \
#-v ~/.config/personal/raspi_chromecast_box.json:/home/.config/personal/raspi_chromecast_box.json \
--network host \
spotify-browser-token-server