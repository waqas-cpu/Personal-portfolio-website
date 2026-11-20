import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";

export const alt = "Waqas — FinTech, LegalTech, AI & Systems Engineering Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const profile = getProfile();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fafaf8",
        color: "#14171c",
        padding: "64px 72px",
        border: "1px solid #e5e5df",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #cfcfc6",
            backgroundColor: "#ffffff",
            color: "#1d4368",
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          W
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "22px", fontWeight: 600 }}>{profile.displayName}</span>
          <span style={{ fontSize: "15px", color: "#59626f", fontFamily: "monospace" }}>
            {profile.workingTitle}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "960px" }}>
        <div
          style={{
            fontSize: "44px",
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.hero.headline}
        </div>
        <div style={{ fontSize: "22px", lineHeight: 1.45, color: "#47505c" }}>
          {profile.hero.supportingCopy}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e5e5df",
          paddingTop: "24px",
          fontSize: "16px",
          color: "#59626f",
          fontFamily: "monospace",
        }}
      >
        <span>Evidence-led case studies · Systems architecture · Trust boundaries</span>
        <span style={{ color: "#1d4368" }}>github.com/{profile.githubHandle}</span>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
