import { useEffect } from "react";

export default function CardMouseMoveScript() {
  const handleOnMouseMove = (e: any) => {
    const { currentTarget: target } = e;

    if (!target) return;
    const rect = target.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    console.log("hello");
    for (const card of document.querySelectorAll(
      ".card",
    ) as NodeListOf<HTMLDivElement>) {
      card.onmousemove = handleOnMouseMove;
    }
  }, []);

  return <></>;
}
