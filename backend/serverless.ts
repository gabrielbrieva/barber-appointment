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

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
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
  }
}

module.exports = serverlessConfiguration;
