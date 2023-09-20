# Project 1 - Employee Reimbursement System

## Table of contents

- [Overview](#overview)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

Create the backend for an Employee Reimbursement System (ERS). The system should allow employees to submit reimbursement request tickets, and allow managers to approve or deny the request tickets. 

### Links

- Solution URL: [Github](https://github.com/snelson-seattle/rev-Project1)

## My process

### Built with

- NodeJS
- ExpressJS
- DynamoDB
- JWT


### What I learned

This project reinforced ideas that have been presented in the training. I used the 3 tier architecture to design my REST API for the ticketing system with ExpressJS. I implemented user registration, login, and logout functionality and endpoint authorization using JWTs. User and Ticket data is persisted using DynamoDB at the data tier. Having no prior experience with AWS, this project taught me the basics of IAM and DynamoDB. I created a user specifically for this application and following the least privilege model, only allowed access to the DynamoDB service. I then created credentials for that user that I added to my development environment so that my application could authenticate to the DynamoDB service during development. We were given examples for using the AWS-SDK for Javascript v2 in our training sessions, but due to the warnings that v2 code would be deprecated I chose to refactor my project to use v3 code. I verified my API functionality by testing the endpoints with Postman.


### Continued development

Now that I have a MVP for the backend, I would like to create a frontend web application using React to make use of the API.

### Useful resources

- [AWS SDK for Javascript Documentation](https://docs.aws.amazon.com/sdk-for-javascript/) - This helped me refactor my code to use v3 code. I prefer using v3 of the SDK because the functions are all promise based, allowing me to use async/await syntax.

## Author
  Scott E. Nelson
- Website - https://www.scottenelson.dev
- GitHub - [snelson-seattle](https://github.com/snelson-seattle)


