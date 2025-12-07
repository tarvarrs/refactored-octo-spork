# Stage 1: Сборка (Build)
FROM node:18-alpine as builder

WORKDIR /app

# Копируем только package.json для кэширования зависимостей
COPY package*.json ./
RUN npm install

# Копируем весь проект и билдим
COPY . .
RUN npm run build

# Stage 2: Раздача (Nginx)
FROM nginx:alpine

# Удаляем дефолтную страницу nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранные файлы из предыдущего этапа
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем конфиг nginx (создадим его ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
