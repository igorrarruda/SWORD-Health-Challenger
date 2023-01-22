# Task Manager

Task Manager is a ExpressJS project for maintenance tasks performed during a
working day.

## Dependences
 * NodeJS 19
 * ExpressJS
 * TypeScript
 * MySQL 5.7
 * Nginx
 * Docker
 * RabbitMQ

Prerequisites
-----

I assume you have installed Docker and it is running.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

Build
-----

Steps to build a Docker image:

1. Clone this repo

        git clone git@github.com:igorrarruda/SWORD-Health-Challenger.git

2. Create `.env` by `.env.sample`

3. Run docker compose

        docker compose up

    This will take a few minutes.

5. Once everything has started up, you should be able to access the webapp via [http://localhost/](http://localhost/) on your host machine.

        open http://localhost/

## Run tests

    npm test

# REST API

The REST API to the app is described below.

## Register new User

### Request

`POST /signup/`

    curl --request POST \
         --url http://localhost/signup \
         --header 'Content-Type: application/json' \
         --data '{
	         "name": "João",
	         "email": "joao@task.com",
	         "password": "123456",
	         "role": 2
           }'

### Response

    HTTP/1.1 201 Created
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 201 Created
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 177

    {"name":"João","email":"joao@task.com","password":"$2b$10$./CJ1R54gB6vrfF5lgbkiuzRzUBXgk0h6VmrmLtEayNvjP2g1AM9S","role":{"id":2},"id":"417b7eef-9c56-4511-b705-236216e87427"}

## Login

### Request

`POST /login/`

    curl --request POST \
         --url http://localhost/login \
         --header 'Content-Type: application/json' \
         --data '{
	         "email": "joao@task.com",
	         "password": "123456",
           }'

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 0
    Set-Cookie: Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwN2EzNTBmLTljYzctNGI1OS1iZjcwLWY4MWQzMWQxOTkzMiIsImlhdCI6MTY3NDM2NjYwOSwiZXhwIjoxNjc0MzcwMjA5fQ.RGtBbX0TuX1pzkirwtizu6iaQyFs6iuWwM688AsjxLM; HttpOnly; Max-Age=3600;

## Logout

### Request

`POST /logout/`

    curl --request POST \
         --url http://localhost/logout \
         --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwN2EzNTBmLTljYzctNGI1OS1iZjcwLWY4MWQzMWQxOTkzMiIsImlhdCI6MTY3NDM2NjYwOSwiZXhwIjoxNjc0MzcwMjA5fQ.RGtBbX0TuX1pzkirwtizu6iaQyFs6iuWwM688AsjxLM' \

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 87
    Set-Cookie: Authorization=; Max-age=0

    {"id":"417b7eef-9c56-4511-b705-236216e87427","name":"João 6","email":"joao6@task.com"}

## Create Task

### Request

`POST /tasks/`

    curl --request POST \
      --url http://localhost/tasks \
      --header 'Content-Type: application/json' \
      --data '{
      "summary":"new task"
    }'

### Response

    HTTP/1.1 201 Created
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 201 Created
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 315

    {"summary":"new task","user":{"id":"4b2d2618-d6ed-4c91-8f02-e158abd844a7","name":"José","email":"jose@task.com","role":{"id":2,"name":"Technician"}},"finishedDate":null,"deletedDate":null,"id":"400131e4-576c-4b82-8c6c-96480b577c5f","createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:31:00.801Z"}

## Get list of Tasks

### Request

`GET /tasks/`

    curl --request GET \
      --url http://localhost/tasks

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 284

    [{"id":"400131e4-576c-4b82-8c6c-96480b577c5f","summary":"new task","finishedDate":null,"createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:31:00.801Z","deletedDate":null,"user":{"id":"4b2d2618-d6ed-4c91-8f02-e158abd844a7","name":"José","email":"jose@task.com"}}]

## Get Tasks by ID

### Request

`GET /tasks/:taskId`

    curl --request GET \
      --url http://localhost/tasks/400131e4-576c-4b82-8c6c-96480b577c5f

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 284

    {"id":"400131e4-576c-4b82-8c6c-96480b577c5f","summary":"new task","finishedDate":null,"createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:31:00.801Z","deletedDate":null,"user":{"id":"4b2d2618-d6ed-4c91-8f02-e158abd844a7","name":"José","email":"jose@task.com"}}

## Update Task

### Request

`PUT /tasks/:taskId`

    curl --request PUT \
      --url http://localhost/tasks/400131e4-576c-4b82-8c6c-96480b577c5f \
      --header 'Content-Type: application/json' \
      --data '{
      "summary":"new task updated"
    }'

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 195

    {"id":"400131e4-576c-4b82-8c6c-96480b577c5f","summary":"new task updated","finishedDate":null,"createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:36:30.000Z","deletedDate":null}

## Finish Task

### Request

`PATCH /tasks/:taskId`

    curl --request PATCH \
      --url http://localhost/tasks/400131e4-576c-4b82-8c6c-96480b577c5f

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 309

    {"id":"400131e4-576c-4b82-8c6c-96480b577c5f","summary":"new task updated","finishedDate":"2023-01-22T06:37:46.000Z","createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:37:46.000Z","deletedDate":null,"user":{"id":"4b2d2618-d6ed-4c91-8f02-e158abd844a7","name":"José","email":"jose@task.com"}}

# Delete Task

### Request

`DELETE /tasks/:taskId`

    curl --request DELETE \
      --url http://localhost/tasks/400131e4-576c-4b82-8c6c-96480b577c5f

### Response

    HTTP/1.1 200 OK
    Date: Thu, 23 Jan 2023 12:36:30 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 239

    {"id":"400131e4-576c-4b82-8c6c-96480b577c5f","summary":"new task updated","finishedDate":"2023-01-22T06:37:46.000Z","createdDate":"2023-01-22T06:31:00.801Z","updatedDate":"2023-01-22T06:39:11.000Z","deletedDate":"2023-01-22T06:39:11.000Z"}

## License

[MIT](https://choosealicense.com/licenses/mit/)
