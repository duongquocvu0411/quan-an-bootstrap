// ✅ Hook scroll mượt
import { useCallback } from "react";

export const useSmoothScroll = () => {
  return useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);
};
