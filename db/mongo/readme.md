# create mongo replica set on kub

### create the pods:
`kubectl create -f .`

### connect to the first pod to make it master
`kubectl exec -it mongo-0 -- mongo`

### initiate replica set ### make first the master (host: {podName}.{serviceName}:{port})
rs.initiate()
var cfg = rs.conf()
cfg.members[0].host = "mongo-0.mongo:27017"
rs.reconfig(cfg)
rs.add("mongo-1.mongo:27017")
rs.add("mongo-2.mongo:27017")
rs.status()

### access url to access this replica set:
`mongodb://mongo-0.mongo:27017,mongo-1.mongo:27017,mongo-2.mongo:27017/?replicaSet=rs0`

### to scale it:
`kubectl scale sts mongo --replicas 4`
`kubectl exec -it mongo-0 -- mongo`
`rs.add("mongo-3.mongo:27017")`


### reset config
`rs.reconfig(rs.config(),{force:true})`

### delete replica
`kubectl delete statefulset mongo`
`kubectl delete svc mongo`