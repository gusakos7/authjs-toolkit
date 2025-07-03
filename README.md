## Postgres Docker Command

docker run --rm --name my-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=admin -d -p 5432:5432 postgres:16

## Prisma commands

1. For initialization, only the first time.

```bash
npx prisma init
```

2. To generate the Prisma adapter, after changes to the schema.

```bash
npx prisma generate
```

3. To push the changes to the db.

```bash
npx prisma db push
```

4. For hard reset.

```bash
npx prisma migrate reset
```

5. For Studio.

```bash
npx prisma studio
```
