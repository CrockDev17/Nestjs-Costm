import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Diplome } from '../../domain/entities/Diplome';

const NAVY: [number, number, number] = [17, 42, 78];
const GOLD: [number, number, number] = [190, 145, 54];
const CREAM: [number, number, number] = [250, 247, 238];
const MUTED: [number, number, number] = [92, 99, 110];

function formatDate(value?: string | null): string {
  if (!value) return 'Non renseignée';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function drawLaurel(
  pdf: jsPDF,
  centerX: number,
  centerY: number,
  direction: -1 | 1,
) {
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.45);

  const startX = centerX;
  const endX = centerX + direction * 13;

  pdf.line(startX, centerY + 8, endX, centerY - 8);

  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const x = centerX + direction * 13 * t;
    const y = centerY + 8 - 16 * t;

    pdf.ellipse(
      x - direction * 2,
      y - 1.5,
      2.8,
      1.15,
      'S',
    );
  }
}

export async function generateCertificatePdf(
  diplome: Diplome,
): Promise<void> {
  if (!diplome.reference) {
    throw new Error('La référence du diplôme est obligatoire.');
  }

  const verificationUrl = new URL(
    `/verify/${encodeURIComponent(diplome.reference)}`,
    window.location.origin,
  ).toString();

  const qrCode = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 320,
    color: {
      dark: '#112A4E',
      light: '#FFFFFF',
    },
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 297;
  const pageHeight = 210;

  const prenom = diplome.etudiant?.prenom ?? '';
  const nom = diplome.etudiant?.nom ?? '';
  const nomComplet = `${prenom} ${nom}`.trim() || 'Étudiant non renseigné';
  const programme = diplome.programme?.nom ?? 'Non renseigné';
  const dateObtention = formatDate(diplome.dateObtention);

  // Fond crème
  pdf.setFillColor(...CREAM);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Double bordure bleu marine et or
  pdf.setDrawColor(...NAVY);
  pdf.setLineWidth(1.1);
  pdf.rect(7, 7, 283, 196);

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.45);
  pdf.rect(10, 10, 277, 190);

  // Petits ornements aux quatre coins
  pdf.setFillColor(...GOLD);
  for (const [x, y] of [
    [15, 15],
    [282, 15],
    [15, 195],
    [282, 195],
  ]) {
    pdf.circle(x, y, 1.4, 'F');
  }

  // En-tête institutionnel
  pdf.setTextColor(...NAVY);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(19);
  pdf.text('COSTM', 24, 25);

  pdf.setFont('times', 'normal');
  pdf.setFontSize(8);
  pdf.text(
    "Centre d’Orientation",
    24,
    31,
  );
  pdf.text('Système Technologie Moderne', 24, 35);

  pdf.setFont('times', 'italic');
  pdf.setFontSize(9);
  pdf.text('Connectez-vous à votre avenir', 273, 27, {
    align: 'right',
  });

  // Ligne décorative
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.65);
  pdf.line(24, 42, 273, 42);

  // Titre principal
  pdf.setTextColor(...NAVY);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(30);
  pdf.text('DIPLÔME', pdf.internal.pageSize.getWidth() / 2, 58, { align: 'center' });

  pdf.setTextColor(...GOLD);
  pdf.setFontSize(12);
  pdf.text('DE FIN DE FORMATION', pdf.internal.pageSize.getWidth() / 2, 67, { align: 'center' });

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(105, 72, 192, 72);

  // Texte central
  pdf.setTextColor(...NAVY);
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  pdf.text('Le présent diplôme est décerné à', pageWidth / 2, 82, {
    align: 'center',
  });

  pdf.setFont('times', 'italic');
  pdf.setFontSize(25);
  pdf.text(nomComplet, pageWidth / 2, 96, {
    align: 'center',
    maxWidth: 220,
  });

  pdf.setDrawColor(...GOLD);
  pdf.line(66, 101, 231, 101);

  pdf.setFont('times', 'normal');
  pdf.setFontSize(10.5);
  pdf.text(
    "pour avoir satisfait aux exigences du programme de formation",
    pageWidth / 2,
    109,
    { align: 'center' },
  );
  pdf.text(
    'et validé les conditions de délivrance du diplôme.',
    pageWidth / 2,
    115,
    { align: 'center' },
  );

  pdf.setFontSize(11);
  pdf.text(`Programme : ${programme}`, pageWidth / 2, 125, {
    align: 'center',
    maxWidth: 210,
  });
  pdf.text(
    `Date d’obtention : ${dateObtention}`,
    pageWidth / 2,
    132,
    { align: 'center' },
  );

  // Médaillon décoratif au centre inférieur
  pdf.setFillColor(238, 224, 185);
  pdf.circle(pageWidth / 2, 157, 13, 'F');

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(1.2);
  pdf.circle(pageWidth / 2, 157, 13, 'S');
  pdf.setLineWidth(0.45);
  pdf.circle(pageWidth / 2, 157, 10.5, 'S');

  drawLaurel(pdf, pageWidth / 2 - 8, 157, -1);
  drawLaurel(pdf, pageWidth / 2 + 8, 157, 1);

  pdf.setTextColor(...NAVY);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(10);
  pdf.text('C', pageWidth / 2, 159.5, {
    align: 'center',
  });

  // Référence et QR code de vérification
  pdf.setTextColor(...MUTED);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('RÉFÉRENCE DU DIPLÔME', 242, 143, {
    align: 'center',
  });

  pdf.setTextColor(...NAVY);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text(diplome.reference, 242, 148, {
    align: 'center',
    maxWidth: 45,
  });

  pdf.addImage(qrCode, 'PNG', 230, 151, 24, 24);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('Scanner pour vérifier', 242, 178, {
    align: 'center',
  });
  pdf.text("l'authenticité", 242, 182, {
    align: 'center',
  });

  // Emplacements de signature : à signer par les responsables autorisés
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.45);
  pdf.line(30, 169, 83, 169);
  pdf.line(100, 169, 153, 169);

  pdf.setTextColor(...NAVY);
  pdf.setFont('times', 'normal');
  pdf.setFontSize(9);
  pdf.text('Le Directeur', 56.5, 175, {
    align: 'center',
  });
  pdf.text('Le Responsable pédagogique', 126.5, 175, {
    align: 'center',
  });

  // Pied de page
  pdf.setDrawColor(...GOLD);
  pdf.line(24, 188, 273, 188);

  pdf.setTextColor(...MUTED);
  pdf.setFont('times', 'italic');
  pdf.setFontSize(8);
  pdf.text(
    'Document délivré par le COSTM — Vérification en ligne par référence.',
    pageWidth / 2,
    194,
    { align: 'center' },
  );

  pdf.save(`diplome-${diplome.reference}.pdf`);
}
