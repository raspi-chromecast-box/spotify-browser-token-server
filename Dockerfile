FROM alpine:latest
RUN apk add bash
RUN apk add nano

# https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-on-alpine
RUN apk add --no-cache \
chromium \
nss \
freetype \
freetype-dev \
harfbuzz \
ca-certificates \
ttf-freefont \
nodejs \
yarn \
npm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn add puppeteer@1.19.0

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
	&& mkdir -p /home/pptruser/Downloads \
	&& mkdir -p /home/pptruser/.config \
	&& mkdir -p /home/pptruser/.config/personal \
	&& chown -R pptruser:pptruser /home/pptruser \
	&& chown -R pptruser:pptruser /home/pptruser/.config \
	&& chown -R pptruser:pptruser /home/pptruser/.config/personal

#RUN addgroup node
#RUN adduser -s /bin/bash -h /home/nodeuser -D --uid 33333 --ingroup "node" nodeuser
USER pptruser

#RUN mkdir /home/pptruser/.config
#RUN mkdir /home/pptruser/.config/personal

COPY --chown=pptruser:pptruser node_app /home/pptruser/node_app
WORKDIR /home/pptruser/node_app
RUN npm install --save

EXPOSE 9898

ENTRYPOINT [ "node" , "/home/pptruser/node_app/main.js" ]