FROM node:10

RUN mkdir -p /home/app

COPY ./app /home/app

CMD ["npm","start"]