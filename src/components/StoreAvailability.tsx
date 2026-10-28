import { CanvasImage, staticFile } from "remotion";
import { fonts, theme } from "../theme";

// Keep store artwork upright and unmodified, outside the camera-push wrapper.
export const StoreAvailability = () => (
  <div
    style={{
      position: "absolute",
      top: 994,
      left: 175,
      display: "flex",
      alignItems: "center",
      gap: 35,
    }}
  >
    <CanvasImage
      src={staticFile("assets/google-play-badge.png")}
      style={{ width: 365, height: 141, objectFit: "contain" }}
    />
    <div
      style={{
        width: 315,
        display: "flex",
        alignItems: "center",
        gap: 16,
        color: theme.text,
        fontFamily: fonts.sans,
      }}
    >
      <CanvasImage
        src={staticFile("assets/apple-app-store-icon.png")}
        style={{ width: 72, height: 72, borderRadius: 16 }}
      />
      <div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>App Store</div>
        <div style={{ fontSize: 20, color: `${theme.text}`, marginTop: 5 }}>
          iPhone coming soon
        </div>
      </div>
    </div>
  </div>
);
