 #👿  

FROM node:9-slim
WORKDIR /app
ENV PORT=8080
COPY package.json /app
RUN npm install 
COPY . /app
EXPOSE 8080
CMD [ "npm" ,"start"]


