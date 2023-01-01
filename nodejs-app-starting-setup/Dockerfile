FROM node 

WORKDIR /app

# start with package.json so that npm install will have only what it needs
# this will save time building the image 
COPY package.json /app

# run this when we create the image to get the right stuff installed
RUN npm install

# copy everything else
COPY . /app

# optional - it doesn't do anything we need to run the container with the port flag -p
EXPOSE 5150

# cmd is what we do to run something when we create a container from an image
CMD ["node", "server.js"]

