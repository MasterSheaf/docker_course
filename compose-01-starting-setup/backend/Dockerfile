FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# I don't like putting this info in the docker file 
# so I'll do it on the command line for the container when I start it up
# ENV MONGODB_USERNAME=root
# ENV MONGODB_PASSWORD=secret

CMD ["npm", "start"]