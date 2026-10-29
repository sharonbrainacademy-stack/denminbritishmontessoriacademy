import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  BookOpen,
  Award,
  ShieldAlert,
  FileText,
  HelpCircle,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CBTExam, CBTAttempt, Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';

interface CBTExamRunnerProps {
  exam: CBTExam;
  student: Student;
  onClose: () => void;
}

export const CBTExamRunner: React.FC<CBTExamRunnerProps> = ({ exam, student, onClose }) => {
  const { recordCBTAttempt, isOffline } = useSchool();

  const hasTheory = Boolean(exam.theoryQuestions && exam.theoryQuestions.length > 0);
  const [activeSection, setActiveSection] = useState<'objective' | 'theory'>('objective');

  // Objective state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Theory state
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, string>>({});
  const [currentTheoryIdx, setCurrentTheoryIdx] = useState(0);

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);

  const [completedAttempt, setCompletedAttempt] = useState<CBTAttempt | null>(null);

  // Timer Countdown Effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Anti-Cheat Tab Switching Detector
  useEffect(() => {
    if (!exam.preventTabSwitch || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const updated = prev + 1;
          setShowCheatWarning(true);
          if (updated >= 3) {
            handleAutoSubmit();
          }
          return updated;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [exam.preventTabSwitch, isSubmitted]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleTheoryAnswerChange = (questionId: string, text: string) => {
    if (isSubmitted) return;
    setTheoryAnswers(prev => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleAutoSubmit = () => {
    if (isSubmitted) return;

    // Calculate Objective score
    let objScore = 0;
    exam.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        objScore += q.marks;
      }
    });

    const objTotalMarks = exam.objectiveMarks || exam.questions.reduce((sum, q) => sum + q.marks, 0);
    const thTotalMarks = exam.theoryMarks || (exam.theoryQuestions ? exam.theoryQuestions.reduce((sum, t) => sum + t.maxMarks, 0) : 0);
    const totalExamMarks = exam.totalMarks || (objTotalMarks + thTotalMarks);

    // Initial total score is objective score; theory score will be added once graded by teacher
    const percentage = Math.round((objScore / objTotalMarks) * 100);
    const passed = percentage >= exam.passingScorePercent;

    const attemptData: Omit<CBTAttempt, 'id'> = {
      examId: exam.id,
      examTitle: exam.title,
      assessmentType: exam.assessmentType || 'exam',
      subject: exam.subject,
      term: exam.term || '1st Term',
      academicSession: exam.academicSession || '2024/2025',
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      scoreObtained: objScore,
      totalMarks: totalExamMarks,
      objectiveScore: objScore,
      objectiveTotalMarks: objTotalMarks,
      theoryScore: 0,
      theoryTotalMarks: thTotalMarks,
      theoryAnswers,
      theoryScores: {},
      theoryFeedback: {},
      theoryGraded: !hasTheory,
      publishedToParents: true,
      percentage,
      passed,
      startedAt: new Date(Date.now() - (exam.durationMinutes * 60 - timeLeftSeconds) * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      tabSwitchCount,
      answers: selectedAnswers,
    };

    recordCBTAttempt(attemptData);

    const resultAttempt: CBTAttempt = {
      ...attemptData,
      id: `att_${Date.now()}`,
    };

    setCompletedAttempt(resultAttempt);
    setIsSubmitted(true);

    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAssessmentTypeBadge = (type?: string) => {
    switch (type) {
      case '1st_test':
        return { label: '📝 1st Continuous Assessment (1st Test)', bg: 'bg-blue-600 text-white' };
      case '2nd_test':
        return { label: '📝 2nd Continuous Assessment (2nd Test)', bg: 'bg-amber-600 text-white' };
      case 'exam':
      default:
        return { label: '🎓 Terminal Examination (Main Exam)', bg: 'bg-purple-600 text-white' };
    }
  };

  const typeBadge = getAssessmentTypeBadge(exam.assessmentType);
  const currentQuestion = exam.questions[currentQuestionIdx];
  const currentTheoryQuestion = exam.theoryQuestions && exam.theoryQuestions.length > 0 
    ? exam.theoryQuestions[currentTheoryIdx] 
    : null;

  // Submitted view
  if (isSubmitted && completedAttempt) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-[#D4AF37] shadow-2xl max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Score Header */}
        <div className={`p-8 rounded-2xl text-center space-y-3 ${
          completedAttempt.passed
            ? 'bg-emerald-900 text-white border-2 border-[#D4AF37]'
            : 'bg-red-950 text-white border-2 border-red-500'
        }`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg bg-[#D4AF37] text-[#0B3D27] font-bold">
            {completedAttempt.passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10 text-red-900" />}
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-[#F9F6EF]">
            {typeBadge.label}
          </div>

          <h2 className="text-3xl font-bold font-serif text-[#F9F6EF]">
            {completedAttempt.passed ? 'Assessment Completed Successfully 🎉' : 'Assessment Submitted'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto py-3">
            <div className="bg-emerald-950/80 p-3 rounded-xl border border-[#D4AF37]/40">
              <span className="text-[11px] text-emerald-200 block uppercase font-semibold">Section A (Objective)</span>
              <p className="text-2xl font-bold text-[#D4AF37] font-serif">
                {completedAttempt.objectiveScore} / {completedAttempt.objectiveTotalMarks}
              </p>
              <p className="text-[10px] text-emerald-300">Auto-graded Instant Score</p>
            </div>

            <div className="bg-emerald-950/80 p-3 rounded-xl border border-[#D4AF37]/40">
              <span className="text-[11px] text-emerald-200 block uppercase font-semibold">Section B (Theory)</span>
              <p className="text-lg font-bold text-[#D4AF37] font-serif">
                {completedAttempt.theoryTotalMarks > 0 ? (
                  completedAttempt.theoryGraded 
                    ? `${completedAttempt.theoryScore} / ${completedAttempt.theoryTotalMarks}`
                    : `${Object.keys(theoryAnswers).length} Answers Submitted`
                ) : 'No Theory Section'}
              </p>
              <p className="text-[10px] text-emerald-300">
                {completedAttempt.theoryTotalMarks > 0 
                  ? (completedAttempt.theoryGraded ? 'Teacher Graded' : 'Pending Educator Review') 
                  : 'N/A'}
              </p>
            </div>
          </div>

          <p className="text-xs text-emerald-100 italic">
            Student: <strong>{student.fullName}</strong> ({student.admissionNo}) — Pass Mark: {exam.passingScorePercent}%
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/90 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Score & test records saved and accessible on the Parent & Student Portal</span>
            </span>
          </div>

          {completedAttempt.tabSwitchCount > 0 && (
            <div className="mt-2 text-[11px] bg-red-900/80 text-red-200 p-2 rounded-lg inline-block border border-red-500">
              ⚠️ Anti-cheat tab switch flags recorded: {completedAttempt.tabSwitchCount} times.
            </div>
          )}
        </div>

        {/* Section A: Objective Question Review */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-serif text-[#0B3D27] flex items-center gap-2 border-b border-slate-200 pb-3">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <span>Section A: Objective Questions & Explanations</span>
          </h3>

          <div className="space-y-4">
            {exam.questions.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isCorrect ? 'bg-emerald-50/60 border-emerald-300' : 'bg-red-50/60 border-red-300'
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-[#0B3D27]">
                      Question {idx + 1} ({q.marks} Marks)
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-800">{q.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map(opt => {
                      const isSelected = selectedOpt === opt.id;
                      const isRightOption = q.correctOptionId === opt.id;

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs font-medium ${
                            isRightOption
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                              : isSelected
                              ? 'bg-red-100 border-red-400 text-red-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="mr-1.5 font-bold">
                            {isRightOption ? '✓' : isSelected ? '✗' : '•'}
                          </span>
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-0.5">
                      <p className="font-bold">Explanation:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section B: Theory Review */}
        {hasTheory && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold font-serif text-[#0B3D27] flex items-center gap-2 border-b border-slate-200 pb-3">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              <span>Section B: Theory / Written Answers Review</span>
            </h3>

            <div className="space-y-4">
              {exam.theoryQuestions?.map((tq, idx) => (
                <div key={tq.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0B3D27]">
                      Theory Question {idx + 1} ({tq.maxMarks} Marks)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      Educator Grading Required
                    </span>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-800">{tq.questionText}</p>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Your Submitted Answer:</span>
                    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {theoryAnswers[tq.id] || <span className="italic text-slate-400">No written answer submitted for this question.</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={onClose}
            className="bg-[#0B3D27] hover:bg-emerald-900 text-[#D4AF37] font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md"
          >
            Return to CBT & Results Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#D4AF37] shadow-2xl max-w-5xl mx-auto space-y-6">
      {/* Top Status Bar */}
      <div className="bg-[#0B3D27] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-[#D4AF37]/40">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif font-bold text-base text-[#F9F6EF]">{exam.title}</h3>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${typeBadge.bg}`}>
              {typeBadge.label}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isOffline ? 'bg-amber-400 text-amber-950 border-amber-300' : 'bg-emerald-800 text-[#D4AF37] border-[#D4AF37]/40'
            }`}>
              {isOffline ? 'OFFLINE CBT MODE' : 'ONLINE SYNC ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Student: <strong>{student.fullName}</strong> ({student.admissionNo}) — {student.className}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold shadow ${
            timeLeftSeconds < 300 ? 'bg-red-600 text-white animate-pulse' : 'bg-[#D4AF37] text-[#0B3D27]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={handleAutoSubmit}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Assessment</span>
          </button>
        </div>
      </div>

      {/* Section Switcher Tabs (if theory exists) */}
      {hasTheory && (
        <div className="flex border-b border-slate-200 text-xs font-bold gap-3">
          <button
            onClick={() => setActiveSection('objective')}
            className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeSection === 'objective'
                ? 'border-[#0B3D27] text-[#0B3D27] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Section A: Objective Questions ({exam.questions.length})</span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
              {Object.keys(selectedAnswers).length}/{exam.questions.length} answered
            </span>
          </button>

          <button
            onClick={() => setActiveSection('theory')}
            className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeSection === 'theory'
                ? 'border-[#0B3D27] text-[#0B3D27] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#D4AF37]" />
            <span>Section B: Theory / Written ({exam.theoryQuestions?.length})</span>
            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">
              {Object.keys(theoryAnswers).filter(k => theoryAnswers[k]?.trim()).length}/{exam.theoryQuestions?.length} answered
            </span>
          </button>
        </div>
      )}

      {/* Anti-Cheat Tab Switch Warning Banner */}
      {showCheatWarning && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 rounded-xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span>
              ANTI-CHEAT WARNING! Tab-switching detected ({tabSwitchCount}/3). Leaving the exam window may lead to automatic failure!
            </span>
          </div>
          <button onClick={() => setShowCheatWarning(false)} className="underline text-xs">Dismiss</button>
        </div>
      )}

      {/* SECTION A: OBJECTIVE VIEW */}
      {activeSection === 'objective' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Current Question Box */}
          <div className="lg:col-span-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-[#0B3D27] uppercase tracking-wider">
                Section A — Question {currentQuestionIdx + 1} of {exam.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {currentQuestion?.marks || 5} Marks
                </span>
                {currentQuestion && (
                  <button
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {flaggedQuestions[currentQuestion.id] ? '🚩 Flagged' : '🏳️ Flag Question'}
                  </button>
                )}
              </div>
            </div>

            {currentQuestion && (
              <>
                <h4 className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                  {currentQuestion.questionText}
                </h4>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map(opt => {
                    const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#0B3D27] text-white border-[#0B3D27] shadow-md font-bold'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-[#D4AF37] hover:bg-emerald-50/50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-[#D4AF37] text-[#0B3D27] border-[#D4AF37]' : 'border-slate-300 text-slate-600'
                          }`}>
                            {opt.id.slice(-1).toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="px-5 py-2 bg-[#0B3D27] text-[#D4AF37] font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-900 shadow"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : hasTheory ? (
                <button
                  onClick={() => setActiveSection('theory')}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold text-xs rounded-xl flex items-center gap-1 shadow"
                >
                  <span>Proceed to Section B (Theory)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAutoSubmit}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-500 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Exam Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Question Palette / Navigator */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold font-serif text-[#0B3D27] uppercase tracking-wider">
              Objective Navigator Palette
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isCurrent = currentQuestionIdx === idx;
                const isFlagged = Boolean(flaggedQuestions[q.id]);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all relative border ${
                      isCurrent
                        ? 'ring-2 ring-[#D4AF37] bg-[#0B3D27] text-white'
                        : isAnswered
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 text-[10px]">🚩</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-200 border border-slate-300 rounded" />
                <span>Unanswered ({exam.questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px]">🚩</span>
                <span>Flagged for review ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
            </div>

            {hasTheory && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveSection('theory')}
                  className="w-full py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Switch to Theory Section</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION B: THEORY VIEW */}
      {activeSection === 'theory' && hasTheory && currentTheoryQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Theory Question Prompt and Textarea */}
          <div className="lg:col-span-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-[#0B3D27] uppercase tracking-wider">
                Section B (Theory) — Question {currentTheoryIdx + 1} of {exam.theoryQuestions!.length}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 font-bold">
                {currentTheoryQuestion.maxMarks} Marks
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-base font-semibold text-slate-800 leading-relaxed">
                {currentTheoryQuestion.questionText}
              </h4>
              {currentTheoryQuestion.guidelines && (
                <p className="text-xs text-slate-500 italic">
                  💡 Hint / Guideline: {currentTheoryQuestion.guidelines}
                </p>
              )}
            </div>

            {/* Textarea for student's written response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0B3D27] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Type Your Detailed Answer / Working:</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {(theoryAnswers[currentTheoryQuestion.id] || '').split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={7}
                value={theoryAnswers[currentTheoryQuestion.id] || ''}
                onChange={e => handleTheoryAnswerChange(currentTheoryQuestion.id, e.target.value)}
                placeholder="Write your step-by-step explanations, definitions, calculations, or descriptions clearly here..."
                className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-800 focus:ring-2 focus:ring-[#0B3D27] outline-none bg-white leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 italic">
                * Note: Your answers are saved automatically as you type. Your subject educator will review and grade this theory section.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                disabled={currentTheoryIdx === 0}
                onClick={() => setCurrentTheoryIdx(prev => prev - 1)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Theory Q</span>
              </button>

              {currentTheoryIdx < exam.theoryQuestions!.length - 1 ? (
                <button
                  onClick={() => setCurrentTheoryIdx(prev => prev + 1)}
                  className="px-5 py-2 bg-[#0B3D27] text-[#D4AF37] font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-900 shadow"
                >
                  <span>Next Theory Q</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAutoSubmit}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-500 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Entire Assessment</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Theory Palette & Overview */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold font-serif text-[#0B3D27] uppercase tracking-wider">
              Theory Questions Navigator
            </h4>

            <div className="space-y-2">
              {exam.theoryQuestions!.map((tq, idx) => {
                const ans = theoryAnswers[tq.id];
                const isAnswered = Boolean(ans && ans.trim().length > 0);
                const isCurrent = currentTheoryIdx === idx;

                return (
                  <button
                    key={tq.id}
                    onClick={() => setCurrentTheoryIdx(idx)}
                    className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-[#0B3D27] bg-[#0B3D27] text-white'
                        : isAnswered
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">Theory Question #{idx + 1}</span>
                      <span className="text-[10px] opacity-80">{tq.maxMarks} Marks</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isAnswered 
                        ? (isCurrent ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900') 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isAnswered ? 'Answered ✓' : 'Empty'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveSection('objective')}
                className="w-full py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                <BookOpen className="w-4 h-4" />
                <span>Back to Section A (Objective)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
