import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { IAppointmentItem } from '../../models/IAppointmentItem';
import { AppointmentService } from '../../businessLogic/AppointmentService';

const logger = createLogger('getAppointments');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const items: IAppointmentItem[] = await AppointmentService.getAllDone();

  return {
    statusCode: 200,
    body: JSON.stringify({items})
  }
});

handler.use(cors({
  origin: '*'
}));
