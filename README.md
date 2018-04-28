Welcome!

This is an Alexa ordering skill that utilizes the alexa skill kit and amazon web services.

The skill is called Five Gals which is also the name of our concept restaurant.

It allows user to access a set menu, place an order, and display on the restaurant screen.

Here's the instructions to how to recreate this skill for it to run on your own amazon echo:
1. You will need to create an account with the Amazon Developer
2. Once you have an account, create a new alexa skill and import the intents.json file.
a. innovation name: five gals - used to invoke the skill with amazon echo
b. intents: - used to activate specific actions within the skills such as getting the hours or placing an order
3. In order to host the codes and backin of the skill, you will need to use Amazon Web Services: create an account
4. Click on Lambda and create function.
5. Select an pre-existing template and import the index.js file from the lambda folder
6. In order to retrieve data from the dynamodb database, you will need a separate lambda function, create a new template, and import the index.js from the databaseAccess folder.
7. Now go into dynamodb and create a new table named menu and insert in the datas from the dynamodb menu file

8. You will also need to link the html page with the database in order to retrieve data from it under the API Calls.
a. You can access this page for a detailed instruction on how to link the alexa skill to the lambda function as well as connecting the        databse with the html page. -- https://blog.prototypr.io/using-voice-commands-to-control-a-website-with-amazon-echo-alexa-part-1-6-a35edbfef405
b. Use this page to learn how to build a simple alexa fact skill -- https://github.com/alexa/skill-sample-nodejs-fact/blob/en-US/instructions/1-voice-user-interface.md
  

