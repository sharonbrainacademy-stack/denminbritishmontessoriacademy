import * as XLSX from 'xlsx';
import { CBTQuestion, CBTTheoryQuestion } from '../types';

/**
 * Downloads a ready-to-fill Excel template for CBT Objective (Multiple Choice) questions.
 */
export function downloadObjectiveTemplateExcel(subject = 'Mathematics', examType = 'Test or Exam') {
  const sampleRows = [
    {
      'Question Number': 1,
      'Question Statement': 'What is the sum of 450 and 320?',
      'Option A': '770',
      'Option B': '870',
      'Option C': '750',
      'Option D': '670',
      'Correct Option (A, B, C, or D)': 'A',
      'Marks': 5,
      'Explanation': '450 + 320 = 770.',
    },
    {
      'Question Number': 2,
      'Question Statement': 'Which of the following is an acute angle?',
      'Option A': '90 degrees',
      'Option B': '120 degrees',
      'Option C': '45 degrees',
      'Option D': '180 degrees',
      'Correct Option (A, B, C, or D)': 'C',
      'Marks': 5,
      'Explanation': 'An acute angle is less than 90 degrees.',
    },
    {
      'Question Number': 3,
      'Question Statement': 'Find the value of x if 2x + 6 = 20.',
      'Option A': '5',
      'Option B': '7',
      'Option C': '8',
      'Option D': '10',
      'Correct Option (A, B, C, or D)': 'B',
      'Marks': 5,
      'Explanation': '2x = 20 - 6 = 14, so x = 7.',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Objective Questions');

  // Set column widths
  ws['!cols'] = [
    { wch: 15 },
    { wch: 45 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 26 },
    { wch: 10 },
    { wch: 35 },
  ];

  XLSX.writeFile(wb, `Sharon_Brain_CBT_Objective_Questions_Template_${subject}.xlsx`);
}

/**
 * Downloads a ready-to-fill Excel template for CBT Theory / Essay questions.
 */
export function downloadTheoryTemplateExcel(subject = 'Mathematics', examType = 'Test or Exam') {
  const sampleRows = [
    {
      'Question Number': 1,
      'Theory Question Statement': 'Explain the concept of fractions and show how to convert 13/4 into a mixed number with your steps.',
      'Max Marks': 10,
      'Model Answer': 'A fraction represents part of a whole. 13 divided by 4 equals 3 remainder 1. The mixed number is 3 whole and 1/4.',
      'Marking Guidelines': 'Award 4 marks for definition, 6 marks for conversion with full step-by-step arithmetic working.',
    },
    {
      'Question Number': 2,
      'Theory Question Statement': 'A rectangular classroom at Sharon Brain Academy has a length of 12 metres and width of 8 metres. Calculate the area and perimeter of the floor.',
      'Max Marks': 10,
      'Model Answer': 'Area = Length * Width = 12m * 8m = 96 sq metres. Perimeter = 2 * (12m + 8m) = 2 * 20m = 40 metres.',
      'Marking Guidelines': 'Award 5 marks for Area with units and 5 marks for Perimeter with correct formula.',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Theory Questions');

  ws['!cols'] = [
    { wch: 15 },
    { wch: 50 },
    { wch: 12 },
    { wch: 50 },
    { wch: 50 },
  ];

  XLSX.writeFile(wb, `Sharon_Brain_CBT_Theory_Questions_Template_${subject}.xlsx`);
}

/**
 * Parses raw Excel rows into CBTQuestion objects.
 */
export function parseObjectiveQuestionsFromExcel(data: any[]): CBTQuestion[] {
  const parsedQuestions: CBTQuestion[] = [];

  data.forEach((row, idx) => {
    const qText =
      row['Question Statement'] ||
      row['Question'] ||
      row['question'] ||
      row['QuestionText'] ||
      row['questionText'] ||
      row['Q'] ||
      '';

    if (!qText || String(qText).trim() === '') return;

    const optA = String(row['Option A'] || row['OptionA'] || row['A'] || row['optionA'] || 'Option A').trim();
    const optB = String(row['Option B'] || row['OptionB'] || row['B'] || row['optionB'] || 'Option B').trim();
    const optC = String(row['Option C'] || row['OptionC'] || row['C'] || row['optionC'] || 'Option C').trim();
    const optD = String(row['Option D'] || row['OptionD'] || row['D'] || row['optionD'] || 'Option D').trim();

    const rawCorrect = String(
      row['Correct Option (A, B, C, or D)'] ||
      row['Correct Option'] ||
      row['CorrectAnswer'] ||
      row['Answer'] ||
      row['correct'] ||
      'a'
    ).trim().toLowerCase();

    let correctOptionId = 'a';
    if (rawCorrect.includes('b') || rawCorrect === '2') correctOptionId = 'b';
    else if (rawCorrect.includes('c') || rawCorrect === '3') correctOptionId = 'c';
    else if (rawCorrect.includes('d') || rawCorrect === '4') correctOptionId = 'd';
    else correctOptionId = 'a';

    const marksNum = Number(row['Marks'] || row['marks'] || row['Points'] || 5) || 5;
    const explanation = String(row['Explanation'] || row['explanation'] || '').trim();

    parsedQuestions.push({
      id: `q_bulk_${Date.now()}_${idx + 1}`,
      questionText: String(qText).trim(),
      options: [
        { id: 'a', text: optA },
        { id: 'b', text: optB },
        { id: 'c', text: optC },
        { id: 'd', text: optD },
      ],
      correctOptionId,
      explanation,
      marks: marksNum,
    });
  });

  return parsedQuestions;
}

/**
 * Parses raw Excel rows into CBTTheoryQuestion objects.
 */
export function parseTheoryQuestionsFromExcel(data: any[]): CBTTheoryQuestion[] {
  const parsedQuestions: CBTTheoryQuestion[] = [];

  data.forEach((row, idx) => {
    const qText =
      row['Theory Question Statement'] ||
      row['Theory Question'] ||
      row['Question Statement'] ||
      row['Question'] ||
      row['question'] ||
      '';

    if (!qText || String(qText).trim() === '') return;

    const maxMarks = Number(row['Max Marks'] || row['Marks'] || row['marks'] || row['maxMarks'] || 10) || 10;
    const modelAnswer = String(row['Model Answer'] || row['modelAnswer'] || row['Answer'] || '').trim();
    const guidelines = String(row['Marking Guidelines'] || row['guidelines'] || row['Rubric'] || '').trim();

    parsedQuestions.push({
      id: `th_bulk_${Date.now()}_${idx + 1}`,
      questionText: String(qText).trim(),
      maxMarks,
      modelAnswer,
      guidelines,
    });
  });

  return parsedQuestions;
}

/**
 * Parses text pasted by a teacher formatted as:
 * 1. Question text
 * A. Option
 * B. Option
 * C. Option
 * D. Option
 * Answer: A
 * Marks: 5
 */
export function parseObjectiveQuestionsFromText(text: string): CBTQuestion[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const questions: CBTQuestion[] = [];

  let currentQ: Partial<CBTQuestion> | null = null;
  let currentOptions: { id: string; text: string }[] = [];

  const finalizeCurrentQ = () => {
    if (currentQ && currentQ.questionText) {
      if (currentOptions.length === 0) {
        currentOptions = [
          { id: 'a', text: 'Option A' },
          { id: 'b', text: 'Option B' },
          { id: 'c', text: 'Option C' },
          { id: 'd', text: 'Option D' },
        ];
      }
      questions.push({
        id: `q_txt_${Date.now()}_${questions.length + 1}`,
        questionText: currentQ.questionText,
        options: currentOptions,
        correctOptionId: currentQ.correctOptionId || 'a',
        explanation: currentQ.explanation || '',
        marks: currentQ.marks || 5,
      });
      currentQ = null;
      currentOptions = [];
    }
  };

  lines.forEach(line => {
    const isNewQuestionHeader = /^(\d+[\.\)]\s*|Q\d+[:\.]\s*)/i.test(line);
    const isOptA = /^[A|a][\.\)]\s*/.test(line);
    const isOptB = /^[B|b][\.\)]\s*/.test(line);
    const isOptC = /^[C|c][\.\)]\s*/.test(line);
    const isOptD = /^[D|d][\.\)]\s*/.test(line);
    const isAnswer = /^(Ans|Answer|Correct)[:\s]+/i.test(line);
    const isMarks = /^(Marks|Pts|Points)[:\s]+/i.test(line);

    if (isNewQuestionHeader) {
      finalizeCurrentQ();
      currentQ = {
        questionText: line.replace(/^(\d+[\.\)]\s*|Q\d+[:\.]\s*)/i, ''),
        marks: 5,
        correctOptionId: 'a',
      };
    } else if (isOptA) {
      currentOptions.push({ id: 'a', text: line.replace(/^[A|a][\.\)]\s*/, '') });
    } else if (isOptB) {
      currentOptions.push({ id: 'b', text: line.replace(/^[B|b][\.\)]\s*/, '') });
    } else if (isOptC) {
      currentOptions.push({ id: 'c', text: line.replace(/^[C|c][\.\)]\s*/, '') });
    } else if (isOptD) {
      currentOptions.push({ id: 'd', text: line.replace(/^[D|d][\.\)]\s*/, '') });
    } else if (isAnswer && currentQ) {
      const match = line.match(/(A|B|C|D)/i);
      if (match) {
        currentQ.correctOptionId = match[1].toLowerCase();
      }
    } else if (isMarks && currentQ) {
      const numMatch = line.match(/\d+/);
      if (numMatch) {
        currentQ.marks = Number(numMatch[0]);
      }
    } else if (currentQ) {
      // Continuation of question text
      currentQ.questionText += ' ' + line;
    }
  });

  finalizeCurrentQ();
  return questions;
}

