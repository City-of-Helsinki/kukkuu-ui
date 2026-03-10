import { Notification as RHHCNotification } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { NotificationProps as RHHCNotificationProps } from '@city-of-helsinki/react-helsinki-headless-cms';

export default function Notification(props: RHHCNotificationProps) {
  return <RHHCNotification {...props} />;
}
