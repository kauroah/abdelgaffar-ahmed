import { jsPDF } from 'jspdf';
import { BulletStyle, TargetRole, buildResumeData } from '../data/cvTemplates';

export function generateAndDownloadPdf(
  targetRole: TargetRole,
  includeBadges: boolean,
  bulletStyle: BulletStyle,
  portfolioUrl?: string
) {
  const resume = buildResumeData(targetRole, bulletStyle);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 34;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 8;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 12;
    }
  };

  // 1. Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  doc.text('AHMED ABDELGAFFAR', pageWidth / 2, y, { align: 'center' });
  y += 16;

  // Target Role Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(55, 48, 163);
  doc.text(resume.roleTitle.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 13;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const subLines = doc.splitTextToSize(resume.subtitle, contentWidth);
  doc.text(subLines, pageWidth / 2, y, { align: 'center' });
  y += subLines.length * 10 + 3;

  // Contact Details
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const portfolioHost = portfolioUrl ? portfolioUrl.replace(/^https?:\/\//, '') : '';
  const contactParts = [
    'Moscow, Russia',
    'ahmedabdelhady0246@gmail.com',
    '+7 (996) 846-9573',
    'github.com/kauroah',
    'credly.com/users/ahmed-abdelgaffar',
  ];
  if (portfolioHost) contactParts.push(portfolioHost);
  const contactLine = contactParts.join('  |  ');
  const contactLines = doc.splitTextToSize(contactLine, contentWidth);
  doc.text(contactLines, pageWidth / 2, y, { align: 'center' });
  y += contactLines.length * 10 + 4;

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 13;

  const renderSectionHeader = (title: string) => {
    checkPageBreak(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 3.5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  const renderBullet = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    doc.setTextColor(51, 65, 85);
    const bulletIndent = 10;
    const lines = doc.splitTextToSize(text, contentWidth - bulletIndent);
    checkPageBreak(lines.length * 10 + 3);
    doc.text('•', margin + 2, y);
    doc.text(lines, margin + bulletIndent, y);
    y += lines.length * 10 + 2;
  };

  // 2. Professional Summary
  renderSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(resume.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 10.5 + 6;

  // 3. Technical Competencies
  renderSectionHeader('Technical Competencies');
  resume.competencies.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.3);
    const labelStr = `• ${row.label}: `;
    const labelWidth = doc.getTextWidth(labelStr);
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(row.value, contentWidth - labelWidth - 4);
    checkPageBreak(textLines.length * 10 + 3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(labelStr, margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(textLines, margin + 2 + labelWidth, y);
    y += textLines.length * 10 + 2.5;
  });
  y += 4;

  // 4. Verified Certifications & Badges
  if (includeBadges) {
    renderSectionHeader('Verified Certifications & Skill Badges (13)');
    resume.badges.forEach((badgeLine) => {
      renderBullet(badgeLine);
    });
    y += 4;
  }

  // 5. Engineering Experience
  renderSectionHeader('Engineering Experience');
  resume.experiences.forEach((exp) => {
    checkPageBreak(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.company, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(100, 116, 139);
    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 10.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.2);
    doc.setTextColor(55, 48, 163);
    doc.text(exp.roleLocation, margin, y);
    y += 10.5;

    exp.bullets.forEach((b) => renderBullet(b));
    y += 4;
  });

  // 6. Selected Projects (VOID, Adam & Eve, PneumoAI, etc.)
  renderSectionHeader('Selected Projects');
  resume.projects.forEach((proj) => {
    checkPageBreak(34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.title, margin, y);
    y += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const stackLines = doc.splitTextToSize(proj.stack, contentWidth);
    doc.text(stackLines, margin, y);
    y += stackLines.length * 9.5 + 1.5;

    proj.bullets.forEach((b) => renderBullet(b));
    y += 3;
  });

  // 7. Education
  renderSectionHeader('Education & Scholarships');
  resume.education.forEach((edu) => {
    checkPageBreak(32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 23, 42);
    doc.text(edu.institution, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(100, 116, 139);
    doc.text(edu.period, pageWidth - margin, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    doc.text(edu.degree, margin, y);
    y += 9.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(100, 116, 139);
    const noteLines = doc.splitTextToSize(edu.note, contentWidth);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 9.5 + 3;
  });

  // 8. Languages
  renderSectionHeader('Languages');
  checkPageBreak(14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(51, 65, 85);
  doc.text(resume.languages, margin, y);

  doc.save(`Ahmed_Abdelgaffar_CV_${targetRole}.pdf`);
}
