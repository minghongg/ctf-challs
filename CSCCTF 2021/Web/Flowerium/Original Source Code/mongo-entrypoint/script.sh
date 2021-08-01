#!/usr/bin/env bash
echo "Creating mongo users..."
mongo admin --host localhost -u root -p SpRn3yUVe6ELY96UAA8MfdF --eval "db.createUser({user: 'chevaliers', pwd: 'jQVQgEOwI039Hc2jg3RPF8a', roles: [{role: 'readWrite', db: 'flowerium'}]});"

# mongo --host localhost -u chevaliers -p jQVQgEOwI039Hc2jg3RPF8a init.js

echo "Mongo users created."