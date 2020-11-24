import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { AppointmentService } from '../../businessLogic/AppointmentService';
import { IAppointmentItem } from '../../models/IAppointmentItem';
import { IUpdateIsDoneReq } from '../../requests/appointment/IUpdateIsDoneReq';

const logger = createLogger('updateAppointmentIsDone');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const appointmentId = event.pathParameters.appointmentId;
  const updatedReq: IUpdateIsDoneReq = JSON.parse(event.body);

  let item: IAppointmentItem = await AppointmentService.updateIsDone(updatedReq.isDone, appointmentId);

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  };
});

handler.use(cors({
  origin: '*',
  credentials: false
}));
