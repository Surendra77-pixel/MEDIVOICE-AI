const webpush = require('web-push');

/**
 * pushService
 * Handles browser push notifications using VAPID keys.
 */
class PushService {
  constructor() {
    this.publicKey = process.env.VAPID_PUBLIC_KEY;
    this.privateKey = process.env.VAPID_PRIVATE_KEY;
    this.email = process.env.PUSH_EMAIL || 'admin@medivoice.ai';

    if (this.publicKey && this.privateKey) {
      webpush.setVapidDetails(
        `mailto:${this.email}`,
        this.publicKey,
        this.privateKey
      );
    }
  }

  /**
   * Send notification to a specific subscription
   */
  async sendNotification(subscription, payload) {
    if (!this.publicKey || !this.privateKey) {
      console.warn('VAPID keys not configured. Skipping push notification.');
      return;
    }

    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('Push notification error:', err.message);
      return false;
    }
  }

  /**
   * Generate VAPID keys (Utility function for developers)
   */
  generateVAPIDKeys() {
    return webpush.generateVAPIDKeys();
  }
}

module.exports = new PushService();
