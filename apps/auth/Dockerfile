FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build:auth

CMD ["npm", "run", "start:prod:auth"]