/**
 * Parses theory questions pasted in plain text format.
 */
export function parseTheoryQuestionsFromText(text: string): CBTTheoryQuestion[] {
  const blocks = text.split(/\n\s*\n/);
  const questions: CBTTheoryQuestion[] = [];

  blocks.forEach((block, idx) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let qText = '';
    let maxMarks = 10;
    let modelAnswer = '';
    let guidelines = '';

    lines.forEach(line => {
      if (/^(Marks|Max Marks|Points)[:\s]+/i.test(line)) {
        const num = line.match(/\d+/);
        if (num) maxMarks = Number(num[0]);
      } else if (/^(Model Answer|Answer)[:\s]+/i.test(line)) {
        modelAnswer = line.replace(/^(Model Answer|Answer)[:\s]+/i, '');
      } else if (/^(Guidelines|Marking Scheme|Rubric)[:\s]+/i.test(line)) {
        guidelines = line.replace(/^(Guidelines|Marking Scheme|Rubric)[:\s]+/i, '');
      } else {
        qText += (qText ? ' ' : '') + line.replace(/^\d+[\.\)]\s*/, '');
      }
    });

    if (qText) {
      questions.push({
        id: `th_txt_${Date.now()}_${idx + 1}`,
        questionText: qText,
        maxMarks,
        modelAnswer,
        guidelines,
      });
    }
  });

  return questions;
}
