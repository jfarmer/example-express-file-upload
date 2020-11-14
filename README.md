# File Upload With Express

## Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
  - [Installing](#installing)
  - [Amazon S3](#amazon-s3)
  - [Running](#running)
- [Packages and Application Files](#packages-and-application-files)

## Getting Started

### Installing

1. Fork and/or clone this repository
1. Run `npm install` to install the required dependencies
1. Run `npm run db:setup` to create the database and migrate to the latest schema

### Amazon S3

This example stores files using [Amazon's Simple Storage Service][url-amazon-s3], commonly called Amazon S3 or just S3. You will need to create an account with [Amazon Web Services][url-aws] (aka AWS) to use it.

Follow the instructions in the **Overview** and **S3 setup** sections of [Heroku's AWS S3 Guide][url-heroku-s3]. This example implements the *Pass-Through Upload* approach described in the **File Upload** section.

The steps are as follows:

1. Create an AWS account
1. Create a new S3 bucket for this application (you choose a name)
1. Create new security credentials and remember the **AWS Access Key ID** and **AWS Secret Access Key**
1. Copy `example.env` to `.env` by running:

   ```console
   cp example.env .env
   ```

   Yes, you can have a file named `.env`. Files that begin with a period `.` are considered "hidden" are are often used for configuration. Run `ls -a` to see all files and directories, including hidden ones. You might be surprised!
1. Edit `.env` and set the values of `S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` to your S3 bucket name, AWS Access Key ID, and AWS Secret Access Key, respectively.

   The `.env` file is used to load environment variables in our development environment.
1. Use `heroku config:set` to set environment variables on Heroku. See Heroku's documentation for [Configuration and Config Vars][url-heroku-config-vars].

### Running

To launch the app in development, run:

```console
npm run dev
```

This uses the [nodemon][url-nodemon] package to reload the web application automatically when you edit files. You can also run `npm start` to get the "standard", non-restarting behavior.

Visit <http://localhost:3000> and get uploading!

## Packages and Application Files

This example uses [Knex.js][github-knex] to interact with the database and [Multer][github-multer] to handle file uploads. Express can handle file uploads itself, but Multer makes it easier to do things like send uploaded files to S3.

- `routes.js` contains all the routes for the web application
- `database.js` initializes the database connection and exports a Knex client
- `photoUpload.js` defines a multer "upload handler" for our photos that tells Express to send any files we receive up to S3.

[url-amazon-s3]: https://aws.amazon.com/s3/
[url-aws]: https://aws.amazon.com/
[url-heroku-s3]: https://devcenter.heroku.com/articles/s3
[url-nodemon]: https://nodemon.io/
[url-heroku-config-vars]: https://devcenter.heroku.com/articles/config-vars
[github-knex]: https://github.com/knex/knex
[github-multer]: https://github.com/expressjs/multer#readme
