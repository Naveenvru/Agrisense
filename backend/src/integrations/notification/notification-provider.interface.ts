import { IIntegrationProvider } from '../common/provider.interface';

/**
 * INotificationProvider
 *
 * Contract for notification/messaging providers.
 * Future implementations: Firebase FCM, Email (SendGrid), SMS (Twilio), WhatsApp (Meta).
 *
 * All notification clients must implement this interface so that
 * NotificationService can swap providers without business code changes.
 */
export interface INotificationProvider extends IIntegrationProvider {
  /**
   * Send a notification message.
   *
   * @param recipient   Target identifier (phone, email, FCM token, etc.)
   * @param title       Notification title or subject
   * @param body        Notification content
   * @param metadata    Optional provider-specific metadata
   */
  send(
    recipient: string,
    title: string,
    body: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
}
