"use client";

import { Download } from "lucide-react";
import type { OperationWithDetails } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ExportPdfButtonProps {
  operations: OperationWithDetails[];
}

export default function ExportPdfButton({ operations }: ExportPdfButtonProps) {
  const exportPdf = async () => {
    // Dynamic import to avoid SSR issues with jsPDF
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(18);
    doc.text("Historique des Opérations", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le ${format(new Date(), "dd MMMM yyyy à HH:mm", { locale: fr })}`, 14, 30);

    // Préparation des données
    const tableColumn = ["Date", "Type", "Catégorie", "Tiers", "Total", "Payé", "Reste"];
    const tableRows = operations.map(op => {
      const type = op.operation_type === "income" ? "Revenu" : "Dépense";
      const category = op.categories?.name || "-";
      const party = op.parties?.name || "-";
      
      const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
      const totalPaid = op.initial_paid_amount + sumPayments;
      const credit = op.total_amount - totalPaid;

      return [
        format(new Date(op.operation_date), "dd/MM/yyyy"),
        type,
        category,
        party,
        `${op.total_amount.toLocaleString("fr-FR")} F`,
        `${totalPaid.toLocaleString("fr-FR")} F`,
        `${credit.toLocaleString("fr-FR")} F`
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] }, // gris sombre
      alternateRowStyles: { fillColor: [249, 250, 251] }, // gris très clair
    });

    doc.save(`SENCAILLE_Operations_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
  };

  if (operations.length === 0) return null;

  return (
    <button
      onClick={exportPdf}
      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-gray-700"
    >
      <Download size={16} />
      <span>Exporter en PDF</span>
    </button>
  );
}
