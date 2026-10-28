import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

// A continuous PCM master: no playback-rate change, trimming or encoder delay.
export const Voiceover = ({ volume }: { volume: number }) => (
  <Audio
    name="Full script narration"
    src={staticFile("audio/vo.wav")}
    volume={volume}
  />
);
