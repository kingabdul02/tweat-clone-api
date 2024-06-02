## Installation

```bash
$ npm install
```

## Running the app

```bash
# setup prisma
$ npx prisma init
```

```
# Update the DATABASE_URL in your .env file to point to your database. For example:
  DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

  or

  DATABASE_URL="mysql://root@localhost:3306/tweat_db"
```

```bash
# Run Prisma Migrate
$ npx prisma migrate dev --name init
```

```bash
# start project (development)
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
