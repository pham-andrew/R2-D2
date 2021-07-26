# WELCOME TO YOUR NEW MANIFESTS

## Access
Your staging url is https://sdi05-05.staging.dso.mil

## What is this?
This project is the source of truth for your application in production.  It is instantiated as a bare bones guess at what your app needs to deploy.  It should serve to get your app 95% of the way there, with individual fixes needed for this specific app. 

You should see a few folders
- base : The cluster agnostic k8s resources for your application.
- il2  : The il2 cluster agnostic k8s resources for your application.

* If you have a postgres database, these are the resources injected to mission-bootstrap project to instantiate your apps database. It will create a psql database called sdi05_05_db with the following users and passwords loaded to the respective env variable in the container that connects to the database:
    - PGHOST
    - PGPORT
    - PG_DATABASE
    - PG_USER       (Pass Var: APP_DB_ADMIN_PASSWORD)
    - PG_RW_USER    (Pass Var: APP_DB_RW_PASSWORD)
    - PG_RO_USER    (Pass Var: APP_DB_RO_PASSWORD)
* If you have a MySQL database, these are the resources injected to mission-bootstrap project to instantiate your apps database. It will create a mysql database called sdi05_05_db with the following users and passwords loaded to the respective env variable in the container that connects to the database:
    - MYSQL_HOST
    - MYSQL_PORT
    - MYSQL_DB_NAME
    - MYSQL_DB_ADMIN_USER (Pass Var: MYSQL_DB_ADMIN_PASSWORD)
    - MYSQL_DB_RW_USER    (Pass Var: MYSQL_DB_RW_PASSWORD)
    - MYSQL_DB_RO_USER    (Pass Var: MYSQL_DB_RO_PASSWORD)
* If you have minio, these are the resources injected to mission-bootstrap project to instantiate minio.
    - accesskey
    - secretkey
    - MINIO_ENDPOINT_URL
    - S3_BUCKET=minio-sdi05-05-il2-staging
    - S3_REGION=us-gov-west-1
* If you have elasticsearch enabled, these are the resources injected to mission-bootstrap project to instantiate elasticsearch.
    - ELASTICSEARCH_URL="http://elasticsearch:9200"
    - ELASTICSEARCH_HOSTNAME="elasticsearch"
    - ELASTICSEARCH_PORT="9200"
* If you have mongodb enabled, these are the resources injected to mission-bootstrap project to instantiate mongodb.
    - MONGO_URL="mongodb://mongodb:27017"

## What's next?
If you haven't already, you need to make sure your application is passing the official P1 pipelines. CTF will needed for production, but you can get to staging and get an internet accessible url as long as you are passing pipeline tests. 
- With pipelines green, an infrastructure team member can add a deploy stage to the end of the pipeline to upload your release candidate image to the container registry on THIS project, and release images to the mission-bootstrap project's container registry.

The last step before deployment is to verify that pipelines can push generated images to respective container registry and that the pipeline automatically increments image tags on manifests.

Then the final step is for an infrastructure team to merge in your application to mission-bootstrap master from the automatically generated branch dev-LZ-sdi05-05 in that repo. By default, manifests have commented out all k8s resources to ensure nothing is instantiated by accident. This needs to be undone in, for example, `mission-bootstrap/staging/il2/kustomization.yaml`. 

At this point, your app should be live in staging! The default url is https://sdi05-05.staging.dso.mil

## How to manage
Eventually, application teams will be able to control these manifests fully, but until some policy constraints are worked out, an infrastructure team member will need to make merges into master. The master branch is used for the staging cluster and the release branch is used by production. 
