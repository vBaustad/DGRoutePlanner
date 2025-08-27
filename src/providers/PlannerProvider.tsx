import { useState } from "react";
import { PlannerContext } from "../features/route-planner/context/PlannerContext";
import type { TripPlanForm } from "../features/route-planner/types/TripPlanForm";
import type { PlannerContextType, Step, Stop } from "../features/route-planner/types/PlannerTypes";

// Local alias for the form's stop shape (no isSuggested)
type FormStop = Omit<Stop, "isSuggested">;

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<Step>("start");

  const [form, setForm] = useState<TripPlanForm>({
    startLocation: "",
    endLocation: "",
    tripDays: 3,
    coursesPerDay: 2,
    maxDetourMinutes: 30,
    customStops: [],
  });

  const addStop = (stop: FormStop) => {
    setForm((prev) => ({
      ...prev,
      customStops: [...(prev.customStops ?? []), stop],
    }));
  };

  const removeStop = (index: number) => {
    setForm((prev) => {
      const updated = [...(prev.customStops ?? [])];
      updated.splice(index, 1);
      return { ...prev, customStops: updated };
    });
  };

  const clearStops = () => {
    setForm((prev) => ({ ...prev, customStops: [] }));
  };

  const value: PlannerContextType = {
    form,
    setForm,
    // If your PlannerContextType expects Stop[], widen the type here.
    // FormStop is structurally compatible with Stop (it just omits isSuggested).
    stops: (form.customStops ?? []) as Stop[],
    addStop: addStop as unknown as PlannerContextType["addStop"], // keep context signature happy if it's typed to Stop
    removeStop,
    clearStops,
    isCourse: true,
    step,
    setStep,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};
