# FROM node:11-alpine

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# COPY . .

# RUN npm install

# EXPOSE 3000

# CMD ["npm", "run", "start"]

FROM node:9-slim
 
# WORKDIR specifies the application directory
WORKDIR /app
 
# Copying package.json file to the app directory
COPY package.json /app
 
# Installing npm for DOCKER
RUN npm install
 
# Copying rest of the application to app directory
COPY . /app
 
# Starting the application using npm start
CMD ["npm","start"]do