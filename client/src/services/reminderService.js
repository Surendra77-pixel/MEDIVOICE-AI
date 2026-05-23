export const setMedicationReminder = (medicationName, time) => {
  if (!('Notification' in window)) return;
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
      
      let delay = reminderTime.getTime() - now.getTime();
      if (delay < 0) {
        // If the time already passed today, set it for tomorrow
        delay += 24 * 60 * 60 * 1000;
      }

      setTimeout(() => {
        new Notification("MediVoice Reminder", {
          body: `Time to take your medication: ${medicationName}`,
          icon: "/vite.svg"
        });
      }, delay);
      
      console.log(`Reminder set for ${medicationName} in ${Math.round(delay/60000)} minutes.`);
    }
  });
};
