import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'serverless-barber-appointments'
  },

  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },

  plugins: [
    'serverless-webpack',
    'serverless-iam-roles-per-function',
    'serverless-reqvalidator-plugin',
    'serverless-aws-documentation'
  ],

  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
  
    apiGateway: {
      minimumCompressionSize: 1024
    },

    stage: "${opt:stage, 'dev'}",
    region: "${opt:region, 'us-east-1'}",

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      APPOINTMENTS_TABLE: "Appointments-${self:provider.stage}",
      BARBERS_TABLE: "Appointments-${self:provider.stage}",
      S3_ATTACHEMENTS_BUCKET: "barber-appointment-files-${self:provider.stage}",
      SIGNED_URL_EXPIRATION_TIME: 300
    }
  },

  functions: {
    hello: {
      handler: 'src/handler.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          }
        }
      ]
    }
  },

  resources: {
    Resources: {
      AppointmentsDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "appointmentId", AttributeType: "S" }
          ],
          KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" },
            { AttributeName: "appointmentId", KeyType: "RANGE" }
          ],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.APPOINTMENTS_TABLE}"
        }
      },

      AttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.S3_ATTACHEMENTS_BUCKET}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: [ "*" ],
                AllowedHeaders: [ "*" ],
                AllowedMethods: [ "GET", "PUT", "POST", "DELETE", "HEAD" ],
                MaxAge: 3000
              }
            ]
          }
        }
      },

      BucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          PolicyDocument: {
            Id: "BarberAppointmentS3Policy",
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "PublicReadForGetBucketObjects",
                Effect: "Allow",
                Principal: "*",
                Action: "s3:GetObject",
                Resource: "arn:aws:s3:::${self:provider.environment.S3_ATTACHEMENTS_BUCKET}/*"
              }
            ]
          },
          Bucket: {
            Ref: "AttachmentsBucket"
          }
        }
      }



    }
  }
}

module.exports = serverlessConfiguration;
