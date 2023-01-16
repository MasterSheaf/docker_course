FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret
ENV MONGODB_HOST_URL=mongodb
# use mongodb here because we assume locally running docker run 
# or through docker compose, when we use this image on AWS ECS
# make sure to override these three variables specifically
# in the setup and set the MONGODB_HOST_URL to localhost
# and run the mongodb container and this backend container in the same 
# task 

CMD ["npm", "start"]