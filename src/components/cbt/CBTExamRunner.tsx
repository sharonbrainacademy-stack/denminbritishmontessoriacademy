import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  BookOpen,
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CBTExam, CBTAttempt, Student } from '../../types';

interface CBTExamRunnerProps {
  exam: CBTExam;
  student: Student;
  onComplete: (attempt: Omit<CBTAttempt, 'id'>) => void;
  onCancel: () => void;
}

export const CBTExamRunner: React.FC<CBTExamRunnerProps> = ({
  exam,
  student,
  onComplete,
  onCancel,
}) => {
  const [activeSection, setActiveSection] = useState<'objective' | 'theory'>('objective');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);

  // Objective answers: map question id -> chosen option (0, 1, 2, 3)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  // Theory answers: map question id -> typed student answer string
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});

  // Timer in seconds
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentObjQuestion = exam.questions[currentQuestionIndex];
  const currentTheoryQuestion = exam.theoryQuestions?.[currentTheoryIndex];

  const handleSelectOption = (qId: string, optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optIndex,
    }));
  };

  const handleTheoryTextChange = (qId: string, text: string) => {
    setTheoryAnswers((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    exam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += q.marks;
      }
    });
    return score;
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);
    const objScore = calculateScore();
    const theoryCount = exam.theoryQuestions?.length || 0;

    // Check if confetti can trigger
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const attemptData: Omit<CBTAttempt, 'id'> = {
      examId: exam.id,
      examTitle: exam.title,
      assessmentType: exam.assessmentType || 'exam',
      subject: exam.subject,
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      classLevel: student.classLevel,
      score: objScore,
      totalPossibleMarks: exam.totalMarks,
      percentage: Math.round((objScore / (exam.totalMarks || 1)) * 100),
      passed: objScore >= (exam.passMark || Math.round(exam.totalMarks * 0.5)),
      answers: selectedAnswers,
      theoryAnswers: theoryAnswers,
      theoryScoreAwarded: 0, // initially 0 until teacher grades
      theoryGraded: theoryCount === 0, // already graded if no theory
      theoryStatus: theoryCount > 0 ? 'pending_review' : 'not_applicable',
      completedAt: new Date().toISOString(),
      durationSpentMinutes: Math.ceil((exam.durationMinutes * 60 - timeLeft) / 60),
    };

    onComplete(attemptData);
  };

  const totalQuestions = exam.questions.length;
  const answeredObjCount = Object.keys(selectedAnswers).length;
  const theoryQuestionsCount = exam.theoryQuestions?.length || 0;
  const answeredTheoryCount = Object.keys(theoryAnswers).filter((k) => theoryAnswers[k]?.trim()).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {exam.assessmentType ? exam.assessmentType.toUpperCase().replace('_', ' ') : 'CBT ASSESSMENT'}
              </span>
              <h2 className="text-base sm:text-lg font-bold">{exam.title}</h2>
            </div>
            <p className="text-xs text-slate-400">
              Candidate: <span className="text-white font-semibold">{student.fullName}</span> ({student.admissionNumber}) &bull; {student.classLevel}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
              timeLeft < 300
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Exam
            </button>
          </div>
        </div>

        {/* Section switcher if exam has theory questions */}
        {theoryQuestionsCount > 0 && (
          <div className="max-w-6xl mx-auto mt-3 pt-3 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={() => setActiveSection('objective')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                activeSection === 'objective'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Section A: Objective ({answeredObjCount}/{totalQuestions})
            </button>
            <button
              onClick={() => setActiveSection('theory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                activeSection === 'theory'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Section B: Theory / Essay ({answeredTheoryCount}/{theoryQuestionsCount})
            </button>
          </div>
        )}
      </header>

      {/* Main question canvas */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 flex-1">
        {activeSection === 'objective' ? (
          /* SECTION A: OBJECTIVE */
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
            {currentObjQuestion ? (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Marks: {currentObjQuestion.marks}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                  {currentObjQuestion.question}
                </h3>

                {/* Options A, B, C, D */}
                <div className="space-y-3 mb-8">
                  {currentObjQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentObjQuestion.id] === idx;
                    const letter = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentObjQuestion.id, idx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation row */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <div className="hidden sm:flex gap-1.5 overflow-x-auto max-w-xs px-2 py-1">
                    {exam.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition ${
                          idx === currentQuestionIndex
                            ? 'bg-slate-900 text-white ring-2 ring-emerald-500'
                            : selectedAnswers[q.id] !== undefined
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : theoryQuestionsCount > 0 ? (
                    <button
                      onClick={() => setActiveSection('theory')}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      Go to Section B <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      Submit Exam <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No objective questions in this exam.</p>
            )}
          </div>
        ) : (
          /* SECTION B: THEORY / ESSAY */
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
            {currentTheoryQuestion ? (
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                    Theory Question {currentTheoryIndex + 1} of {theoryQuestionsCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Max Marks: {currentTheoryQuestion.maxMarks}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {currentTheoryQuestion.question}
                  </h3>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Your Written Answer / Solution:
                  </label>
                  <textarea
                    rows={8}
                    value={theoryAnswers[currentTheoryQuestion.id] || ''}
                    onChange={(e) => handleTheoryTextChange(currentTheoryQuestion.id, e.target.value)}
                    placeholder="Type your complete written answer, workings, definitions, or essay here..."
                    className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans text-sm leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Answers are automatically saved for teacher marking.</span>
                    <span>
                      {(theoryAnswers[currentTheoryQuestion.id] || '').split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>

                {/* Theory nav buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    disabled={currentTheoryIndex === 0}
                    onClick={() => setCurrentTheoryIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Theory
                  </button>

                  <div className="flex gap-1.5">
                    {exam.theoryQuestions?.map((tq, idx) => (
                      <button
                        key={tq.id}
                        onClick={() => setCurrentTheoryIndex(idx)}
                        className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition ${
                          idx === currentTheoryIndex
                            ? 'bg-slate-900 text-white ring-2 ring-purple-500'
                            : theoryAnswers[tq.id]?.trim()
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  {currentTheoryIndex < theoryQuestionsCount - 1 ? (
                    <button
                      onClick={() => setCurrentTheoryIndex((prev) => Math.min(theoryQuestionsCount - 1, prev + 1))}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      Next Theory <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      Submit Exam <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No theory questions configured.</p>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">
              Ready to Submit Your Exam?
            </h3>

            <p className="text-xs text-slate-600 text-center mb-6">
              You have answered <span className="font-bold text-slate-900">{answeredObjCount} of {totalQuestions}</span> objective questions
              {theoryQuestionsCount > 0 && (
                <> and <span className="font-bold text-slate-900">{answeredTheoryCount} of {theoryQuestionsCount}</span> theory questions</>
              )}.
              Once submitted, you cannot change your answers.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
