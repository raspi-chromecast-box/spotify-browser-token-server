#!/bin/bash
sudo docker run -it \
--name 'alpine-web-server' \
-v ~/.config/personal/raspi_chromecast_box.json:/home/.config/personal/raspi_chromecast_box.json \
--network host \
alpine-web-server