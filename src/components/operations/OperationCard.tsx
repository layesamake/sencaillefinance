"use client";

import type { OperationWithDetails } from "@/types/database";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteOperationAction } from "@/app/(connected)/operations/actions";
import { vibrate } from "@/lib/utils/haptics";

interface OperationCardProps {
  operation: OperationWithDetails;
  onClick: () => void;
}

export default function OperationCard({ operation, onClick }: OperationCardProps) {
  const isIncome = operation.operation_type === "income";
  const amountColor = isIncome ? "text-success" : "text-danger";
  const bgBadgeColor = isIncome ? "bg-success/20 text-emerald-300" : "bg-danger/20 text-red-300";

  const sumPayments = operation.payments?.filter(p => p.status === 'active').reduce((sum, p) => sum + p.amount, 0) || 0;
  const restant = operation.total_amount - operation.initial_paid_amount - sumPayments;
  const isOverdue = restant > 0 && differenceInDays(new Date(), new Date(operation.operation_date)) > 15;
  
  const statusLabels: Record<string, string> = {
    paid: "Payé",
    credit: "À crédit",
    partial: "Partiel"
  };

  const controls = useAnimation();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -800) {
      // Swipe left - Delete
      vibrate([50, 100, 50]);
      if (confirm("Voulez-vous vraiment supprimer cette opération ?")) {
        startTransition(async () => {
          await deleteOperationAction(operation.id);
        });
      } else {
        controls.start({ x: 0 });
      }
    } else if (offset > 100 || velocity > 800) {
      // Swipe right - Edit
      vibrate(50);
      router.push(`/operations/${operation.id}/edit`);
      controls.start({ x: 0 });
    } else {
      // Snap back
      controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-1">
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 bg-surface border border-border rounded-2xl">
        <div className="flex items-center text-accent">
          <Pencil size={24} />
          <span className="ml-2 font-semibold">Modifier</span>
        </div>
        <div className="flex items-center text-danger">
          <span className="mr-2 font-semibold">Supprimer</span>
          <Trash2 size={24} />
        </div>
      </div>

      {/* Foreground Card */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={`relative z-10 bg-surface border p-4 cursor-pointer transition-colors shadow-sm rounded-2xl ${
          isOverdue 
            ? "border-danger/60 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)] hover:border-danger" 
            : "border-border hover:border-border"
        }`}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${bgBadgeColor}`}>
              {isIncome ? "Recette" : "Dépense"}
            </span>
            <h3 className="font-bold text-primary-text line-clamp-1">
              {operation.categories?.name || "Catégorie inconnue"}
            </h3>
            <p className="text-xs text-muted mt-1">
              {format(new Date(operation.operation_date), "dd MMM yyyy", { locale: fr })}
              {operation.parties?.name && ` • ${operation.parties.name}`}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-bold text-lg ${amountColor}`}>
              {isIncome ? "+" : "-"}{operation.total_amount.toLocaleString("fr-FR")} F
            </p>
            <span className="text-xs font-medium text-muted mt-1 inline-block">
              {statusLabels[operation.settlement_mode] || operation.settlement_mode}
            </span>
          </div>
        </div>

        {(restant > 0 || operation.description) && (
          <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-y-2 justify-between items-center text-xs">
            {operation.description ? (
              <p className="text-muted line-clamp-1 max-w-[60%] italic">"{operation.description}"</p>
            ) : (
              <div />
            )}
            
            {restant > 0 && (
              <span className={`font-bold ml-auto flex items-center gap-1.5 ${isOverdue ? "text-danger" : "text-warning"}`}>
                {isOverdue && <span className="text-[10px] uppercase tracking-wider bg-danger text-white px-1.5 py-0.5 rounded mr-1">En retard</span>}
                Reste: {restant.toLocaleString("fr-FR")} F
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
