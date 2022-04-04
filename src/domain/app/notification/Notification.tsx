import { Notification as RHHCNotification } from 'react-helsinki-headless-cms/apollo';
import { NotificationProps as RHHCNotificationProps } from 'react-helsinki-headless-cms';

export default function Notification(props: RHHCNotificationProps) {
  return <RHHCNotification {...props} />;
}
