import { jsPDF } from 'jspdf';
import { ResultSlip, FeePayment, Student, SchoolInfo } from '../types';

export const generateResultPDF = (result: ResultSlip, school: SchoolInfo) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const primaryGreen = [11, 61, 39]; // #0B3D27
  const gold = [212, 175, 55]; // #D4AF37
  const darkGray = [40, 40, 40];

  // Header Banner
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // School Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(school.name.toUpperCase(), 105, 12, { align: 'center' });

  // Motto / Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text(`"${school.motto}"`, 105, 18, { align: 'center' });

  // Address & Contact
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(school.address, 105, 24, { align: 'center' });
  doc.text(`Tel: ${school.phone} | Email: ${school.email}`, 105, 28, { align: 'center' });

  // Gold Accent line
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 32, 210, 2, 'F');

  // Title Box
  doc.setFillColor(249, 246, 239);
  doc.rect(14, 38, 182, 10, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.rect(14, 38, 182, 10, 'S');

  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`OFFICIAL STUDENT PERFORMANCE REPORT — ${result.term.toUpperCase()} ${result.academicSession}`, 105, 45, { align: 'center' });

  // Student Bio Grid
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 15, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(result.studentName, 45, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Admission No:', 120, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(result.admissionNo, 150, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Class Level:', 15, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(result.className, 45, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('Class Position:', 120, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.positionInClass} out of ${result.totalStudentsInClass}`, 150, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('Attendance:', 15, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.attendancePresent} / ${result.attendanceTotal} Days`, 45, 68);

  doc.setFont('helvetica', 'bold');
  doc.text('Overall Average:', 120, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.average.toFixed(1)}%`, 150, 68);

  // Table Header
  let startY = 76;
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(14, startY, 182, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SUBJECT', 18, startY + 5.5);
  doc.text('C.A (30)', 90, startY + 5.5, { align: 'center' });
  doc.text('EXAM (70)', 118, startY + 5.5, { align: 'center' });
  doc.text('TOTAL (100)', 148, startY + 5.5, { align: 'center' });
  doc.text('GRADE', 170, startY + 5.5, { align: 'center' });
  doc.text('REMARK', 188, startY + 5.5, { align: 'center' });

  startY += 8;

  // Table Rows
  result.subjects.forEach((sub, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, startY, 182, 7, 'F');
    }
    doc.setDrawColor(220, 220, 220);
    doc.line(14, startY + 7, 196, startY + 7);

    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    doc.text(sub.subject, 18, startY + 5);
    doc.text(sub.caScore.toString(), 90, startY + 5, { align: 'center' });
    doc.text(sub.examScore.toString(), 118, startY + 5, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text(sub.total.toString(), 148, startY + 5, { align: 'center' });
    
    // Grade styling
    if (sub.grade === 'A') doc.setTextColor(11, 61, 39);
    else if (sub.grade === 'B') doc.setTextColor(0, 102, 204);
    else doc.setTextColor(204, 102, 0);

    doc.text(sub.grade, 170, startY + 5, { align: 'center' });
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'italic');
    doc.text(sub.remark, 188, startY + 5, { align: 'center' });

    startY += 7;
  });

  // Summary box
  startY += 4;
  doc.setFillColor(249, 246, 239);
  doc.rect(14, startY, 182, 14, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.rect(14, startY, 182, 14, 'S');

  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`GRAND TOTAL: ${result.totalObtained} / ${result.totalPossible}`, 20, startY + 6);
  doc.text(`TERM AVERAGE: ${result.average.toFixed(2)}%`, 95, startY + 6);
  doc.text(`CLASS POSITION: ${result.positionInClass} / ${result.totalStudentsInClass}`, 150, startY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Grading Key: A (80-100% Excellent) | B (70-79% Very Good) | C (60-69% Credit) | D (50-59% Pass) | F (Below 50%)`, 20, startY + 11);

  // Remarks Section
  startY += 18;
  doc.setDrawColor(200, 200, 200);
  doc.rect(14, startY, 182, 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("CLASS TEACHER'S REMARK:", 18, startY + 6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`"${result.classTeacherRemark}"`, 18, startY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.text("PRINCIPAL'S REMARK:", 18, startY + 20);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`"${result.principalRemark}"`, 18, startY + 25);

  // Signatures
  startY += 40;
  doc.line(20, startY + 10, 75, startY + 10);
  doc.line(135, startY + 10, 190, startY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text("Class Teacher's Signature", 47.5, startY + 14, { align: 'center' });
  doc.text("Proprietor / Principal's Stamp", 162.5, startY + 14, { align: 'center' });

  // Official Seal
  doc.setDrawColor(212, 175, 55);
  doc.circle(162.5, startY + 4, 6, 'S');
  doc.setFontSize(6);
  doc.setTextColor(212, 175, 55);
  doc.text("DENMIN SEAL", 162.5, startY + 4.5, { align: 'center' });

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')} | Denmin British Montessori Academy Verification Portal`, 105, 287, { align: 'center' });

  // Save PDF
  doc.save(`${result.studentName.replace(/\s+/g, '_')}_Result_${result.term}_${result.academicSession.replace('/', '-')}.pdf`);
};

export const generateReceiptPDF = (receipt: FeePayment, school: SchoolInfo) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a5', // Compact A5 receipt
  });

  const primaryGreen = [11, 61, 39];
  const gold = [212, 175, 55];

  // Header
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, 148, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(school.name.toUpperCase(), 74, 9, { align: 'center' });
  
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(school.address, 74, 14, { align: 'center' });
  doc.text(`Phone: ${school.phone} | Official Fee Receipt`, 74, 18, { align: 'center' });

  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 22, 148, 1.5, 'F');

  // Receipt No & Date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt No: ${receipt.receiptNo}`, 10, 30);
  doc.text(`Date: ${receipt.paymentDate}`, 105, 30);

  doc.setDrawColor(200, 200, 200);
  doc.line(10, 33, 138, 33);

  // Student Details
  doc.setFontSize(8.5);
  doc.text(`Received From: ${receipt.studentName}`, 10, 40);
  doc.text(`Admission No: ${receipt.admissionNo}`, 10, 46);
  doc.text(`Class Level: ${receipt.className}`, 10, 52);
  doc.text(`Term & Session: ${receipt.term} (${receipt.session})`, 10, 58);
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 10, 64);

  // Amount Box
  doc.setFillColor(249, 246, 239);
  doc.rect(10, 70, 128, 28, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.rect(10, 70, 128, 28, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Required Fee: ₦${receipt.totalFee.toLocaleString()}`, 15, 77);
  doc.text(`Amount Paid Today: ₦${receipt.amountPaid.toLocaleString()}`, 15, 84);

  if (receipt.balance > 0) {
    doc.setTextColor(204, 0, 0);
    doc.text(`Outstanding Balance: ₦${receipt.balance.toLocaleString()}`, 15, 91);
  } else {
    doc.setTextColor(11, 61, 39);
    doc.text(`Payment Status: FULLY PAID (NIL BALANCE)`, 15, 91);
  }

  // Stamp & Sign
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text('Bursar / Accounts Dept Signature: _______________________', 10, 112);
  doc.text('Thank you for choosing Denmin British Montessori Academy.', 74, 125, { align: 'center' });

  doc.save(`Receipt_${receipt.receiptNo.replace(/\//g, '-')}.pdf`);
};
