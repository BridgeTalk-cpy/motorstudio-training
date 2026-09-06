import { StatusTag } from "./FieldBox";

// Q1: "가이드를 맡기겠다" / "못맡기겠다" 두 칸에 각각 이유를 작성하는 컴포넌트
// yes / no 는 { value, onChange, status } 형태 (onChange는 이미 필드명이 연결된, 값만 받는 함수)
export default function ChoicePair({ yes, no, readOnly }) {
  return (
    <div className="choice-pair">
      <div className="choice-box choice-box-yes">
        <div className="choice-label">
          <span className="choice-badge choice-badge-yes">맡기겠다</span>
          이유는?
        </div>
        <textarea
          className="field-input"
          rows={3}
          placeholder="맡기겠다고 판단한 이유를 적어주세요"
          value={yes.value}
          readOnly={readOnly}
          onChange={(e) => yes.onChange(e.target.value)}
        />
        {!readOnly && <StatusTag status={yes.status} />}
      </div>
      <div className="choice-box choice-box-no">
        <div className="choice-label">
          <span className="choice-badge choice-badge-no">못맡기겠다</span>
          이유는?
        </div>
        <textarea
          className="field-input"
          rows={3}
          placeholder="못맡기겠다고 판단한 이유를 적어주세요"
          value={no.value}
          readOnly={readOnly}
          onChange={(e) => no.onChange(e.target.value)}
        />
        {!readOnly && <StatusTag status={no.status} />}
      </div>
    </div>
  );
}
