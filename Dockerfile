FROM node:10

RUN mkdir -p /home/app

RUN npm install

COPY ./app /home/app

EXPOSE 3690

CMD ["npm","start"]
