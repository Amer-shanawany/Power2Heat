 #👿  

FROM node:9-slim
WORKDIR /app
ENV PORT=80
COPY package.json /app
RUN npm install 
COPY . /app
EXPOSE 80
CMD [ "npm" ,"start"]


