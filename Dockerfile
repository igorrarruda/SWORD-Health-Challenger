FROM node:19-alpine AS default

WORKDIR /app

COPY . /app
# Install bash to use 'wait-for-it'
RUN apk update && apk add bash && apk add --no-cache coreutils

RUN chmod +x /app/wait-for-it.sh

RUN npm install

EXPOSE 8000

FROM default AS development

WORKDIR /app

ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

FROM default AS production

ENV NODE_ENV production

CMD ["npm", "run", "start"]
