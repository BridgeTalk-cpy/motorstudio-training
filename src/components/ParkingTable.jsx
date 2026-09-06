import { PARKING_ROWS } from "../util";
import { StatusTag } from "./FieldBox";

// Q4: 주차요금 설명 — 질문(WHY/WHAT/HOW)은 고정, "작성" 칸만 참가자가 입력
export default function ParkingTable({ answers, onChange, status, readOnly }) {
  return (
    <div className="parking-table-wrap">
      <div className="parking-table">
        <div className="parking-row parking-row-head">
          <div className="parking-cell parking-cell-step">구분</div>
          <div className="parking-cell parking-cell-q">질문 (고정)</div>
          <div className="parking-cell parking-cell-a">작성</div>
        </div>
        {PARKING_ROWS.map((row) => (
          <div className="parking-row" key={row.key}>
            <div className="parking-cell parking-cell-step">{row.label}</div>
            <div className="parking-cell parking-cell-q">{row.question}</div>
            <div className="parking-cell parking-cell-a">
              <textarea
                className="parking-input"
                rows={2}
                placeholder="답변을 작성해 주세요"
                value={answers?.[row.key] || ""}
                readOnly={readOnly}
                onChange={(e) => onChange(row.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      {!readOnly && <StatusTag status={status} />}
    </div>
  );
}
