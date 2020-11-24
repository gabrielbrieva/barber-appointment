# Barber Appointments
Simple web application to make an appointment with barber. This repo contain two projects:
* __backend__: Nodejs application based on Serverless Framework to deploy lambda functions an related resources to AWS.
* __frontend__: Single page application (SPA) created with Angular to provide a Web user interface to Create, Update, Delete and Review a Barber Appointment.

## Backend

![](https://github.com/gabrielbrieva/barber-appointment/workflows/CI/badge.svg)

Nodejs project based on Serverless Framework.

### Requirement
* npm command
* node 12 or higher
* AWS CLI

### Deployment

1. Entry to "backend" folder path
```bash
cd backend
```

2. Install node dependencies
```bash
npm install
```

3. Configure AWS credentials
```bash
aws configure
```

4. Deploy to AWS using Serverless
```bash
npm run deploy
```

### CI/CD
The automatization of build and deploy is managed by GitHub Actions configured by main.yml file.

* Build is triggered by each commit.
* The AWS deploy action is triggered by relase tags.

## Frontend

SPA based on Angular project

### Requirement
* npm command
* node 12 or higher

### Run
To run the web application locally:

1. Entry to "frontend" folder path
```bash
cd frontend
```

2. Update _src/environments/environment.ts_ file
```ts
const apiId = 'YOUR API ID FROM DEPLOYED AWS LAMBDA FUNCTIONS';
const region = 'YOUR AWS REGION WHERE IS DEPLOYED FRONTEND';
```

3. Run npm script to build and start local server
```bash
npm run start
```

4. Start your browser at http://localhost:4200

## How this work

![Running](barber_appointment.gif)