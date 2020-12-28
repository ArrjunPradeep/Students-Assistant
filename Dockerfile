FROM node:10

WORKDIR /home/app   

RUN mkdir -p /home/app

COPY /app /home/app/

EXPOSE 3690

CMD ["npm","start"]