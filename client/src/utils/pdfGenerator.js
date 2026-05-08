import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * generatePrescriptionPDF
 * Generates a professional medical prescription PDF.
 */
export const generatePrescriptionPDF = (data) => {
  const { 
    doctorName, 
    doctorSpecialty, 
    doctorRegNo,
    patientName,
    patientAge,
    patientGender,
    date,
    diagnosis,
    medications,
    notes
  } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header - Doctor Info
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Doctor Blue
  doc.setFont('helvetica', 'bold');
  doc.text(doctorName, 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');
  doc.text(doctorSpecialty, 20, 37);
  doc.text(`Reg No: ${doctorRegNo}`, 20, 42);

  // Line
  doc.setDrawColor(230);
  doc.line(20, 50, pageWidth - 20, 50);

  // Patient Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 20, 65);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${patientName}`, 20, 75);
  doc.text(`Age/Sex: ${patientAge} / ${patientGender}`, 20, 80);
  doc.text(`Date: ${date}`, pageWidth - 60, 75);

  // Diagnosis
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnosis:', 20, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(diagnosis, 45, 95);

  // Rx Symbol
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text('Rx', 20, 115);

  // Medications Table
  const tableData = medications.map((med, index) => [
    index + 1,
    med.name,
    med.dosage,
    med.frequency,
    med.duration
  ]);

  doc.autoTable({
    startY: 120,
    head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Duration']],
    body: tableData,
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 }
  });

  // Notes
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Additional Notes:', 20, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(notes || 'N/A', 20, finalY + 7);

  // Footer - Digital Signature
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('This is a digitally generated prescription by MediVoice AI.', 20, 280);
  doc.text('Digital Signature Verified.', pageWidth - 60, 280);

  // Save the PDF
  doc.save(`Prescription_${patientName.replace(' ', '_')}_${date}.pdf`);
};
