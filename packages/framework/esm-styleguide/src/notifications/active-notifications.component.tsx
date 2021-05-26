import React from "react";
import { Subject } from "rxjs";
import { InlineNotificationMeta, Notification } from "./notification.component";

interface ActiveNotificationProps {
  subject: Subject<InlineNotificationMeta>;
}

const ActiveNotifications: React.FC<ActiveNotificationProps> = ({
  subject,
}) => {
  const [notifications, setNotifications] = React.useState<
    Array<InlineNotificationMeta>
  >([]);

  const closeNotification = React.useCallback((notification) => {
    setNotifications((notifications) =>
      notifications.filter((n) => n !== notification)
    );
  }, []);

  React.useEffect(() => {
    const subscription = subject.subscribe((notification) =>
      setNotifications((notifications) => [
        ...notifications.filter(
          (n) =>
            n.description !== notification.description ||
            n.action !== notification.action ||
            n.kind !== notification.kind ||
            n.title !== notification.title
        ),
        notification,
      ])
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          closeNotification={() => closeNotification(notification)}
        />
      ))}
    </>
  );
};

export default ActiveNotifications;
