import { AppointmentDataAccess, IAppointmentDataAccess } from "../data/AppointmentDataAccess";
import { IAppointmentItem } from "../models/IAppointmentItem";
import { createLogger } from "../utils/logger";
import * as uuid from 'uuid';
import { ICreateReq } from "../requests/appointment/ICreateReq";
import { IUpdateReviewReq } from "../requests/appointment/IUpdateReviewReq";
import { IUpdateReq } from "../requests/appointment/IUpdateReq";
import * as AWS from "aws-sdk";

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

const s3BucketName = process.env.S3_ATTACHEMENTS_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION_TIME;

export interface IAppointmentService {
    get(userId: string, appointmentId?: string): Promise<IAppointmentItem[]>;
    getAllDone(): Promise<IAppointmentItem[]>;
    create(createAppointmentReq: ICreateReq, userId: string): Promise<IAppointmentItem>;
    updateAppointment(updateReq: IUpdateReq, userId: string, appointmentId: string): Promise<IAppointmentItem>
    updateIsDone(isDone: boolean, appointmentId: string): Promise<IAppointmentItem>;
    updateReview(updateReviewReq: IUpdateReviewReq, userId: string, appointmentId: string): Promise<IAppointmentItem>;
    updateBeforeImgUrl(url: string, userId: string, appointmentId: string): Promise<IAppointmentItem>;
    updateAfterImgUrl(url: string, userId: string, appointmentId: string): Promise<IAppointmentItem>;
    delete(userId: string, appointmentId: string): Promise<boolean>;
    getSignedUpdateUrl(appointmentId: string): string;
}

class AppointmentSrv implements IAppointmentService {

    logger = createLogger(AppointmentSrv.name);

    constructor(private appointmentDataAccess: IAppointmentDataAccess = new AppointmentDataAccess()) {

    }

    async get(userId: string, appointmentId?: string): Promise<IAppointmentItem[]> {
        this.logger.info(`Getting Appointment items by User ID '${userId}' and Appointment ID '${appointmentId}'`);
        return this.appointmentDataAccess.get(userId, appointmentId);
    }

    async getAllDone(): Promise<IAppointmentItem[]> {
        this.logger.info(`Getting done Appointment items`);
        return this.appointmentDataAccess.getAllDone();
    }

    async create(createAppointmentReq: ICreateReq, userId: string): Promise<IAppointmentItem> {
        this.logger.info(`Creating new Appointment Item...`);

        const newItem = await this.appointmentDataAccess.create({
            userId: userId,
            appointmentId: uuid.v4(),
            userName: createAppointmentReq.userName,
            serviceId: createAppointmentReq.serviceId,
            barberId: createAppointmentReq.barberId,
            date: createAppointmentReq.date,
            time: createAppointmentReq.time,
            done: false
        });

        this.logger.info(`New Appointment Item created: ${JSON.stringify(newItem)}`);

        return newItem;

    }

    async updateAppointment(updateReq: IUpdateReq, userId: string, appointmentId: string): Promise<IAppointmentItem> {
        let items: IAppointmentItem[] = await this.appointmentDataAccess.get(userId, appointmentId);

        if (!items || items.length == 0) {
            this.logger.error(`Appointments not found for User ID ${userId} and AppointmentId: ${appointmentId}`);
            return null;
        }

        let item: IAppointmentItem = items[0];

        item.serviceId = updateReq.serviceId;
        item.barberId = updateReq.barberId;
        item.date = updateReq.date;
        item.time = updateReq.time;

        return await this.appointmentDataAccess.update(item);
    }

    async updateIsDone(isDone: boolean, appointmentId: string): Promise<IAppointmentItem> {

        let items: IAppointmentItem[] = await this.appointmentDataAccess.getById(appointmentId);

        if (!items || items.length == 0) {
            this.logger.error(`Appointments not found for AppointmentId: ${appointmentId}`);
            return null;
        }

        items[0].done = isDone;

        return await this.appointmentDataAccess.update(items[0]);
    }

    async updateReview(updateReviewReq: IUpdateReviewReq, userId: string, appointmentId: string): Promise<IAppointmentItem> {
        let items: IAppointmentItem[] = await this.appointmentDataAccess.get(userId, appointmentId);

        if (!items || items.length == 0) {
            this.logger.error(`Appointments not found for User ID ${userId} and AppointmentId: ${appointmentId}`);
            return null;
        }

        items[0].score = updateReviewReq.score;
        items[0].comment = updateReviewReq.comment;

        return await this.appointmentDataAccess.update(items[0]);
    }

    async updateBeforeImgUrl(url: string, userId: string, appointmentId: string): Promise<IAppointmentItem> {
        let items: IAppointmentItem[] = await this.appointmentDataAccess.get(userId, appointmentId);

        if (!items || items.length == 0) {
            this.logger.error(`Appointments not found for User ID ${userId} and AppointmentId: ${appointmentId}`);
            return null;
        }

        items[0].beforeImg = url;

        return await this.appointmentDataAccess.update(items[0]);
    }

    async updateAfterImgUrl(url: string, userId: string, appointmentId: string): Promise<IAppointmentItem> {
        let items: IAppointmentItem[] = await this.appointmentDataAccess.get(userId, appointmentId);

        if (!items || items.length == 0) {
            this.logger.error(`Appointments not found for User ID ${userId} and AppointmentId: ${appointmentId}`);
            return null;
        }

        items[0].afterImg = url;

        return await this.appointmentDataAccess.update(items[0]);
    }

    async delete(userId: string, appointmentId: string): Promise<boolean> {

        const items: IAppointmentItem[] = await this.get(userId, appointmentId);

        this.logger.info(`Appointment item to delete: ${JSON.stringify(items)}`);

        if (!items || items.length <= 0) {
            this.logger.info(`No Appointment item found for: ${appointmentId}`);
            return false;
        }

        const item: IAppointmentItem = items[0];

        if (item.beforeImg)
            await this.deleteS3Object(item.beforeImg);

        if (item.afterImg)
            await this.deleteS3Object(item.afterImg);

        this.logger.info(`Removing Appointment item '${appointmentId}' from DB`);

        return await this.appointmentDataAccess.delete(userId, appointmentId);
    }

    private async deleteS3Object(objectId: string): Promise<void> {
        this.logger.info(`Deleting object '${objectId}' from S3 bucket '${s3BucketName}'`);

        await s3.deleteObject({
            Bucket: s3BucketName,
            Key: objectId
        }).promise();
    }

    getSignedUpdateUrl(objectId: string): string {
        this.logger.info(`Getting Signed URL for '${objectId}'`);

        const signedUrl = s3.getSignedUrl('putObject', {
            Bucket: s3BucketName,
            Key: objectId,
            Expires: parseInt(signedUrlExpiration)
        });

        this.logger.info(`Signed URL for '${objectId}': ${signedUrl}`);

        return signedUrl;
    }

}

export const AppointmentService: IAppointmentService = new AppointmentSrv();