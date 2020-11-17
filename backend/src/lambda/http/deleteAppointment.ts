import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { AppointmentService } from '../../businessLogic/AppointmentService';

const logger = createLogger('deleteAppointment');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const userId = getUserId(event);
  const appointmentId = event.pathParameters.appointmentId

  const items = await AppointmentService.get(userId, appointmentId);

  if (!items || items.length == 0) {
    logger.info(`Appointment item ${appointmentId} not found`);

    return {
      statusCode: 404,
      body: `Appointment item ${appointmentId} not found`
    };
  }

  try {
    await AppointmentService.delete(userId, appointmentId);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error deleting appointment item ${appointmentId}`
    };
  }

  return {
    statusCode: 200,
    body: ''
  };
});

handler.use(cors({
  origin: '*',
  credentials: true
}))