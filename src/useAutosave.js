import { useCallback, useEffect, useRef, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, TRAINEES_COLLECTION } from "./firebase";

// 필드 하나를 로컬 상태로 즉시 반영하면서, 타이핑이 멈추면(디바운스) Firestore에 저장.
export function useAutosave(participantId, initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState("idle"); // idle | typing | saving | saved
  const timerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && initialValue !== undefined) {
      setValue(initialValue);
      initializedRef.current = true;
    }
  }, [initialValue]);

  const save = useCallback(
    (field, val) => {
      if (!participantId) return;
      setStatus("saving");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          await updateDoc(doc(db, TRAINEES_COLLECTION, participantId), {
            [field]: val,
            updatedAt: serverTimestamp(),
          });
          setStatus("saved");
        } catch (e) {
          console.error("저장 실패", e);
          setStatus("idle");
        }
      }, 700);
    },
    [participantId]
  );

  const onChange = useCallback(
    (field) => (val) => {
      setValue(val);
      setStatus("typing");
      save(field, val);
    },
    [save]
  );

  return { value, status, onChange };
}
