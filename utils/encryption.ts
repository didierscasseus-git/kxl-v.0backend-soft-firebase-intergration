
/**
 * Simple client-side encryption/obfuscation utility.
 * In a real-world scenario, this would use Web Crypto API with user keys.
 * For now, we use a salted base64 approach to demonstrate the "Encrypted" state in UI.
 */

const SALT_PREFIX = 'KXL_SECURE_LAYER_V1::';

export const encryptData = (data: string): string => {
    if (!data) return '';
    // Simple obfuscation: Salt + Base64
    // Prevents casual reading in Firestore console
    return btoa(SALT_PREFIX + encodeURIComponent(data));
};

export const decryptData = (encryptedData: string): string => {
    if (!encryptedData) return '';
    try {
        const decoded = atob(encryptedData);
        if (decoded.startsWith(SALT_PREFIX)) {
            return decodeURIComponent(decoded.slice(SALT_PREFIX.length));
        }
        return '[DECRYPTION_FAILED] Invalid Security Token';
    } catch (e) {
        console.error('Decryption failed', e);
        return '[DATA CORRUPTED]';
    }
};
