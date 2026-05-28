import { toast } from 'sonner';
import { IntlShape } from 'react-intl';

/**
 * Internationalized toast notification helpers
 *
 * Usage:
 * ```typescript
 * import { useIntl } from 'react-intl';
 * import { showToast } from '@/app/utils/toast';
 *
 * const intl = useIntl();
 * showToast.success(intl, 'notifications.success.saved');
 * showToast.error(intl, 'notifications.error.generic');
 * showToast.warning(intl, 'notifications.warning.unsavedChanges');
 * showToast.info(intl, 'notifications.info.processing');
 *
 * // With parameters:
 * showToast.error(intl, 'notifications.error.minimumWithdrawal', { amount: 100 });
 * ```
 */
export const showToast = {
  /**
   * Show a success toast notification
   * @param intl - IntlShape from useIntl() hook
   * @param messageKey - Translation key for the message
   * @param values - Optional values for message interpolation
   */
  success: (intl: IntlShape, messageKey: string, values?: Record<string, any>) => {
    toast.success(intl.formatMessage({ id: messageKey }, values));
  },

  /**
   * Show an error toast notification
   * @param intl - IntlShape from useIntl() hook
   * @param messageKey - Translation key for the message
   * @param values - Optional values for message interpolation
   */
  error: (intl: IntlShape, messageKey: string, values?: Record<string, any>) => {
    toast.error(intl.formatMessage({ id: messageKey }, values));
  },

  /**
   * Show a warning toast notification
   * @param intl - IntlShape from useIntl() hook
   * @param messageKey - Translation key for the message
   * @param values - Optional values for message interpolation
   */
  warning: (intl: IntlShape, messageKey: string, values?: Record<string, any>) => {
    toast.warning(intl.formatMessage({ id: messageKey }, values));
  },

  /**
   * Show an info toast notification
   * @param intl - IntlShape from useIntl() hook
   * @param messageKey - Translation key for the message
   * @param values - Optional values for message interpolation
   */
  info: (intl: IntlShape, messageKey: string, values?: Record<string, any>) => {
    toast.info(intl.formatMessage({ id: messageKey }, values));
  },
};
