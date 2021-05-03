#!/bin/bash
until mongo --host mongo-db-1:27017 --eval "print(\"waited for connection\")"
do
    printf 'wating for mongo-db-1'
    sleep 1
done
until mongo --host mongo-db-2:27017 --eval "print(\"waited for connection\")"
do
    printf 'wating for mongo-db-2'
    sleep 1
done
until mongo --host mongo-db-3:27017 --eval "print(\"waited for connection\")"
do
    printf 'wating for mongo-db-3'
    sleep 1
done

printf 'done waiting start config'

mongo --host mongo-db-1:27017 <<EOF
var cfg = {
    "_id" : "rs0",
    "members" : [
        {
            "_id" : 0,
            "host" : "mongo-db-1:27017",
            priority: 1
        },
        {
            "_id" : 1,
            "host" : "mongo-db-2:27017",
            priority: 0.5
        },
        {
            "_id" : 2,
            "host" : "mongo-db-3:27017",
            priority: 0.5
        }
    ]
};
rs.initiate(cfg, { force: true });
EOF
