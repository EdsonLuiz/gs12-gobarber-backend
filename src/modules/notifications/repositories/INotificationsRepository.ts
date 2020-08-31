import { ICreationNotificationDTO } from '../dtos/ICreationNotificationDTO';
import { Notification } from '../infra/typeorm/schemas/Notification';

export interface INotificationsRepository {
  create(data: ICreationNotificationDTO): Promise<Notification>;
}
