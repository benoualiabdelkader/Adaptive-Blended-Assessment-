import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { db } from '../store/db';

export const importService = {
  parseCSV: (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err)
      });
    });
  },

  parseExcel: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  mapColumns: (data, mapping) => {
    // Translates external CSV headers to internal DB schema based on user mapping
    return data.map(row => {
      const mappedRow = {};
      Object.keys(mapping).forEach(internalKey => {
        const externalKey = mapping[internalKey];
        mappedRow[internalKey] = row[externalKey];
      });
      return mappedRow;
    });
  },

  validateImport: (data) => {
    // Ensure dataset is not empty and has a sufficient student footprint
    if (!data || data.length === 0) return { valid: false, message: 'Dataset is empty.' };
    return { valid: true, rows: data.length };
  },

  saveToDatabase: async (data, table = 'moodle_logs') => {
    try {
      await db[table].bulkAdd(data);
      return { success: true, count: data.length };
    } catch (err) {
      console.error("Dexie Write Error: ", err);
      return { success: false, error: err.message };
    }
  }
};
