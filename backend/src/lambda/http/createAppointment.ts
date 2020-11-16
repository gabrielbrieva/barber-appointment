import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { ICreateReq } from '../../requests/appointment/ICreateReq';
import { AppointmentService } from '../../businessLogic/AppointmentService';

const logger = createLogger('createAppointment');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const userId: string = getUserId(event);
  const newAppointmentReq: ICreateReq = JSON.parse(event.body);
  const newAppointmentItem = await AppointmentService.create(newAppointmentReq, userId);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newAppointmentItem
    })
  }
});

handler.use(cors({
  origin: '*',
  credentials: true
}));
