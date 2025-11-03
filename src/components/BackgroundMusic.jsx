import { useEffect, useRef } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4; // chỉnh nhỏ một chút cho đỡ át tiếng khác
    audio.loop = true; // phát lặp lại
    audio.play().catch(() => {
      // nếu trình duyệt chặn autoplay
      console.log("Autoplay bị chặn, sẽ phát khi người dùng tương tác.");
      const resumeAudio = () => {
        audio.play();
        document.removeEventListener("click", resumeAudio);
      };
      document.addEventListener("click", resumeAudio);
    });
  }, []);

  return (
    <audio ref={audioRef} src="/sounds/bg-music.mp3" />
  );
};

export default BackgroundMusic;
