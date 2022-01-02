# Social media app

A basic social media app, build using [NuxtJS](https://nuxtjs.org/), and [Express](https://expressjs.com/).

## Features

- Register / Login
- Forgot Password
- Email verification

- Create post
- Edit post
- Delete post
- Like post
- Comment on post

## Setup

Sample accounts:

```
spencer@spencer.com:spencer
juan@juan.com:juan
```

1. Clone the repo

```bash
git clone https://github.com/spencerversteeg/social-media.git
```

2. Setup the client

```bash
# Note, this command is executed from the project root
cd client/ && yarn
```

3. Setup the server

```bash
# Note, this command is executed from the project root
cd server/ && yarn
```

4. After server packages have been installed, seed the database with some dummy data.

```bash
# Note, this command is executed from the server directory.
npx prisma migrate dev

> Enter a name for the new migration: [enter your name here]

```

## Running the project

- Run the client:

```bash
cd client/ && yarn dev
```

- Run the server

```bash
docker-compose up
[OR]
yarn dev
```
