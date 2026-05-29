import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Printer, ArrowLeft } from "lucide-react";

function getParam(search: string, key: string) {
  return new URLSearchParams(search).get(key) ?? "";
}

export default function Certificate() {
  const search = useSearch();

  const name = getParam(search, "name");
  const score = getParam(search, "score");
  const badge = getParam(search, "badge");
  const friendly = getParam(search, "friendly");
  const proficient = getParam(search, "proficient");
  const dedicated = getParam(search, "dedicated");
  const happiness = getParam(search, "happiness");
  const rawDate = getParam(search, "date");

  const displayDate = rawDate
    ? new Date(rawDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  const scoreNum = Number(score) || 0;

  let honorTitle = "Thu Ngân Giỏi Chuyên Môn";
  if (scoreNum >= 95) honorTitle = "Ngôi Sao Trải Nghiệm Khách Hàng";
  else if (scoreNum >= 85) honorTitle = "Đại Sứ 3T MM";
  else if (scoreNum >= 70) honorTitle = "Chuyên Gia Dịch Vụ Khách Hàng";
  else if (scoreNum >= 50) honorTitle = "Thu Ngân Chuyên Nghiệp";

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex flex-col items-center py-8 px-4">
      {/* Action bar — hidden when printing */}
      <div className="print:hidden flex items-center justify-between w-full max-w-2xl mb-6">
        <Link href="/results">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <Button
          onClick={() => window.print()}
          className="gap-2 bg-primary hover:bg-primary/90"
          data-testid="button-print"
        >
          <Printer className="h-4 w-4" />
          In / Tải PDF
        </Button>
      </div>

      {/* Certificate — this is what gets printed */}
      <div
        id="certificate"
        className="
          bg-white w-full max-w-2xl
          shadow-2xl print:shadow-none
          relative overflow-hidden
          font-serif
        "
        style={{ aspectRatio: "1 / 1.414", minHeight: "560px" }}
      >
        {/* Outer border */}
        <div className="absolute inset-2 border-4 border-[#003087] pointer-events-none z-10" />
        <div className="absolute inset-[10px] border border-[#C8A951] pointer-events-none z-10" />

        {/* Corner ornaments */}
        {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8 border-4 border-[#C8A951] z-20`}
              style={{
                borderRadius: i === 0 ? "0 0 8px 0" : i === 1 ? "0 0 0 8px" : i === 2 ? "0 8px 0 0" : "8px 0 0 0",
                borderTop: i < 2 ? undefined : "none",
                borderBottom: i >= 2 ? undefined : "none",
                borderLeft: i % 2 === 0 ? undefined : "none",
                borderRight: i % 2 === 1 ? undefined : "none",
              }}
            />
          )
        )}

        {/* Background watermark pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #003087 0px,
              #003087 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full px-12 py-10 text-center">

          {/* Header */}
          <div className="w-full">
            {/* MM Logo */}
            <div className="flex justify-center mb-3">
              <div
                className="bg-[#003087] text-white font-black flex items-center justify-center rounded-lg shadow"
                style={{ width: 56, height: 56, fontSize: 22, letterSpacing: "-1px" }}
              >
                MM
              </div>
            </div>
            <p className="text-[#003087] font-bold tracking-[0.3em] uppercase text-xs mb-0.5">
              MM Mega Market
            </p>
            <p className="text-[#666] text-[10px] tracking-widest uppercase">
              Chương Trình Đào Tạo Dịch Vụ Khách Hàng
            </p>

            {/* Gold divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#C8A951]" />
              <div className="text-[#C8A951] text-lg">✦</div>
              <div className="flex-1 h-px bg-[#C8A951]" />
            </div>

            {/* Title */}
            <p className="text-[#C8A951] tracking-[0.4em] uppercase text-[10px] mb-1">
              Chứng Nhận Hoàn Thành
            </p>
            <h1
              className="text-[#003087] font-black uppercase leading-tight"
              style={{ fontSize: "clamp(18px, 4vw, 28px)", letterSpacing: "0.05em" }}
            >
              Đào Tạo Tiêu Chuẩn 3T
            </h1>
          </div>

          {/* Main body */}
          <div className="w-full flex flex-col items-center gap-3">
            <p className="text-[#555] text-sm tracking-wide">Chứng nhận rằng</p>

            {/* Name */}
            <div className="w-full border-b-2 border-[#003087] pb-1 mb-1">
              <p
                className="text-[#003087] font-black italic"
                style={{ fontSize: "clamp(20px, 5vw, 36px)" }}
              >
                {name || "Nhân viên MM"}
              </p>
            </div>

            <p className="text-[#555] text-xs leading-relaxed max-w-sm">
              đã hoàn thành chương trình đào tạo{" "}
              <strong className="text-[#003087]">Dịch Vụ Khách Hàng 3T</strong>{" "}
              — Thân Thiện · Thành Thạo · Tận Tâm — và đạt danh hiệu:
            </p>

            {/* Badge */}
            <div className="bg-[#003087] text-white px-6 py-2 rounded-full shadow-md">
              <p className="font-black tracking-wide text-sm">{badge || honorTitle}</p>
            </div>

            {/* Score breakdown */}
            <div className="flex gap-4 mt-1">
              <div className="text-center">
                <p className="text-[10px] text-[#888] uppercase tracking-wider">Điểm tổng</p>
                <p className="text-[#003087] font-black text-xl leading-tight">{score}/100</p>
              </div>
              <div className="w-px bg-[#ddd]" />
              <div className="text-center">
                <p className="text-[10px] text-[#888] uppercase tracking-wider">Thân thiện</p>
                <p className="text-[#003087] font-bold text-lg leading-tight">{friendly}/30</p>
              </div>
              <div className="w-px bg-[#ddd]" />
              <div className="text-center">
                <p className="text-[10px] text-[#888] uppercase tracking-wider">Thành thạo</p>
                <p className="text-[#003087] font-bold text-lg leading-tight">{proficient}/40</p>
              </div>
              <div className="w-px bg-[#ddd]" />
              <div className="text-center">
                <p className="text-[10px] text-[#888] uppercase tracking-wider">Tận tâm</p>
                <p className="text-[#003087] font-bold text-lg leading-tight">{dedicated}/30</p>
              </div>
              <div className="w-px bg-[#ddd]" />
              <div className="text-center">
                <p className="text-[10px] text-[#888] uppercase tracking-wider">Hài lòng KH</p>
                <p className="text-[#003087] font-bold text-lg leading-tight">{happiness}%</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full">
            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#C8A951]" />
              <div className="text-[#C8A951] text-sm">✦</div>
              <div className="flex-1 h-px bg-[#C8A951]" />
            </div>

            <div className="flex justify-between items-end">
              {/* Signature block */}
              <div className="text-center">
                <div className="w-28 border-b border-[#003087] mb-1" />
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Quản lý đào tạo</p>
                <p className="text-[10px] text-[#666]">MM Mega Market</p>
              </div>

              {/* Center motto */}
              <div className="text-center">
                <p className="text-[#C8A951] text-[10px] italic font-medium">
                  "Khách hàng nhớ cảm xúc
                </p>
                <p className="text-[#C8A951] text-[10px] italic font-medium">
                  chúng ta mang lại."
                </p>
              </div>

              {/* Date block */}
              <div className="text-center">
                <div className="w-28 border-b border-[#003087] mb-1" />
                <p className="text-[10px] text-[#666] uppercase tracking-wider">Ngày cấp</p>
                <p className="text-[10px] text-[#666]">{displayDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print hint */}
      <p className="print:hidden text-xs text-slate-500 mt-4 text-center">
        Nhấn "In / Tải PDF" rồi chọn "Save as PDF" để lưu chứng chỉ.
      </p>

      <style>{`
        @media print {
          body { margin: 0; background: white; }
          #certificate {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            aspect-ratio: unset !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
