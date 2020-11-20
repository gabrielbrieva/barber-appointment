import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { AppointmentService } from '../../businessLogic/AppointmentService';
import { IAppointmentItem } from '../../models/IAppointmentItem';
import { IUpdateReviewReq } from '../../requests/appointment/IUpdateReviewReq';

const logger = createLogger('updateAppointmentReview');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const userId = getUserId(event);
  const appointmentId = event.pathParameters.appointmentId;
  const updatedReq: IUpdateReviewReq = JSON.parse(event.body);

  let item: IAppointmentItem = await AppointmentService.updateReview(updatedReq, userId, appointmentId);

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  };
});

handler.use(cors({
  origin: '*',
  credentials: true
}));