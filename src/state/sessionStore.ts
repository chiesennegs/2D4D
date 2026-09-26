import { create } from "zustand";
import type { CalibrationObjectId, Demographics, HandCapture, HandSide } from "../types";
import { UNKNOWN_DEMOGRAPHICS } from "../types";

interface SessionState {
  demographics: Demographics;
  calibrationObjectId: CalibrationObjectId | null;
  hands: Partial<Record<HandSide, HandCapture>>;

  setDemographics: (d: Demographics) => void;
  setCalibrationObject: (id: CalibrationObjectId) => void;
  setHandCapture: (side: HandSide, capture: HandCapture) => void;
  clearHandCapture: (side: HandSide) => void;
  reset: () => void;
}

const initialState = {
  demographics: UNKNOWN_DEMOGRAPHICS,
  calibrationObjectId: null,
  hands: {},
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,
  setDemographics: (d) => set({ demographics: d }),
  setCalibrationObject: (id) => set({ calibrationObjectId: id }),
  setHandCapture: (side, capture) =>
    set((state) => ({ hands: { ...state.hands, [side]: capture } })),
  clearHandCapture: (side) =>
    set((state) => {
      const hands = { ...state.hands };
      delete hands[side];
      return { hands };
    }),
  reset: () => set(initialState),
}));
