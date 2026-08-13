"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PageSection, SectionKey } from "@/lib/types";
import { updatePageSections } from "./actions";

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero Banner",
  value_props: "Value Props",
  pricing: "Pricing Table (3D unit cards)",
  bank_details: "Bank Details",
  stats: "Stats (Important Information)",
  news: "Latest News",
  construction_sites: "Construction Sites (map cards)",
  partners: "Partners & Sister Companies",
};

function SortableRow({ section, onToggle }: { section: PageSection; onToggle: (key: SectionKey) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      <p className="flex-1 font-medium text-[#07283b]">{SECTION_LABELS[section.key]}</p>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        <input
          type="checkbox"
          checked={section.visible}
          onChange={() => onToggle(section.key)}
          className="h-4 w-4"
        />
        Visible
      </label>
    </div>
  );
}

export function PageBuilderEditor({ initialSections }: { initialSections: PageSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((current) => {
      const oldIndex = current.findIndex((s) => s.key === active.id);
      const newIndex = current.findIndex((s) => s.key === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
    setSavedMessage(null);
  }

  function handleToggle(key: SectionKey) {
    setSections((current) => current.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
    setSavedMessage(null);
  }

  function handleSave() {
    startTransition(async () => {
      await updatePageSections("home", sections);
      setSavedMessage("Saved — the homepage now reflects this order.");
    });
  }

  return (
    <div className="mt-6 max-w-2xl">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableRow key={section.key} section={section} onToggle={handleToggle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-[#07283b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save order"}
        </button>
        {savedMessage && <p className="text-sm text-emerald-600">{savedMessage}</p>}
      </div>
    </div>
  );
}
