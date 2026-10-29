import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { CBTQuestion, CBTTheoryQuestion } from '../../types';
import {
  downloadObjectiveTemplateExcel,
  downloadTheoryTemplateExcel,
  parseObjectiveQuestionsFromExcel,
  parseTheoryQuestionsFromExcel,
  parseObjectiveQuestionsFromText,
  parseTheoryQuestionsFromText,
} from '../../utils/cbtBulkUpload';

interface BulkQuestionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  subject?: string;
  onApplyQuestions: (
    objectiveQuestions?: CBTQuestion[],
    theoryQuestions?: CBTTheoryQuestion[],
    mode?: 'append' | 'replace'
  ) => void;
}

export const BulkQuestionUploadModal: React.FC<BulkQuestionUploadModalProps> = ({
  isOpen,
  onClose,
  examTitle,
  subject = 'General Studies',
  onApplyQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'paste'>('excel');
  const [questionType, setQuestionType] = useState<'objective' | 'theory'>('objective');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  // Parsed results
  const [parsedObjective, setParsedObjective] = useState<CBTQuestion[]>([]);
  const [parsedTheory, setParsedTheory] = useState<CBTTheoryQuestion[]>([]);
  const [pasteText, setPasteText] = useState('');
  const [fileName, setFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (!data || data.length === 0) {
          setStatusMessage({ type: 'error', text: 'The selected file is empty or contains no readable rows.' });
          return;
        }

        if (questionType === 'objective') {
          const result = parseObjectiveQuestionsFromExcel(data);
          if (result.length === 0) {
            setStatusMessage({
              type: 'error',
              text: 'Could not find objective questions in file. Please ensure column headers match the template.',
            });
          } else {
            setParsedObjective(result);
            setStatusMessage({
              type: 'success',
              text: `Successfully parsed ${result.length} Multiple Choice Objective questions! Total Marks: ${result.reduce(
                (sum, q) => sum + (q.marks || 5),
                0
              )} pts.`,
            });
          }
        } else {
          const result = parseTheoryQuestionsFromExcel(data);
          if (result.length === 0) {
            setStatusMessage({
              type: 'error',
              text: 'Could not find theory questions in file. Please ensure column headers match the template.',
            });
          } else {
            setParsedTheory(result);
            setStatusMessage({
              type: 'success',
              text: `Successfully parsed ${result.length} Theory questions! Total Marks: ${result.reduce(
                (sum, q) => sum + (q.maxMarks || 10),
                0
              )} pts.`,
            });
          }
        }
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: `Failed to read spreadsheet: ${err?.message || err}` });
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleParseText = () => {
    if (!pasteText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste question text in the box below.' });
      return;
    }

    if (questionType === 'objective') {
      const result = parseObjectiveQuestionsFromText(pasteText);
      if (result.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'No objective questions could be identified. Ensure questions are numbered (e.g. 1. ... A. ... B. ... Answer: ...)',
        });
      } else {
        setParsedObjective(result);
        setStatusMessage({
          type: 'success',
          text: `Parsed ${result.length} Objective questions from text! Total Marks: ${result.reduce(
            (sum, q) => sum + (q.marks || 5),
            0
          )} pts.`,
        });
      }
    } else {
      const result = parseTheoryQuestionsFromText(pasteText);
      if (result.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'No theory questions identified. Separate each question with a blank line.',
        });
      } else {
        setParsedTheory(result);
        setStatusMessage({
          type: 'success',
          text: `Parsed ${result.length} Theory questions from text! Total Marks: ${result.reduce(
            (sum, q) => sum + (q.maxMarks || 10),
            0
          )} pts.`,
        });
      }
    }
  };

  const handleSaveToExam = () => {
    if (questionType === 'objective') {
      if (parsedObjective.length === 0) {
        alert('No parsed objective questions to import.');
        return;
      }
      onApplyQuestions(parsedObjective, undefined, importMode);
    } else {
      if (parsedTheory.length === 0) {
        alert('No parsed theory questions to import.');
        return;
      }
      onApplyQuestions(undefined, parsedTheory, importMode);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] space-y-6 relative max-h-[92vh] overflow-y-auto my-auto animate-fade-in text-xs">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#0B3D27]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bulk Questions Importer</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0B3D27]">
              Bulk Upload Test & Exam Questions
            </h3>
            <p className="text-slate-500">
              For: <strong className="text-slate-700">{examTitle || 'Assessment Paper'}</strong> ({subject})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Target Question Section */}
        <div className="space-y-2">
          <label className="block font-bold text-[#0B3D27]">
            1. Select Assessment Question Type:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setQuestionType('objective');
                setParsedObjective([]);
                setParsedTheory([]);
                setStatusMessage(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                questionType === 'objective'
                  ? 'border-[#0B3D27] bg-emerald-50/70 text-[#0B3D27] shadow-sm ring-2 ring-[#0B3D27]/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0B3D27] flex items-center justify-center font-bold shrink-0 mt-0.5">
                A
              </div>
              <div>
                <p className="font-bold text-xs">Section A: Objective (Multiple Choice)</p>
                <p className="text-[11px] text-slate-500">Options A, B, C, D with instant scoring</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setQuestionType('theory');
                setParsedObjective([]);
                setParsedTheory([]);
                setStatusMessage(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                questionType === 'theory'
                  ? 'border-[#0B3D27] bg-emerald-50/70 text-[#0B3D27] shadow-sm ring-2 ring-[#0B3D27]/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0 mt-0.5">
                B
              </div>
              <div>
                <p className="font-bold text-xs">Section B: Theory & Essay Questions</p>
                <p className="text-[11px] text-slate-500">Open-ended working, model answers & rubrics</p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Upload Method Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-[#0B3D27]">
              2. Choose Upload Method:
            </label>

            {/* Template Download Button */}
            <button
              type="button"
              onClick={() => {
                if (questionType === 'objective') {
                  downloadObjectiveTemplateExcel(subject, examTitle);
                } else {
                  downloadTheoryTemplateExcel(subject, examTitle);
                }
              }}
              className="bg-amber-50 hover:bg-amber-100 text-[#0B3D27] border border-[#D4AF37] px-3 py-1 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Download {questionType === 'objective' ? 'Objective' : 'Theory'} Excel Template</span>
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className={`pb-2.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'excel'
                  ? 'border-[#0B3D27] text-[#0B3D27]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel / CSV Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`pb-2.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'paste'
                  ? 'border-[#0B3D27] text-[#0B3D27]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Copy & Paste Raw Text</span>
            </button>
          </div>

          {/* TAB 1: SPREADSHEET UPLOAD */}
          {activeTab === 'excel' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
                <div className="w-12 h-12 bg-[#0B3D27] text-[#D4AF37] rounded-xl flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    {fileName ? fileName : 'Click to select or drop .xlsx, .xls, or .csv file'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports Microsoft Excel, Google Sheets exports, and CSV spreadsheets
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Spreadsheet Columns:</strong>{' '}
                  {questionType === 'objective'
                    ? 'Question Statement | Option A | Option B | Option C | Option D | Correct Option (A, B, C, or D) | Marks | Explanation'
                    : 'Theory Question Statement | Max Marks | Model Answer | Marking Guidelines'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: COPY & PASTE RAW TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <textarea
                rows={6}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={
                  questionType === 'objective'
                    ? `1. What is the capital of Edo State?\nA. Warri\nB. Benin City\nC. Asaba\nD. Uromi\nAnswer: B\nMarks: 5\n\n2. Find 15% of ₦20,000.\nA. ₦2,500\nB. ₦3,000\nC. ₦3,500\nD. ₦4,000\nAnswer: B\nMarks: 5`
                    : `1. Define living things and state four characteristics with examples.\nMarks: 10\nModel Answer: Living things have life. Characteristics: Movement, Respiration, Nutrition, Growth.\n\n2. Solve 3x + 12 = 30 and show your steps.\nMarks: 10\nModel Answer: 3x = 30 - 12 = 18. x = 18 / 3 = 6.`
                }
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B3D27] bg-slate-50"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Tip: Copy directly from Microsoft Word or PDF test draft.
                </span>
                <button
                  type="button"
                  onClick={handleParseText}
                  className="bg-[#0B3D27] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Parse Questions Text</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{statusMessage.text}</p>
          </div>
        )}

        {/* Step 3: Parsed Questions Preview Table */}
        {((questionType === 'objective' && parsedObjective.length > 0) ||
          (questionType === 'theory' && parsedTheory.length > 0)) && (
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#0B3D27]">
                3. Preview Parsed Questions ({questionType === 'objective' ? parsedObjective.length : parsedTheory.length} Questions Ready)
              </h4>

              {/* Import Mode Radio */}
              <div className="flex items-center gap-3 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                  />
                  <span>Append to existing questions</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                  />
                  <span>Replace current questions</span>
                </label>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white shadow-xs">
              {questionType === 'objective'
                ? parsedObjective.map((q, idx) => (
                    <div key={q.id || idx} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B3D27]">
                          Q{idx + 1}. {q.questionText}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {q.marks} pts • Correct: {(q.correctOptionId || '').toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pl-3">
                        {q.options.map(o => (
                          <span
                            key={o.id}
                            className={
                              o.id.toLowerCase() === (q.correctOptionId || '').toLowerCase()
                                ? 'font-bold text-emerald-700 underline'
                                : ''
                            }
                          >
                            {o.id.toUpperCase()}) {o.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                : parsedTheory.map((th, idx) => (
                    <div key={th.id || idx} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B3D27]">
                          Theory Q{idx + 1}. {th.questionText}
                        </span>
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {th.maxMarks} pts
                        </span>
                      </div>
                      {th.modelAnswer && (
                        <p className="text-[11px] text-slate-600 pl-3 italic">
                          Model Answer: {th.modelAnswer}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveToExam}
            disabled={
              (questionType === 'objective' && parsedObjective.length === 0) ||
              (questionType === 'theory' && parsedTheory.length === 0)
            }
            className="px-6 py-2.5 bg-[#0B3D27] hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-[#D4AF37] font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Apply Questions to Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
