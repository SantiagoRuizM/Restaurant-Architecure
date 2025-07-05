# Etapa única, solo Nginx
FROM nginx:1.25-alpine

ARG BACKEND_URL
WORKDIR /usr/share/nginx/html

# Copiamos los estáticos
COPY static/ .

# Sustituimos el marcador por la URL real del backend
RUN sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" app.js

RUN sed -i 's/listen[[:space:]]\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Development stage
FROM base AS dev
ENV ENVIRONMENT=dev

# QA stage
FROM base AS qa
ENV ENVIRONMENT=qa

# Production stage
FROM base AS prod
ENV ENVIRONMENT=prod


EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]



