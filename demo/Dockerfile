FROM nginx

WORKDIR /usr/share/nginx/html
COPY . .

ENTRYPOINT [ "bash", "docker-entrypoint.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]