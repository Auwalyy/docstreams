import Notification from '../models/Notification';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'request' | 'approval' | 'rejection' | 'assignment' | 'system' = 'system'
) => {
  await Notification.create({ user: userId, title, message, type });
};
