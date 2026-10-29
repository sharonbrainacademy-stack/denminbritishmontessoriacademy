import jsPDF from 'jspdf';
import { ResultSlip, Student, FeePayment, SchoolInfo } from '../types';

export function generateResultSlipPDF(result: ResultSlip, student: Student | undefined, schoolInfo: SchoolInfo) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(schoolInfo.name.toUpperCase(), pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(schoolInfo.address, pageWidth / 2, 23, { align: 'center' });
  doc.text(`Tel: ${schoolInfo.phone} | Email: ${schoolInfo.email}`, pageWidth / 2, 29, { align: 'center' });
  doc.text(`Motto: "${schoolInfo.motto}"`, pageWidth / 2, 35, { align: 'center' });

  // Title Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(14, 46, pageWidth - 28, 12, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TERMLY COMPREHENSIVE STUDENT ASSESSMENT REPORT`, pageWidth / 2, 54, { align: 'center' });

  // Student details table
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  let y = 66;

  const leftX = 14;
  const col2X = 110;

  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(result.studentName || student?.fullName || 'N/A', leftX + 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Admission No:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(result.admissionNumber || result.admissionNo || student?.admissionNumber || student?.admissionNo || 'N/A', col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Class / Arm:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.classLevel || result.className || ''} ${student?.arm ? `(${student.arm})` : ''}`, leftX + 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Session & Term:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.session || result.academicSession || ''} - ${result.term || ''}`, col2X + 28, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.attendancePresent || 0} / ${result.attendanceTotal || 0} days`, leftX + 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Date Issued:', col2X, y);
  doc.setFont('helvetica', 'normal');
  const dateStr = result.datePublished || result.publishedAt || result.createdAt || new Date().toISOString();
  doc.text(new Date(dateStr).toLocaleDateString(), col2X + 28, y);

  // Subjects Table Header
  y += 12;
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text('SUBJECT', 18, y + 5.5);
  doc.text('1ST TEST (20)', 75, y + 5.5);
  doc.text('2ND TEST (20)', 105, y + 5.5);
  doc.text('EXAM (60)', 135, y + 5.5);
  doc.text('TOTAL (100)', 158, y + 5.5);
  doc.text('GRADE', 182, y + 5.5);

  // Table rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  let rowBg = false;
  (result.subjects || []).forEach((subj) => {
    if (rowBg) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 7, 'F');
    }
    rowBg = !rowBg;

    doc.text(subj.subjectName || subj.subject || '', 18, y + 5);
    doc.text((subj.firstTest ?? subj.caScore ?? 0).toString(), 82, y + 5);
    doc.text((subj.secondTest ?? 0).toString(), 112, y + 5);
    doc.text((subj.examScore ?? 0).toString(), 142, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.text((subj.total ?? 0).toString(), 165, y + 5);
    doc.text(subj.grade || '-', 185, y + 5);
    doc.setFont('helvetica', 'normal');

    y += 7;
  });

  // Summary section
  y += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const totalScoreVal = result.totalScore ?? result.totalObtained ?? 0;
  const avgVal = result.averageScore ?? result.average ?? 0;
  doc.text(`Total Score: ${totalScoreVal} / ${(result.subjects?.length || 1) * 100}`, 20, y + 6);
  doc.text(`Average: ${avgVal.toFixed(1)}%`, 95, y + 6);
  doc.text(`Class Position: ${result.position || result.positionInClass || 'N/A'}`, 155, y + 6);

  // Remarks
  y += 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text("Teacher's Remark:", 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(result.teacherRemarks || result.classTeacherRemark || 'Consistent performance. Keep it up!', 50, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text("Principal's Remark:", 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(result.principalRemarks || result.principalRemark || 'Approved. Good academic focus.', 50, y);

  // Signatures
  y += 18;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y, 70, y);
  doc.line(pageWidth - 75, y, pageWidth - 25, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Class Teacher Signature', 30, y + 4);
  doc.text('Principal / Administrator', pageWidth - 65, y + 4);

  // Footer note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Official generated document of ${schoolInfo.name}. Any alteration invalidates this result.`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  doc.save(`${(result.studentName || 'Student').replace(/\s+/g, '_')}_Result_${result.term}.pdf`);
}

export function generatePaymentReceiptPDF(payment: FeePayment, student: Student | undefined, schoolInfo: SchoolInfo) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(schoolInfo.name.toUpperCase(), pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(schoolInfo.address, pageWidth / 2, 21, { align: 'center' });
  doc.text(`Official School Fee Receipt | Tel: ${schoolInfo.phone}`, pageWidth / 2, 27, { align: 'center' });

  // Receipt meta
  let y = 48;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`RECEIPT NO: ${payment.receiptNo}`, 16, y);
  doc.text(`DATE: ${payment.paymentDate}`, pageWidth - 60, y);

  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(16, y, pageWidth - 16, y);

  // Student and Payment info
  y += 10;
  doc.setFontSize(9);
  doc.text('Student Name:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.studentName || student?.fullName || 'N/A', 50, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Admission Number:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.admissionNumber || payment.admissionNo || student?.admissionNumber || student?.admissionNo || 'N/A', 50, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Class:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.classLevel || payment.className || '', 50, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Session / Term:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${payment.session} (${payment.term})`, 50, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.paymentMethod.toUpperCase(), 50, y);

  // Amount box
  y += 14;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.rect(16, y, pageWidth - 32, 22, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text('AMOUNT PAID:', 24, y + 9);
  doc.setFontSize(16);
  doc.text(`NGN ${(payment.amountPaid || 0).toLocaleString()}`, 24, y + 17);

  const balanceVal = payment.balanceRemaining ?? payment.balance ?? 0;
  if (balanceVal > 0) {
    doc.setFontSize(10);
    doc.setTextColor(185, 28, 28);
    doc.text(`Outstanding Balance: NGN ${balanceVal.toLocaleString()}`, 110, y + 14);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text('STATUS: FULLY PAID', 120, y + 14);
  }

  y += 34;
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.text(`Received by: ${payment.recordedBy || 'Bursary Department'}`, 16, y);

  y += 18;
  doc.line(pageWidth - 75, y, pageWidth - 20, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Authorized Bursar / Stamp', pageWidth - 65, y + 5);

  doc.save(`Receipt_${payment.receiptNo}_${(payment.studentName || 'Student').replace(/\s+/g, '_')}.pdf`);
}
