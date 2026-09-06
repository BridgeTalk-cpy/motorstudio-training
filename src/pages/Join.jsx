import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, TRAINEES_COLLECTION } from "../firebase";
import { newParticipantId, emptyParking, LOCAL_KEY } from "../util";

export default function Join() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // 이미 이 기기에서 입장한 적 있으면 바로 입력 화면으로
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        const { id } = JSON.parse(saved);
        getDoc(doc(db, TRAINEES_COLLECTION, id)).then((snap) => {
          if (snap.exists()) {
            navigate("/trainee", { replace: true });
          } else {
            setChecking(false);
          }
        });
        return;
      } catch {
        // fallthrough
      }
    }
    setChecking(false);
  }, [navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    const id = newParticipantId();
    try {
      await setDoc(doc(db, TRAINEES_COLLECTION, id), {
        name: trimmed,
        entrustYes: "",
        entrustNo: "",
        bias: "",
        factsHeard: "",
        infoConfirm: "",
        customerNeed: "",
        customerEmotion: "",
        parking: emptyParking(),
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ id, name: trimmed }));
      navigate("/trainee");
    } catch (err) {
      console.error(err);
      alert("입장에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.");
      setBusy(false);
    }
  };

  if (checking) return <div className="page-center">확인 중…</div>;

  return (
    <div className="page-center">
      <div className="join-card">
        <div className="brand-accent-bar" />
        <h1 className="join-title">
          현대 모터스튜디오 교육<span className="accent-dot">.</span>
        </h1>
        <p className="join-sub">이름을 입력하고 입장해 주세요</p>
        <form onSubmit={handleJoin}>
          <input
            className="join-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            autoFocus
          />
          <button className="join-btn" type="submit" disabled={busy || !name.trim()}>
            {busy ? "입장하는 중…" : "입장하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
