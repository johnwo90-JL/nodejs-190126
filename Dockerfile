FROM docker.io/library/node:latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm production packages 
RUN npm install --production

COPY . /opt/app-root/src

ENV NODE_ENV production
ENV PORT 3000
ENV DB_DIALECT "sqlite"
ENV DB_STORAGE "./data/database.sqlite"
ENV JWT_SECRET "supersecret"
ENV JWT_ACCESS_TOKEN_EXPIRES_IN "30m"
ENV JWT_REFRESH_TOKEN_EXPIRES_IN "7d"
ENV HOST "0.0.0.0"
ENV CUSTOMER "uuid---"

EXPOSE 3000

RUN mkdir /opt/app-root/src/logs

WORKDIR /opt/app-root/src
RUN npm run db:seed

CMD ["npm", "start"]