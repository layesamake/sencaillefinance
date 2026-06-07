"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import type { OperationWithDetails } from "@/types/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ExportButtonProps {
  operations: OperationWithDetails[];
}

export default function ExportButton({ operations }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportPdf = async () => {
    setIsOpen(false);
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

    // Calcul des totaux
    const totalRevenus = operations
      .filter(op => op.operation_type === "income")
      .reduce((sum, op) => sum + op.total_amount, 0);
      
    const totalDepenses = operations
      .filter(op => op.operation_type === "expense")
      .reduce((sum, op) => sum + op.total_amount, 0);
      
    const solde = totalRevenus - totalDepenses;

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Total Revenus: ${totalRevenus.toLocaleString("fr-FR")} F`, 14, 38);
    doc.text(`Total Dépenses: ${totalDepenses.toLocaleString("fr-FR")} F`, 14, 43);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    if (solde >= 0) {
      doc.setTextColor(22, 163, 74); // green-600
    } else {
      doc.setTextColor(220, 38, 38); // red-600
    }
    doc.text(`Solde Net: ${solde.toLocaleString("fr-FR")} F`, 14, 49);
    doc.setFont("helvetica", "normal"); // reset font for table

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
      startY: 56,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] }, // gris sombre
      alternateRowStyles: { fillColor: [249, 250, 251] }, // gris très clair
    });

    doc.save(`SENCAILLE_Operations_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
  };

  const exportCsv = () => {
    setIsOpen(false);
    
    const headers = ["Date", "Type", "Catégorie", "Tiers", "Description", "Total", "Payé", "Reste"];
    
    const rows = operations.map(op => {
      const type = op.operation_type === "income" ? "Revenu" : "Dépense";
      const category = op.categories?.name || "-";
      const party = op.parties?.name || "-";
      const description = op.description ? `"${op.description.replace(/"/g, '""')}"` : "-";
      
      const sumPayments = op.payments?.filter(p => p.status === 'active').reduce((s, p) => s + p.amount, 0) || 0;
      const totalPaid = op.initial_paid_amount + sumPayments;
      const credit = op.total_amount - totalPaid;

      return [
        format(new Date(op.operation_date), "dd/MM/yyyy"),
        type,
        category,
        party,
        description,
        op.total_amount,
        totalPaid,
        credit
      ].join(";");
    });

    const csvContent = [headers.join(";"), ...rows].join("\n");
    
    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `SENCAILLE_Operations_${format(new Date(), "yyyyMMdd_HHmm")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (operations.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-surface-hover hover:bg-gray-700 text-primary-text px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-border"
      >
        <Download size={16} />
        <span>Exporter</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-border">
          <div className="py-1">
            <button
              onClick={exportPdf}
              className="flex items-center w-full px-4 py-3 text-sm text-primary-text hover:bg-surface-hover transition-colors"
            >
              <FileText size={16} className="mr-3 text-red-400" />
              Format PDF
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center w-full px-4 py-3 text-sm text-primary-text hover:bg-surface-hover transition-colors"
            >
              <FileSpreadsheet size={16} className="mr-3 text-green-500" />
              Format Excel (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
