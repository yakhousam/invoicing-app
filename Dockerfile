# Adjusted Dockerfile paths for new context
FROM node:20-alpine as build

WORKDIR /app

# Assuming Dockerfile is now in the project root, adjust paths accordingly
COPY ./client/package*.json ./

RUN npm install

COPY ./client/ ./

COPY ./server/src/validation ./src/validations

RUN npm run build

FROM nginx:stable-alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]