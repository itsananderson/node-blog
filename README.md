Node Blog
=========

This is a basic personal project to create a blog using Node

Objectives
----------

* To learn more about Node.js, Express, Angular, and MongoDB
* Be able to use a simple UI to publish online

Authentication Warning
----------------------

As currently implemented, this app doesn't require authentication to edit posts.
This means anybody who finds your site can edit your content
You've been warned!

Installation
------------

* Make sure you have Node, MongoDB, and Git installed
* Check that your MongoDB server is running
* Clone this repository to your machine
* `cd` into the folder where you cloned the repository and run `npm install`
* Run `node app.js`

Deploying to Azure
------------------

* Create an Azure website
* Create a MongoDB service from the store
* Paste your MongoDB connection string into a new configuration option under "configuration" &rarr; "connection strings" with the key `MONGOLAB_URI`
* Enable Git deployments to for the website, taking note of the Git repository url
* Clone this repository to your local machine
* Add the Azure remote by running `git remote add azure <your-repo>` where `<your-repo>` is the Git deployment repository for your Azure site
* Run `git push azure master` to push the repository to your Azure site. You'll need to enter your Azure password