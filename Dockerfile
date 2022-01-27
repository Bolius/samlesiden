# pull official base image
#FROM node:14.17.0-alpine

# set working directory
#WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
#COPY package.json ./
#COPY yarn.lock ./
#RUN yarn install
#RUN yarn global add react-scripts@3.4.1

#EXPOSE 8080

# add app
#COPY . ./

# start app
#CMD ["yarn", "start"]

#-----------

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY ./setup /etc/nginx/conf.d/
COPY ./build /usr/share/nginx/html/

EXPOSE 80
EXPOSE 443

