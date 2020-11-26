import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createLogger } from '../../utils/logger';
import { IUpdateReq } from '../../requests/appointment/IUpdateReq';
import { AppointmentService } from '../../businessLogic/AppointmentService';
import { IAppointmentItem } from '../../models/IAppointmentItem';

const logger = createLogger('updateAppointment');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const userId = getUserId(event);
  const appointmentId = event.pathParameters.appointmentId;
  const updatedReq: IUpdateReq = JSON.parse(event.body);

  let item: IAppointmentItem = await AppointmentService.updateAppointment(updatedReq, userId, appointmentId);

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  };
});

handler.use(cors({
  origin: '*',
  credentials: true
}));
