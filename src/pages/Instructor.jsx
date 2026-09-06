import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, TRAINEES_COLLECTION } from "../firebase";
import ChoicePair from "../components/ChoicePair";
import ParkingTable from "../components/ParkingTable";

const AUTH_KEY = "motorstudio_training_instructor_auth";

export default function Instructor() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [code, setCode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, TRAINEES_COLLECTION), orderBy("joinedAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setParticipants(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [authed]);

  const expandedParticipant = useMemo(
    () => participants.find((p) => p.id === expanded) || null,
    [participants, expanded]
  );

  const removeOne = async (id, name) => {
    if (!confirm(`"${name}" 참가자 카드를 삭제할까요?`)) return;
    await deleteDoc(doc(db, TRAINEES_COLLECTION, id));
    if (expanded === id) setExpanded(null);
  };

  const resetAll = async () => {
    if (participants.length === 0) return;
    if (!confirm(`전체 ${participants.length}명의 데이터를 모두 삭제할까요? 되돌릴 수 없습니다.`)) return;
    if (!confirm("정말로 전체 초기화하시겠습니까? 한 번 더 확인합니다.")) return;
    await Promise.all(participants.map((p) => deleteDoc(doc(db, TRAINEES_COLLECTION, p.id))));
    setExpanded(null);
  };

  if (!authed) {
    return (
      <div className="page-center">
        <div className="join-card">
          <div className="brand-accent-bar" />
          <h1 className="join-title">강사 페이지</h1>
          <p className="join-sub">접속 암호를 입력해 주세요</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code === import.meta.env.VITE_INSTRUCTOR_CODE) {
                sessionStorage.setItem(AUTH_KEY, "1");
                setAuthed(true);
              } else {
                alert("암호가 올바르지 않습니다.");
              }
            }}
          >
            <input
              className="join-input"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="암호"
              autoFocus
            />
            <button className="join-btn" type="submit">
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-page">
      <header className="instructor-header">
        <h1>
          실시간 현황 <span className="accent-dot">.</span>
        </h1>
        <div className="instructor-header-right">
          <div className="instructor-count">참가자 {participants.length}명</div>
          <button className="reset-btn" onClick={resetAll} disabled={participants.length === 0}>
            전체 초기화
          </button>
        </div>
      </header>

      {participants.length === 0 && <div className="empty-note">아직 입장한 교육생이 없습니다.</div>}

      <div className="card-grid">
        {participants.map((p) => (
          <div key={p.id} className="trainee-card" onClick={() => setExpanded(p.id)} role="button" tabIndex={0}>
            <button
              className="trainee-card-delete"
              onClick={(e) => {
                e.stopPropagation();
                removeOne(p.id, p.name);
              }}
              title="이 참가자 삭제"
            >
              ✕
            </button>
            <div className="trainee-card-name">{p.name}</div>
            <div className="trainee-card-row">
              <span className="trainee-card-tag">1</span>
              <span className="trainee-card-text">{p.entrustYes || p.entrustNo || "—"}</span>
            </div>
            <div className="trainee-card-row">
              <span className="trainee-card-tag">2</span>
              <span className="trainee-card-text">{p.bias || "—"}</span>
            </div>
            <div className="trainee-card-row">
              <span className="trainee-card-tag">3</span>
              <span className="trainee-card-text">{p.customerNeed || p.factsHeard || "—"}</span>
            </div>
            <div className="trainee-card-row">
              <span className="trainee-card-tag">4</span>
              <span className="trainee-card-text">
                {p.parking?.why || p.parking?.what || p.parking?.how || "—"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {expandedParticipant && (
        <div className="modal-backdrop" onClick={() => setExpanded(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-name">{expandedParticipant.name}</div>
              <div className="modal-nav">
                {participants.map((p) => (
                  <button
                    key={p.id}
                    className={"modal-nav-dot" + (p.id === expandedParticipant.id ? " active" : "")}
                    onClick={() => setExpanded(p.id)}
                    title={p.name}
                  />
                ))}
              </div>
              <button className="modal-close" onClick={() => setExpanded(null)}>
                닫기 ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="input-section">
                <div className="section-num">1</div>
                <div className="field-box">
                  <div className="field-label">가이드를 맡기겠다 / 못맡기겠다</div>
                  <ChoicePair
                    yesField={{ value: expandedParticipant.entrustYes || "" }}
                    noField={{ value: expandedParticipant.entrustNo || "" }}
                    readOnly
                  />
                </div>
              </div>
              <div className="input-section">
                <div className="section-num">2</div>
                <div className="field-box">
                  <div className="field-label">응대자의 확증편향</div>
                  <div className="readonly-text">{expandedParticipant.bias || "아직 작성되지 않았습니다."}</div>
                </div>
              </div>
              <div className="input-section">
                <div className="section-num">3</div>
                <div className="field-box">
                  <div className="field-label">사례 분석</div>
                  <div className="quad-grid">
                    <div>
                      <div className="field-label">1. 들은 사실</div>
                      <div className="readonly-text">{expandedParticipant.factsHeard || "—"}</div>
                    </div>
                    <div>
                      <div className="field-label">2. 확인이 필요한 정보</div>
                      <div className="readonly-text">{expandedParticipant.infoConfirm || "—"}</div>
                    </div>
                    <div>
                      <div className="field-label">3. 고객 요구 (핵심요구)</div>
                      <div className="readonly-text">{expandedParticipant.customerNeed || "—"}</div>
                    </div>
                    <div>
                      <div className="field-label">4. 고객이 느끼고 있는 감정</div>
                      <div className="readonly-text">{expandedParticipant.customerEmotion || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="input-section">
                <div className="section-num">4</div>
                <div className="field-box">
                  <div className="field-label">주차요금 설명</div>
                  <ParkingTable answers={expandedParticipant.parking} onChange={() => {}} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
