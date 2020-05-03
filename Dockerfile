FROM alpine:latest
RUN apk add bash
RUN apk add nano
RUN apk add nodejs
RUN apk add npm

RUN useradd -ms /bin/bash nodeuser
USER nodeuser

RUN mkdir /home/nodeuser/.config
RUN mkdir /home/nodeuser/.config/personal
COPY ~/.config/personal/spotify_browser_token_server.json /home/nodeuser/.config/personal/spotify_browser_token_server.json

COPY node_app /home/nodeuser/node_app
WORKDIR /home/nodeuser/node_app
RUN npm install --save

ENTRYPOINT [ "node" , "/home/nodeuser/node_app/main.js" ]