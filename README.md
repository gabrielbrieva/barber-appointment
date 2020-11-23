# Barber Appointments
Simple web application to make an appointment with barber. This repo contain two projects:
* __backend__: Nodejs application based on Serverless Framework to deploy lambda functions an related resources to AWS.
* __frontend__: Single page application (SPA) created with Angular to provide a Web user interface to Create, Update, Delete and Review a Barber Appointment.

## Backend

Nodejs project based on Serverless Framework.

### Requirement
* AWS CLI
* Serverless
* node 12 or higher

### Deployment

1. Entry to backend folder path
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
sls deploy
```