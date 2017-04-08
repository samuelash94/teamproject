# How to run our website

Download/pull the "Project" folder.

Open command prompt and navigate to the "Project" folder.

Type "npm install" (you may need to type "npm install formidable" as well)

Open another command prompt and navigate to the bin folder in the MongoDB folder.

Type "mongod" to start the database.

In the other command prompt, type "node app.js"

Navigate to localhost:3000 in an internet browser to view the page.



# teamproject
CS4770 team project repository, Memorial University of Newfoundland, Winter 2017.

Our software is written in node js.

The following modules are used:

- bcryptjs
- body-parser
- connect-flash
- cookie-parser
- dotenv
- express
- express-handlebars
- express-messages
- express-session
- express-validator
- formidable
- fs
- handlebars
- jquery
- jsdom
- mongodb
- mongoose
- mongoose-friends
- node-msoffice-pdf
- nodemailer
- passport
- passport-http
- passport-local
- path
- xoauth2

When a profile is created, the email used must be a valid email that ends in @mun.ca. Email authentication is required to complete registration. There is also a limit of one profile per email address.
