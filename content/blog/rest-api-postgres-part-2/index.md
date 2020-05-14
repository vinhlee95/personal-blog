---
title: "Build a REST API from scratch - Part 2: Building!"
date: "2019-02-23"
---

Before diving right in, here are steps that we will go through in this tutorial:

🔨 [Installing PostgreSQL on your local machine](#install-pg)

🔨 [Create a new local database and get access to it](#create-db)

🔨 [Node-Express project setup](#project-setup)

🔨 [Install Sequelize and configure it with local Postgres database](#configure-sequelize)

🔨 [Use Sequelize CLI to create models and migrations](#create-model)

# <a name='install-pg'></a> Installing PostgreSQL
First of all, you need to [download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) PostgreSQL installation package for your OS.

Following installation process with default settings for *port* and *username*, but do remember *password* because you will need it in order to configure the database later on. After finishing the installation, you should be able to check if it is successful by this command in your terminal:

![check](./psql-check.svg)
# <a name='create-db'></a> Create a new database and get access to it

You can try to create a new database on your local machine by `psql` command:

![create-db](./create-db.svg)

So, what I have just done is firstly create a postgres db named `todo-tutorial`. Next, I tried to *login* to that db and was asked for the password. Now, this is the step which really frustrated me at first. Remembering the installation process? You probably configure `username` to be `postgres` as default. Now, the password prompt is asked for a different user, most likely your OS username, as you could see in my case.

The problem is because when you do not specify username in the database access command, it will (probably automatically) point to OS username. If you then enter the password you created in the installation process in this case, it will probably be wrong.

### 🔨 Troubleshooting
There are several ways to solve this problem:

**💡Specify your postgres username in db access command:**

![specify-username](./specify-username.svg)

Now you can enter the password for user `postgres` created in the installation and be able to access the db.

**💡Create a new superuser and access to the db via that user**

![create-superuser](./create-superuser.svg)

You might wonder what `-P -s -d` within the command does. These are basically options that specify what your newly created user could do. Find out more about these options in [PostgreSQL docs](https://www.postgresql.org/docs/9.1/app-createuser.html).

**💡Access to the db via user postgres and change password for the user that you wish to use to login**

![alter-user](./alter-user.svg)

Here are brief steps:
- Access to your db via user `postgres`, which you already had the password for.
- Inside your db, Use `ALTER USER` command to change the password for user that you wish to use to login, but did not know the password. This is likely your OS user. In this case, for illustrative purpose, I assume that `myUser` is that user.
- Log out from the db by `\q` and try to login again via your username and password you just altered.

# <a name='project-setup'></a> Setup Node-Express project
First, make sure you have [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed on your machine.

Next, create a directory for the project with 2 initial child directories: `bin` and `server`. Then open your code editor. I have [VSCode](../vscode) installed and simply have it open by `code .` command.

```bash
	vinhle@🚀🚀🔥 PSQL $ mkdir -p todo-tutorials/{bin,server}
	vinhle@🚀🚀🔥 PSQL $ cd todo-tutorials
	vinhle@🚀🚀🔥 PSQL $ code .
```

The next step is to initialize a Node application inside your project directory, install `express, body-parser and morgan` as dependencies to get started:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ yarn init -y
	vinhle@🚀🚀🔥 todo-tutorials $ yarn add express body-parser morgan
```

Next, create a root server file `app.js` and open it up:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ touch app.js
	vinhle@🚀🚀🔥 todo-tutorials $ open app.js
```

Let's import modules that we just installed and init our Express app:

![express](./express.svg)

Next, we will create a starting point for our server in `bin` directory:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ touch bin/www
	vinhle@🚀🚀🔥 todo-tutorials $ open bin/www
```

![www](./www.svg)

To start the server, we need to add `start` script in `package.json`:

![script](./script-package.svg)

Now, when you run `yarn run dev` in your Terminal, you should be able to see it fires up:

![start-server](./start-server.svg)

## Install Nodemon

If you came from Front-end background, you should be familiar with *hot reloading*, in which development server reloads every time your code changes. We could be able to achieve the same thing in server side with **Nodemon**. Simply add Nodemon as a dev dependency:

```bash
	$ yarn add -D nodemon
```

Then modify your `dev` script in `package.json`:

```bash
	"dev": "nodemon bin/www"
```

Now nodemon should watch for your changes and restart the server accordingly:

![nodemon](./nodemon.svg)

# <a name='configure-sequelize'></a> Configure Sequelize
In this step, we will install [Sequelize](http://docs.sequelizejs.com/) - a promise-based ORM (Object Relation Mapping) for Node.js applications. An ORM basically acts like an interface between model objects in our Node app and database system which, in this case, PostgreSQL. Sequelize supports other DMSs such as MySQL, SQLite..., feel free to check it out.

Let's install **sequelize-cli** so that we can use it to easily generate boilerplate code. We could also add `sequelize`, `pg` and `pg-hstore` as dependencies as well:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ yarn global add sequelize-cli
	...
	vinhle@🚀🚀🔥 todo-tutorials $ yarn add sequelize
	...
	vinhle@🚀🚀🔥 todo-tutorials $ cd server
	vinhle@🚀🚀🔥 server $ sequelize init
```

Sequelize then will help us to create boilerplate code, inlude `config, migrations, models` and `seeders` directories. We will work mostly with `migrations` and `models` in this project.

Now let's configure sequelize by creating a `.sequelizerc` in your root directory

```bash
  $ touch .sequelizerc
  $ open .sequelizerc
```

Add following configuration to that file:

![sequelizerc](./sequelizerc.svg)

## Update sequelize configuration with local Postgres db
In `server/config/config.json`, you can find all sequelize configuration. As we use local db now in development, we will modify `development` with correct database configs:

![sequelize-config](./sequelize-config.svg)

Note that the database that we are using now is the one that you created by `createdb` command in [the second step](#create-db)

# <a name='create-model'></a> Create and configure models, controllers and routes
## Root model file
Now that we already had **Sequelize** config and **Sequelize CLI** `init` command, let's see how the boilerplate code configures our models. Here is what you probably see in `server/models/index.js` file:

![model/index.js](./rootmodel.svg)

This might look a bit scary at first but all it does could be summarized as:
* Check if we are using environment variable, if no then the default value is `development`. This is use to grab a specific configuration object in `config.json`. In this case as you might guess, config therefore will be `config.json['development']`.
* Next, it grabs `database`, `username` and `password`, plus what we have also put into the config file (In this case, I put `"logging: false"` to prevent SQL queries to be logged in the console).
* Then it uses `fs` to search for all `.js` file in our current directory, which we will add later to create our models. Obviously, each model will be defined in a separate file. Therefore, it loops through all found files and add equivalent models to Sequelize.
* Finally, as a model might have a relationship with another, it applies all such relations.
## Create a todo model
Let's create a `Todo` model by Sequelize CLI:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ sequelize model:generate --name Todo --attributes title:string
```

This command will also create a migration file named `xxxx-create-todo.js` in `migration` folder. What does this migration file do? Its main responsibility is to create an actual table corresponding to the model in the db. The `todo.js` model file that we just created is actually a table representation. In order to truly create a table, we need to run migration command. Before doing that, let's refactor `models/todo.js`:

![todo-model](./todo-model.svg)

In here, we defined Todo as a model object with `type` a non-null property. There are some default props that Sequelize created for us by default. If you take a look at the migration file, `id`, `createdAt` and `updatedAt` are three of them.

In Todo model, we have also associated it with two other models: `TodoItem` and `User`, which we will create later. `hasMany` and `belongsTo` are two types of [association](http://docs.sequelizejs.com/manual/tutorial/associations.html) that we have now.

Let's create User and TodoItem model:

```bash
	vinhle@🚀🚀🔥 todo-tutorials $ sequelize model:generate --name Users --attributes username:string, password:string, email:string
	vinhle@🚀🚀🔥 todo-tutorials $ sequelize model:generate --name TodoItems --attributes title:string, completed: boolean
```

Then let's define associations in both models:

`todoitem.js`

![todo-item-model](./todoitem-model.svg)

`user.js`

![user-model](./user-model.svg)

## Modify migration files to include foreign keys
One last step before we create tables in our db is to modify migration files. Two models which are in a relationship must specify their correlation by `foreign key`. For example, we could specify a Todo is belong to an User by adding an `UserId` property to Todo model. Let's do it in `xxxx-create-todo.js` migration file:

![create-todo-migration](./create-todo-migration.svg)

![create-todo-item-migration](./create-todo-item-migration.svg)

Then we can modify our server to sync with our db:

![sync-db](./sync-db.svg)

## Restart node server and check postgres db
Now if you restart our server, you should be able to access to our `todo-tutorial` db and see three tables created:

![show-tables](./show-tables.svg)

We could also see what's inside each table. Let's discover our Todo table:

![todo-table](./todo-table.svg)

Clearly, we haven't created any todo at the moment. Let's do it as well as create new todo items for every todo in the next part of the tutorial! Before saying goodbye, let me recap what we have been building so far in this part:

🔥 Install PostgreSQL database in your local machine and do some troubleshooting

🔥 Create a Node-Express project

🔥 Install Sequelize CLI and configure sequelize to connect to our local postgres db

🔥 Use Sequelize CLI commands to generate initial models & modify migration file to match with our associations.

✅ Now you should be able to run your server and sync it with data in your local db. If you have any questions or problems that need helps in troubleshooting (hopefully you have none 🙃), be sure to ping me in my channels bellow

### Otherwise, see you in the next part! 👋👋


