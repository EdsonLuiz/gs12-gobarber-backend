import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository';
import { ICreationNotificationDTO } from '@modules/notifications/dtos/ICreationNotificationDTO';
import { ObjectID } from 'mongodb';
import { Notification } from '../../infra/typeorm/schemas/Notification';

export class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create(data: ICreationNotificationDTO): Promise<Notification> {
    const { content, recipient_id } = data;

    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}
