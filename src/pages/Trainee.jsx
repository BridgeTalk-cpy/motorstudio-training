import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, TRAINEES_COLLECTION } from "../firebase";
import { useAutosave } from "../useAutosave";
import { LOCAL_KEY } from "../util";
import FieldBox from "../components/FieldBox";
import ChoicePair from "../components/ChoicePair";
import ParkingTable from "../components/ParkingTable";

function combineStatus(...statuses) {
  if (statuses.includes("saving")) return "saving";
  if (statuses.includes("typing")) return "typing";
  if (statuses.includes("saved")) return "saved";
  return "idle";
}

export default function Trainee() {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState(null);
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (!saved) {
      navigate("/", { replace: true });
      return;
    }
    const { id, name: n } = JSON.parse(saved);
    setParticipantId(id);
    setName(n);
    getDoc(doc(db, TRAINEES_COLLECTION, id)).then((snap) => {
      if (!snap.exists()) {
        localStorage.removeItem(LOCAL_KEY);
        navigate("/", { replace: true });
        return;
      }
      setInitial(snap.data());
      setLoaded(true);
    });
  }, [navigate]);

  const entrustYes = useAutosave(participantId, initial?.entrustYes ?? "");
  const entrustNo = useAutosave(participantId, initial?.entrustNo ?? "");
  const bias = useAutosave(participantId, initial?.bias ?? "");
  const factsHeard = useAutosave(participantId, initial?.factsHeard ?? "");
  const infoConfirm = useAutosave(participantId, initial?.infoConfirm ?? "");
  const customerNeed = useAutosave(participantId, initial?.customerNeed ?? "");
  const customerEmotion = useAutosave(participantId, initial?.customerEmotion ?? "");
  const parkingWhy = useAutosave(participantId, initial?.parking?.why ?? "");
  const parkingWhat = useAutosave(participantId, initial?.parking?.what ?? "");
  const parkingHow = useAutosave(participantId, initial?.parking?.how ?? "");

  if (!loaded) return <div className="page-center">불러오는 중…</div>;

  const restart = () => {
    if (confirm("이름을 다시 입력하시겠습니까? (기존 입력 내용은 그대로 저장되어 있습니다)")) {
      localStorage.removeItem(LOCAL_KEY);
      navigate("/");
    }
  };

  const parkingAnswers = { why: parkingWhy.value, what: parkingWhat.value, how: parkingHow.value };
  const parkingFieldByKey = { why: parkingWhy, what: parkingWhat, how: parkingHow };
  const handleParkingChange = (key, val) => {
    parkingFieldByKey[key].onChange(`parking.${key}`)(val);
  };

  return (
    <div className="student-page">
      <header className="student-header">
        <div>
          <div className="student-header-label">교육생</div>
          <div className="student-header-name">{name}</div>
        </div>
        <button className="link-btn" onClick={restart}>
          이름 다시 입력
        </button>
      </header>

      <section className="input-section">
        <div className="section-num">1</div>
        <div className="field-box">
          <div className="field-label">
            한 사람의 다양한 표정을 확인 후 "가이드를 맡기겠다" 또는 "못맡기겠다"를 선택하고 그 이유를 작성해 주세요.
          </div>
          <ChoicePair yesField={entrustYes} noField={entrustNo} />
        </div>
      </section>

      <section className="input-section">
        <div className="section-num">2</div>
        <FieldBox
          label="슬라이드 사례에서 응대자의 확증편향은 무엇이라고 생각하나요?"
          value={bias.value}
          onChange={bias.onChange("bias")}
          status={bias.status}
          placeholder="자유롭게 작성해 주세요"
          minRows={3}
        />
      </section>

      <section className="input-section">
        <div className="section-num">3</div>
        <div className="field-box">
          <div className="field-label">사례를 확인 후 아래의 내용을 작성해 주세요</div>
          <div className="quad-grid">
            <FieldBox
              label="1. 들은 사실"
              value={factsHeard.value}
              onChange={factsHeard.onChange("factsHeard")}
              status={factsHeard.status}
              minRows={3}
            />
            <FieldBox
              label="2. 확인이 필요한 정보"
              value={infoConfirm.value}
              onChange={infoConfirm.onChange("infoConfirm")}
              status={infoConfirm.status}
              minRows={3}
            />
            <FieldBox
              label="3. 고객 요구 (핵심요구)"
              value={customerNeed.value}
              onChange={customerNeed.onChange("customerNeed")}
              status={customerNeed.status}
              minRows={3}
            />
            <FieldBox
              label="4. 고객이 느끼고 있는 감정"
              value={customerEmotion.value}
              onChange={customerEmotion.onChange("customerEmotion")}
              status={customerEmotion.status}
              minRows={3}
            />
          </div>
        </div>
      </section>

      <section className="input-section">
        <div className="section-num">4</div>
        <div className="field-box">
          <div className="field-label">주차요금 어떻게 설명할까요?</div>
          <ParkingTable
            answers={parkingAnswers}
            onChange={handleParkingChange}
            status={combineStatus(parkingWhy.status, parkingWhat.status, parkingHow.status)}
          />
        </div>
      </section>

      <div className="student-footer-note">입력한 내용은 자동으로 저장됩니다. 진행 속도에 맞춰 편하게 작성해 주세요.</div>
    </div>
  );
}
