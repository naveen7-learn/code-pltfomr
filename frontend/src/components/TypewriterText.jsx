import { useEffect, useState } from "react";

export const TypewriterText = ({
  words = [],
  typingSpeed = 85,
  deletingSpeed = 45,
  pauseMs = 1400,
  className = ""
}) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) {
      return undefined;
    }

    const currentWord = words[index % words.length];
    const nextText = isDeleting
      ? currentWord.slice(0, Math.max(displayText.length - 1, 0))
      : currentWord.slice(0, displayText.length + 1);

    const delay = isDeleting ? deletingSpeed : typingSpeed;

    const timeoutId = setTimeout(
      () => {
        setDisplayText(nextText);

        if (!isDeleting && nextText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseMs);
          return;
        }

        if (isDeleting && nextText === "") {
          setIsDeleting(false);
          setIndex((current) => (current + 1) % words.length);
        }
      },
      !isDeleting && displayText === currentWord ? pauseMs : delay
    );

    return () => clearTimeout(timeoutId);
  }, [deletingSpeed, displayText, index, isDeleting, pauseMs, typingSpeed, words]);

  return (
    <div className={className}>
      <span>{displayText}</span>
      <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-300 align-[-0.1em]" />
    </div>
  );
};
