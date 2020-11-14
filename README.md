# File Upload With Express

## Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
  - [Installing](#installing)
  - [Running](#running)
- [Configuring Amazon S3](#configuring-amazon-s3)
- [Configuring Environment Variables For AWS And S3](#configuring-environment-variables-for-aws-and-s3)
- [Deploying To Heroku](#deploying-to-heroku)
  - [Creating A New App](#creating-a-new-app)
  - [Becoming A Collaborating On An Existing App](#becoming-a-collaborating-on-an-existing-app)
  - [Pushing To Heroku](#pushing-to-heroku)
- [The Flow Of Data In The Application](#the-flow-of-data-in-the-application)
  - [Looking At The Database](#looking-at-the-database)

## Getting Started

### Installing

1. Fork and/or clone this repository
1. Run `npm install` to install the required dependencies
1. Run `npm run db:setup` to create the database and migrate to the latest schema

#### Key Dependencies And Application Files <!-- omit in toc -->

This example uses [Knex.js][github-knex] to interact with the database and [Multer][github-multer] to handle file uploads. Express can handle file uploads itself, but Multer makes it easier to do things like send uploaded files to S3.

- `routes.js` contains all the routes for the web application
- `database.js` initializes the database connection and exports a Knex client
- `photoUpload.js` defines a multer "upload handler" for our photos that tells Express to send any files we receive up to S3.

### Running

This example stores files using [Amazon's Simple Storage Service][url-amazon-s3], commonly called Amazon S3 or just S3. You will need to create an account with [Amazon Web Services][url-aws] (aka AWS) to run it locally and in production.

1. Create an Amazon Web Services (AWS) account and configure S3 (see [Configuring Amazon S3](#configuring-amazon-s3))
1. Ensure all environment variables are correctly configured (see [Configuring Environment Variables](#configuring-environment-variables-for-aws-and-s3))
1. To launch the app in development, run:

   ```console
   npm run dev
   ```

`npm run dev` uses the [nodemon][url-nodemon] package to reload the web application automatically when you edit files. You can also run `npm start` to get the "standard", non-restarting behavior.

Visit <http://localhost:3000> and get uploading!

If something fails, it likely means one of the following things is misconfigured:

1. The local database
1. Your S3 bucket on AWS
1. Your AWS credentials contained in `.env`

## Configuring Amazon S3

Follow the instructions in the **Overview** and **S3 setup** sections of [Heroku's AWS S3 Guide][url-heroku-s3]. This example implements the *Pass-Through Upload* approach described in the **File Upload** section.

These are the steps:

1. Create an AWS account
1. Create a new S3 bucket for this application (you choose a name)
1. Create new security credentials and remember the **AWS Access Key ID** and **AWS Secret Access Key**

## Configuring Environment Variables For AWS And S3

The application expects our AWS information to be stored in environment variables. This allows us to publish our application code without publishing the API keys/secrets required to connect to our AWS account.

### Connecting To AWS In Development (`localhost`) <!-- omit in toc -->

This example uses the [dotenv][github-dotenv] package to manage environment variables in development. Dotenv looks for a file named `.env` and uses it to define the environment variables contained inside.

The `.env` file should never be committed to your repository. The example contains an `example.env` to get you started:

1. Copy `example.env` to `.env` by running:

   ```console
   cp example.env .env
   ```

   Yes, you can have a file named `.env`. Files that begin with a period `.` are considered "hidden" are are often used for configuration. Run `ls -a` to see all files and directories, including hidden ones. You might be surprised!
1. Edit `.env` and set the values of `S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` to your S3 bucket name, AWS Access Key ID, and AWS Secret Access Key, respectively.

#### Connecting To AWS In Production (Heroku) <!-- omit in toc -->

Use `heroku config:set` to set environment variables on Heroku. See Heroku's documentation for [Configuration and Config Vars][url-heroku-config-vars].

Run `heroku config` to see all the currently set environment variables for your Heroku app. Run `heroku config --help` to see a description of all the Heroku commands related to environment variables.

## Deploying To Heroku

[Heroku][url-heroku] is a service that allows us to host our application and make it available to the whole world. Every time we have a new version of our application, we push it to Heroku (a process called *deploying*).

One nice feature of Heroku is that we use `git` to publish new versions of your application.

Before anything else, do the following:

1. Create an account on [Heroku][url-heroku]
1. [Download and install the Heroku command line tool][url-heroku-install-cli]
1. Once the `heroku` command is available, log into your Heroku account with the following command:

   ```console
   heroku login
   ```

One person on a team should create the "main" application under their account and add other teammates as collaborators. See Heroku's official documentation: *[Collaborating with Other Developers on Your App][heroku-collaborating*.

### Creating A New App

1. To **create** a new application, run the following command (replacing `some-example-app` with a *unique* name for your application):

  ```console
  heroku create some-example-app
  ```

1. Add PostgreSQL to your Heroku instance with the following command:

   ```console
   heroku addons:create heroku-postgresql:hobby-dev
   ```

1. Add collaborators with the following command:

  ```console
  heroku access:add changethisemail@example.com
  ```

  You can also add collaborators via the web interface.

### Becoming A Collaborating On An Existing App

1. You should have received an email when you were added as a collaborator. Follow the steps in that email.
1. If you want to be able to deploy from your own computer, run the following command:

   ```heroku
   heroku git:remote -a some-example-app
   ```

   Replace `some-example-app` with the name of the application on Heroku.

### Pushing To Heroku

You're now ready to deploy to Heroku using `git`:

```console
git push heroku
```

We use `npm run db:migrate` to migrate our local database to the latest schema. Once `git push` has finished, use `heroku run` to run the same command on Heroku:

```console
heroku run npm run db:migrate
```

You will have to run this command any time you make changes to your application's database between deploys.

Finally, to see the domain for your application, run the following:

```console
heroku domains
```

Open it up in your browser of choice!

## The Flow Of Data In The Application

This example stores files using [Amazon's Simple Storage Service][url-amazon-s3], commonly called Amazon S3 or just S3. Heroku requires this because any files saved on Heroku after deploying are considered temporary files. They'll be erased periodically, including any time you re-deploy the application.

So, how do we "save" uploaded files? When the user submits a form containing a file, the file data is sent to our web application. The application *immediately* uploads the file to S3.

If the uploads to S3 succeeds, our web application then saves information about the just-uploaded file to the `photos` table in the database. Each uploaded file has a corresponding row in the `photos` table that contains information like the type of file and its URL on S3.

The file data movesx between three environments:

```text
User's computer --> Web application
                --> S3
```

### Looking At The Database

It's worth connecting to the database from time to time to see what the various table look like and to double-check that they contain what you expect.

To connect to your **local database**, run the following command:

```console
npm run db:psql
```

The connect to the **production database**, run the following command:

```console
heroku pg:psql
```

You can run the following to see a description of all the Heroku commands related to PostgreSQL:

```console
heroku pg --help
```

[url-amazon-s3]: https://aws.amazon.com/s3/
[url-aws]: https://aws.amazon.com/
[url-heroku-s3]: https://devcenter.heroku.com/articles/s3
[url-nodemon]: https://nodemon.io/
[url-heroku-config-vars]: https://devcenter.heroku.com/articles/config-vars
[github-dotenv]: https://github.com/motdotla/dotenv
[github-knex]: https://github.com/knex/knex
[github-multer]: https://github.com/expressjs/multer#readme
[heroku-collaborating]: https://devcenter.heroku.com/articles/collaborating
