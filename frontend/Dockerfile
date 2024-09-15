ARG BUILD_ENV="development"
FROM debian:latest as base

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV NODE_MAJOR=18

ENV CLIENT_ROOT "/src/app"

# Install system requirements
RUN apt-get update && apt-get install -y \
    curl ca-certificates gnupg && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y

RUN npm install --global npm yarn

WORKDIR ${CLIENT_ROOT}

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Set environment variable for Next.js
ENV NODE_ENV=development

# Expose the port
EXPOSE 3000

CMD ["yarn", "dev"]
