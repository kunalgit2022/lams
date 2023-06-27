FROM node:16-alpine AS build
WORKDIR /usr/share/nginx/html/
COPY . .
RUN npm install
RUN npm run buil
CMD ["node","lams.js"]
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /dist/ /usr/share/nginx/html
EXPOSE 80
