<br/>
<div id="logo" align="center">
    <br />
    <img src="docs/.vuepress/public/logo.svg" alt="Battleship2 Logo" width="300"/>
    <h3>Battleship Game</h3>
    <p>A real-time multiplayer battleship game</p>
</div>

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installing](#installing)
    -   [Customizing](#customizing)
-   [Deployment](#deployment)
-   [Built With](#built-with)

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See
[deployment](#deployment) for notes on how to deploy the project on a live
system.

### Prerequisites

You will need Redis and Node.js with npm installed on your machine to get
started (visit https://redis.io/download and https://nodejs.org to
install Redis and Node.js with npm).

### Installing

A step by step series of examples that tell you how to get a development
environment running:

Clone the git repository

```bash
git clone https://github.com/riishabhraj/destroyer2.git
cd destroyer2
```

And install npm dependencies

```bash
npm install
```

Finally, start the Redis server in a different shell.
You may optionally specify a Redis configuration file as argument to
`redis-server`

```bash
cd path/to/destroyer2/db/
redis-server
# If you have a redis configuration file, instead run:
# redis-server redis.conf
```

Back in the first shell, start the webserver:

```bash
npm run debug
```

Navigate to http://localhost:8080 to get started!

### Customizing

You can customize the project by adding a `.env` file in the root of the project
and a Redis configuration file in the `db/` folder. Make sure to specify the
Redis configuration file when starting the Redis server.

See the example [.env configuration](./.env.example) file and the customizing

## Deployment

Set a database password in the [.env ](./.env.example) file and in the
[redis.conf](./db/redis.conf) file. See the deployment guide for more infos and
detailed instructions:

Deploy the app to a free Heroku instance:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Built With

-   [Node.js](https://nodejs.org/) - The server backend
-   [express](https://expressjs.com/) - The web server
-   [Redis](https://redis.io/) - The database
-   [node_redis](https://github.com/NodeRedis/node_redis) - The Redis
    client for Node.js
-   [ws](https://github.com/websockets/ws) - The WebSocket server
