To run this repo locally,

1. Install postgres locally
2. run `db.sql` with a database and user of your choice `psql -d dbname  -U username < db.sql`
3. create a .env with these values

```
ENVIRONMENT=local

DB_PASSWORD_LOCAL=password_for_username
DB_USERNAME_LOCAL=username
DB_HOST_LOCAL=localhost
DB_PORT_LOCAL=5432
DB_DATABASE_LOCAL=dbname

```
