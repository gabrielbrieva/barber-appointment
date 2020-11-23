import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { AppointmentService } from '../../businessLogic/AppointmentService';

const logger = createLogger('generateUploadUrl');

const s3BucketName = process.env.S3_ATTACHEMENTS_BUCKET;
const s3BeforePrefix = "before";
const s3AfterPrefix = "after";

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event);

  const appointmentId = event.pathParameters.appointmentId;
  const prefix = event.pathParameters.prefix;
  const objectId = `${prefix}_${appointmentId}.jpg`;
  const userId = getUserId(event);

  if (prefix === s3BeforePrefix) {
    await AppointmentService.updateBeforeImgUrl(`https://${s3BucketName}.s3.amazonaws.com/${objectId}`, userId, appointmentId);
  } else if (prefix === s3AfterPrefix) {
    await AppointmentService.updateAfterImgUrl(`https://${s3BucketName}.s3.amazonaws.com/${objectId}`, userId, appointmentId);
  }

  const updateUrl = AppointmentService.getSignedUpdateUrl(objectId);

  logger.info(`Signed Attachment Update URL for Appointment ID ${appointmentId}: ${updateUrl}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: updateUrl
    })
  };
});

handler.use(cors({
  origin: '*',
  credentials: true
}));
