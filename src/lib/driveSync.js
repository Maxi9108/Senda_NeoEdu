/**
 * Senda NeoEdu - Sincronizador con Google Drive & Google Sheets
 * Permite usar Google Apps Script como backend gratuito 24/7 sin límite de proyectos.
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

/**
 * Sincroniza el estado de la aplicación con la hoja de Google Sheets en Google Drive
 * @param {Object} appData 
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function syncToGoogleDrive(appData) {
  if (!APPS_SCRIPT_URL) {
    console.warn('VITE_GOOGLE_APPS_SCRIPT_URL no está configurada en .env. Se usará almacenamiento local.');
    return { success: false, error: 'URL no configurada' };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'sync_data',
        payload: appData
      })
    });

    const result = await response.json();
    return { success: result.status === 'success', ...result };
  } catch (err) {
    console.error('Error sincronizando con Google Drive:', err);
    return { success: false, error: err.toString() };
  }
}

/**
 * Carga el estado inicial desde Google Sheets
 * @returns {Promise<Object|null>}
 */
export async function loadFromGoogleDrive() {
  if (!APPS_SCRIPT_URL) return null;

  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const result = await response.json();
    if (result.status === 'success' && result.data) {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error('Error cargando desde Google Drive:', err);
    return null;
  }
}

/**
 * Sube un archivo directamente a la carpeta de Google Drive asignada
 * @param {File} file 
 * @returns {Promise<{fileUrl: string, fileId: string}|null>}
 */
export async function uploadFileToGoogleDrive(file) {
  if (!APPS_SCRIPT_URL) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            action: 'upload_file',
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            fileBase64: base64Data
          })
        });

        const result = await response.json();
        if (result.status === 'success') {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Fallo en la subida a Drive'));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
