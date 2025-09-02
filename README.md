## CloudView

## Overview
CloudView is the frontend of a larger tool that has various AWS security findings streamed into a database and allows the querying of the database to consolidate findings across the Coremont organization. This front end
is built in VueJS and contains a user input box for querying via SQL the backend Postgres DB that holds various findings.

![alt text](https://github.com/hrmcardle0/cloudview/blob/main/public/github-pic1.PNG?raw=true)


### How it works

CloudView is the VueJS frontend the user hits upon going to the front end URL. The user then ends in an API password, that is checked against a Lambda auth function, which then authorizes the user to perform
further API calls. Upon entering the app, metrics and findings are automatically pulled down by the browser, with a default limit of 200. The user can then view findings based on account, or enter in a SQL query
to be performed by the database. 

Metrics are also collected based on a set of metrics determined at build time. These metrics are pulled in once the user logs in and are also used to show graphs of the metrics over time. User queries and
metrics are also cached to lessen the number of API calls.

## Configuration

The following are recommended to deploy in addition to this:

- API Gateway stage to handle calls to POST SQL queries and GET SQL DB current size
- Lambda functions fronted by API Gateway to forward queries from front end to backend
  - Lambdas should be sure to sanitize SQL queries before executing
- Postgres or other relational DB backend to store findings

### Technical Deployment

VueJS front end -> API Gateway calls with auth password -> triggers Lambda -> calls into Postgres RDS database -> returns query results and metrics.

Builds and deploys directly to an s3 bucket hosted by CyberSec.

To build and run in a production S3 static website bucket, perform the following:

Clone the Repo

Set appropriate permissions on build script, ensuring your env variables are set

`chmod +x ./build-to-s3`

Run to deploy to s3

`./build-to-s3.sh`
