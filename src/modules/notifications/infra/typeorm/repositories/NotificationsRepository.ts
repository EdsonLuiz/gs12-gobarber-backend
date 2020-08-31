import { INotificationsRepository } from '@modules/notifications/repositories/INotificationsRepository';
import { ICreationNotificationDTO } from '@modules/notifications/dtos/ICreationNotificationDTO';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { Notification } from '../schemas/Notification';

export class NotificationsRepository implements INotificationsRepository {
  private readonly ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create(data: ICreationNotificationDTO): Promise<Notification> {
    const { content, recipient_id } = data;

    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}
