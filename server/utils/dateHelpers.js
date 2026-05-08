/**
 * Date and Time Helper Utilities
 */
const dateHelpers = {
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  isSlotAvailable: (bookedSlots, requestedTime, duration) => {
    // Basic implementation: check if requestedTime overlaps with any bookedSlots
    // bookedSlots: Array of { start, end }
    const reqStart = new Date(requestedTime);
    const reqEnd = new Date(reqStart.getTime() + duration * 60000);

    return !bookedSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return (reqStart < slotEnd && reqEnd > slotStart);
    });
  },

  getTimeSlots: (startTime, endTime, duration) => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    while (current < end) {
      slots.push(current.toTimeString().substring(0, 5));
      current.setMinutes(current.getMinutes() + duration);
    }

    return slots;
  }
};

module.exports = dateHelpers;
