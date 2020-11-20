import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IAppointmentItem } from "../models/IAppointmentItem";
import { createLogger } from "../utils/logger";
import { createDocumentClient } from "./DynamoDB";

export interface IAppointmentDataAccess {
    get(userId: string, appointmentId?: string): Promise<IAppointmentItem[]>;
    getById(appointmentId: string): Promise<IAppointmentItem[]>;
    getAllDone(): Promise<IAppointmentItem[]>;
    create(appointment: IAppointmentItem): Promise<IAppointmentItem>;
    update(appointment: IAppointmentItem): Promise<IAppointmentItem>;
    delete(userId: string, appointmentId: string): Promise<boolean>;
}

export class AppointmentDataAccess implements IAppointmentDataAccess {

    logger = createLogger('AppointmentDataAccess');

    private readonly docClient: DocumentClient;
    private readonly appointmentTableName: string;

    constructor(docClient: DocumentClient = createDocumentClient(), appointmentTableName: string = process.env.APPOINTMENTS_TABLE) {
        this.docClient = docClient;
        this.appointmentTableName = appointmentTableName;
    }

    async get(userId: string, appointmentId?: string): Promise<IAppointmentItem[]> {
        this.logger.info(`Getting all appointments by user id '${userId}'`);

        let queryInput: DocumentClient.QueryInput  = {
            TableName: this.appointmentTableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }

        if (appointmentId) {
            this.logger.info(`Using appointment id '${appointmentId}'`);
            queryInput.KeyConditionExpression += ' AND appointmentId = :appointmentId';
            queryInput.ExpressionAttributeValues[':appointmentId'] = appointmentId;
        }

        const result = await this.docClient.query(queryInput).promise();

        return result.Items as IAppointmentItem[];
    }

    async getById(appointmentId: string): Promise<IAppointmentItem[]> {
        this.logger.info(`Getting appointment by id '${appointmentId}'`);

        const result = await this.docClient.scan({
            TableName: this.appointmentTableName,
            FilterExpression: 'appointmentId = :appointmentId',
            ExpressionAttributeValues: {
                ':appointmentId': appointmentId
            }
        }).promise();

        return result.Items as IAppointmentItem[];
    }

    async getAllDone(): Promise<IAppointmentItem[]> {

        const result = await this.docClient.scan({
            TableName: this.appointmentTableName,
            FilterExpression: 'done = :done',
            ExpressionAttributeValues: {
                ':done': true
            }
        }).promise();

        return result.Items as IAppointmentItem[];
    }

    async create(appointment: IAppointmentItem): Promise<IAppointmentItem> {
        this.logger.info(`Creating new Appointment Item: ${JSON.stringify(appointment)}`);

        let result = await this.docClient.put({
            TableName: this.appointmentTableName,
            Item: appointment,
        }).promise();

        if (result.$response.error)
            this.logger.info(`Appointment Item NOT created: ${JSON.stringify(result.$response.error)}`);
        else
            this.logger.info(`Appointment Item created: ${JSON.stringify(appointment)}`);

        return appointment;
    }

    async update(appointment: IAppointmentItem): Promise<IAppointmentItem> {

        this.logger.info(`Updating Appointment Item: ${JSON.stringify(appointment)}`);

        let result = await this.docClient.update({
            TableName: this.appointmentTableName,
            Key: {
                appointmentId: appointment.appointmentId,
                userId: appointment.userId
            },
            ExpressionAttributeNames: {
                "#date": "date",
                "#time": "time",
                "#comment": "comment"
            },
            UpdateExpression: "set barberId = :barberId, serviceId = :serviceId, userName = :userName, #date = :date, #time = :time, done = :done, score = :score, #comment = :comment, beforeImg = :beforeImg, afterImg = :afterImg",
            ExpressionAttributeValues: {
                ":barberId": appointment.barberId,
                ":serviceId": appointment.serviceId,
                ":userName": appointment.userName,
                ":date": appointment.date,
                ":time": appointment.time,
                ":done": appointment.done || false,
                ":score": appointment.score || 0,
                ":comment": appointment.comment || null,
                ":beforeImg": appointment.beforeImg || null,
                ":afterImg": appointment.afterImg || null,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();

        if (result.$response.error)
            this.logger.error(`Appointment Item NOT updated: ${JSON.stringify(result.$response.error)}`);
        else
            this.logger.info(`Appointment Item updated: ${JSON.stringify(appointment)}`);

        return appointment;
    }

    async delete(userId: string, appointmentId: string): Promise<boolean> {

        this.logger.info(`Deleting Appointment Item by ID '${appointmentId}' and User ID '${userId}'`);

        let result = await this.docClient.delete({
            TableName: this.appointmentTableName,
            Key: {
                appointmentId: appointmentId,
                userId
            }
        }).promise();

        if (result.$response.error) {
            this.logger.error(`Appointment Item by ID '${appointmentId}' and User ID '${userId}' NOT deleted: ${JSON.stringify(result.$response.error)}`);
            return false;
        }

        this.logger.info(`Appointment Item by ID '${appointmentId}' and User ID '${userId}' deleted`);

        return true;
    }

}