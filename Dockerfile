#FROM 478770442848.dkr.ecr.ap-northeast-1.amazonaws.com/bv-prod-node-docker
# FROM node:14 as build
ARG AWS_ACCOUNT_ID=478770442848
ARG AWS_DEFAULT_REGION=us-west-2
FROM ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/bv-node-14:latest as nodework
RUN node -v
RUN mkdir -p /usr/app
WORKDIR /usr/app/
COPY . .
RUN npm install 
RUN npm run build

# node run 
# RUN npm i -g serve@13.0.2
# EXPOSE 3000
# ENTRYPOINT ["serve", "-s", "build"]

# nginx run
# FROM nginx:1.23-alpine
FROM ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/bv-nginx:latest
WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=nodework /usr/app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


#FROM nginx:1.13.12-alpine
#COPY --from=build /usr/app/build /usr/share/nginx/html
#EXPOSE 80
#ENTRYPOINT ["nginx", "-g", "daemon off;"]