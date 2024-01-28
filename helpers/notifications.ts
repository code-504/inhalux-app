export const getTitleByDate = (notificationDate: any) => {
    const today = new Date();
    const notificationDay = new Date(
      notificationDate.split('/').reverse().join('-')
    );
  
    const timeDifference = today.getTime() - notificationDay.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  
    switch (daysDifference) {
      case 0:
        return 'Hoy';
      case 1:
        return 'Ayer';
      default:
        return `Hace ${daysDifference} días`;
    }
};

export const groupByDate = (notifications: any) => {
    const groupedByDate = notifications.reduce((result:any, notification:any) => {
      const date = new Date(notification.date).toLocaleDateString();
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(notification);
      return result;
    }, {});
    return groupedByDate;
};