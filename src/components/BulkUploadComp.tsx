/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { EventDetails, Attendee } from '../types';
import { signAttendeePass } from '../utils/passHelpers';
import { renderPassToCanvas } from '../utils/canvasExporter';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { Upload, FileDown, Check, AlertCircle, Trash2, Download, Copy, RefreshCw, X } from 'lucide-react';

interface BulkUploadCompProps {
  event: EventDetails;
  onImportComplete: (importedAttendees: Attendee[]) => void;
  onClose: () => void;
}

interface CSVRow {
  index: number;
  name: string;
  type: string;
  email: string;
  error?: string;
  isValid: boolean;
}

export function BulkUploadComp({ event, onImportComplete, onClose }: BulkUploadCompProps) {
  const [csvRows, setCsvRows] = useState<CSVRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Download template helper
  const downloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,attendee_name,pass_type,email\nYemi Adebayo,VIP,yemi@example.com\nAmara Okafor,GENERAL,amara@example.com\nKwame Boateng,STAFF,kwame@example.com\nDr. Kenji Sato,SPEAKER,sato@example.com\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'trmn_attendee_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple, bulletproof CSV parser
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return;

    const rows: CSVRow[] = [];
    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const nameIdx = header.indexOf('attendee_name');
    const typeIdx = header.indexOf('pass_type');
    const emailIdx = header.indexOf('email');

    // Simple backup lookup if headers differ slightly
    const lookupName = nameIdx >= 0 ? nameIdx : 0;
    const lookupType = typeIdx >= 0 ? typeIdx : 1;
    const lookupEmail = emailIdx >= 0 ? emailIdx : 2;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle commas that might be inside quotes simply
      const columns: string[] = [];
      let inQuotes = false;
      let currentVal = '';

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          columns.push(currentVal.trim().replace(/^"|"$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      columns.push(currentVal.trim().replace(/^"|"$/g, ''));

      const name = columns[lookupName] || '';
      const type = columns[lookupType] || '';
      const email = columns[lookupEmail] || '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let error = '';
      if (!name) {
        error = 'Name cannot be empty';
      } else if (email && !emailRegex.test(email)) {
        error = 'Invalid email address';
      }

      rows.push({
        index: i,
        name,
        type: type || 'GENERAL',
        email,
        error,
        isValid: !error,
      });
    }

    setCsvRows(rows);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const deleteRow = (idxToDelete: number) => {
    setCsvRows((prev) => prev.filter((r) => r.index !== idxToDelete));
  };

  // Batch process passes in sets of 10 as specified in Kwame's Sprints
  const processImport = async () => {
    const validRows = csvRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const importedList: Attendee[] = [];
    const total = validRows.length;

    // Process iteratively in batches of 10 to leave frames responsive
    const batchSize = 10;
    for (let i = 0; i < total; i += batchSize) {
      const chunk = validRows.slice(i, i + batchSize);
      
      for (const row of chunk) {
        const attendeeId = 'att-' + Math.random().toString(36).substring(2, 11);
        const codeNum = Math.floor(1000 + Math.random() * 9000);
        const passId = `EVT-2026-${codeNum}`;
        const hmac = signAttendeePass(event.id, attendeeId, event.secretKey);

        importedList.push({
          id: attendeeId,
          name: row.name,
          type: row.type.toUpperCase(),
          email: row.email,
          status: 'registered',
          passId,
          hmacSignature: hmac,
        });
      }

      const completed = Math.min(i + batchSize, total);
      setProgress(Math.round((completed / total) * 100));
      
      // Artificial minor delay to yield main thread and update visual progress bar
      await new Promise((r) => setTimeout(r, 150));
    }

    onImportComplete(importedList);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-slate-800 dark:text-slate-100 select-text">
      <div className="bg-white dark:bg-[#16152B] w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-indigo-950/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-indigo-950/20">
          <div>
            <h3 className="text-lg font-bold font-sans">CSV Bulk Attendee Registry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Import hundreds of guests into {event.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Dynamic Inner body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {csvRows.length === 0 ? (
            /* Importer drag box */
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10'
                    : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400/80 hover:bg-slate-50/50 dark:hover:bg-[#1E1D35]/30'
                }`}
              >
                <input
                  type="file"
                  id="csv-file-picker"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4 shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm mb-1 text-slate-700 dark:text-slate-200">Drag your attendee CSV file here</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Or click to select a file from your computer (.csv)</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                  3 Columns: attendee_name, pass_type, email
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#1E1D35]/40 border border-slate-100 dark:border-indigo-950/10">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-semibold text-xs text-slate-700 dark:text-slate-100">Need a baseline layout?</h5>
                    <p className="text-[10px] text-slate-400 leading-none">Download our pre-formatted sample column template.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="btn-secondary h-8 px-3 text-xs bg-white dark:bg-transparent"
                >
                  Download CSV Template
                </button>
              </div>
            </div>
          ) : (
            /* Inline Row Validation list */
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Detected <strong className="text-slate-700 dark:text-slate-200">{csvRows.length}</strong> attendee rows
                </span>
                <button
                  onClick={() => setCsvRows([])}
                  className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1 cursor-pointer"
                  disabled={isProcessing}
                >
                  Reset & Re-upload
                </button>
              </div>

              <div className="border border-slate-100 dark:border-indigo-950/20 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-[#1E1D35] text-slate-500 uppercase tracking-wider font-mono text-[10px] sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5">Guest Name</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-indigo-950/10">
                    {csvRows.map((row) => (
                      <tr
                        key={row.index}
                        className={`${
                          !row.isValid
                            ? 'bg-red-500/5 hover:bg-red-500/10 text-red-700 dark:text-red-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/10'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-medium">
                          <div className="flex items-center gap-2">
                            {row.isValid ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                            <span className="truncate max-w-[150px]">{row.name}</span>
                          </div>
                          {row.error && <p className="text-[10px] text-red-500 mt-0.5 ml-5 font-mono">{row.error}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{row.email || '—'}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => deleteRow(row.index)}
                            className="p-1 hover:text-red-500 text-slate-400 transition-colors"
                            aria-label="Delete Row"
                            disabled={isProcessing}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Process trigger and progress bar displays */}
          {isProcessing && (
            <div className="bg-indigo-50 dark:bg-[#1E1D35]/55 p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/20 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating tickets in batches of 10...
                </span>
                <span className="font-mono text-indigo-500 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-5 bg-slate-50 dark:bg-[#1E1D35] px-6 border-t border-slate-100 dark:border-indigo-950/20 flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary h-11 text-sm bg-white dark:bg-transparent"
            disabled={isProcessing}
          >
            Cancel
          </button>
          {csvRows.length > 0 && (
            <button
              type="button"
              onClick={processImport}
              className="btn-primary h-11 text-sm text-white px-6 w-auto flex items-center gap-2 shrink-0 font-semibold cursor-pointer"
              disabled={isProcessing || csvRows.filter((r) => r.isValid).length === 0}
            >
              <Check className="w-4 h-4" />
              Import {csvRows.filter((r) => r.isValid).length} Guests (Confetti Event)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
