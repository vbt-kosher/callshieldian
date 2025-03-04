/**
 * Encryption utilities for CallShield
 * 
 * This module provides encryption/decryption functions for sensitive data
 * In a production app, you would use a more robust encryption library
 */

/**
 * Encrypt data using a key
 * 
 * This is a simple XOR-based encryption for demonstration.
 * In a production app, use a proper encryption library.
 * 
 * @param data The data to encrypt
 * @param key The encryption key
 * @returns Encrypted data string
 */
export const encryptData = (data: string, key: string): string => {
  // For demo purposes - in a real app, use a proper encryption library
  // like CryptoJS, TweetNaCl, or Web Crypto API
  
  try {
    console.log('Encrypting data...');
    
    // Simple XOR for demonstration (NOT secure for production)
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result.push(String.fromCharCode(charCode));
    }
    
    // Convert to base64 for storage
    return btoa(result.join(''));
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Fallback to unencrypted data on error
  }
};

/**
 * Decrypt data using a key
 * 
 * @param encryptedData The encrypted data string
 * @param key The decryption key
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    console.log('Decrypting data...');
    
    // Decode from base64
    const data = atob(encryptedData);
    
    // Reverse the XOR
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result.push(String.fromCharCode(charCode));
    }
    
    return result.join('');
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData; // Return encrypted data on error
  }
};

/**
 * Hash a string using SHA-256
 * Uses Web Crypto API which is available in modern browsers
 * 
 * @param data The string to hash
 * @returns Promise resolving to hash string
 */
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Use Web Crypto API to generate hash
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Obfuscate a phone number for display
 * Keeps only the last 4 digits visible
 * 
 * @param phoneNumber The full phone number
 * @returns Obfuscated phone number
 */
export const obfuscatePhoneNumber = (phoneNumber: string): string => {
  // Keep format but replace digits with *
  if (!phoneNumber || phoneNumber.length < 4) {
    return phoneNumber;
  }
  
  const lastFour = phoneNumber.slice(-4);
  const prefix = phoneNumber.slice(0, -4).replace(/\d/g, '*');
  
  return prefix + lastFour;
};
