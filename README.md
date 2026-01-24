<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Reconstuir la base de datos
```
http://localhost:3000/api/v2/seed

#Produccion build
1. Crear el archivo .env.prod
2. Llenar las variables de entorno de .env.prod
3. Crear la nueva imagen
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build 

Nota: se usa este comamando para ejecutar el docker-compose.prod.yaml, que servira para montar el contendor de las imagenes de docker de el dist y la base de datos
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build 

Nota: si ya se instalo, para levantar nuevamente usar 
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up

## Stack Usado
* NestJS
* MongoDB
* Docker
