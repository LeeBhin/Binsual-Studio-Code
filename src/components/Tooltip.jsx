import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let activeHide = null;
let activeGroup = null;
let pendingHideFn = null;
let pendingHideGroup = null;
let pendingHideTimer = null;

const Tooltip = ({ label, children, position = "top", group = null, maxWidth = null, className = "" }) => {
  const [show, setShow] = useState(false);
  const showTimer = useRef(null);
  const hideRef = useRef(null);
  const wrapRef = useRef(null);
  const bubbleRef = useRef(null);

  // bubble 좌표 (viewport 기준)
  const [pos, setPos] = useState({
    placement: position,
    left: 0,
    top: 0,
    tailLeft: 0,
  });

  hideRef.current = () => {
    setShow(false);
    if (activeHide === hideRef) {
      activeHide = null;
      activeGroup = null;
    }
    if (pendingHideFn === hideRef) {
      pendingHideFn = null;
      pendingHideGroup = null;
      clearTimeout(pendingHideTimer);
      pendingHideTimer = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimer.current);
      if (activeHide === hideRef) {
        activeHide = null;
        activeGroup = null;
      }
      if (pendingHideFn === hideRef) {
        pendingHideFn = null;
        pendingHideGroup = null;
        clearTimeout(pendingHideTimer);
        pendingHideTimer = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!show || !bubbleRef.current || !wrapRef.current) return;
    const PAD = 4;
    const TAIL_GAP = 0;

    const bubble = bubbleRef.current;
    bubble.style.width = "";

    const clone = bubble.cloneNode(true);
    clone.style.left = "0px";
    clone.style.top = "0px";
    clone.style.visibility = "hidden";
    clone.style.width = "";
    document.body.appendChild(clone);

    let targetW = clone.offsetWidth;
    if (maxWidth) {
      const textNode = clone.firstChild;
      if (textNode && textNode.nodeType === 3) {
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const rects = range.getClientRects();
        const origLines = rects.length;
        let longest = 0;
        for (let i = 0; i < rects.length; i++) {
          if (rects[i].width > longest) longest = rects[i].width;
        }
        if (longest > 0) {
          let w = Math.ceil(longest) + 18;
          clone.style.width = `${w}px`;
          let attempts = 0;
          while (attempts < 12) {
            const r = document.createRange();
            r.selectNodeContents(textNode);
            if (r.getClientRects().length <= origLines) break;
            w += 1;
            clone.style.width = `${w}px`;
            attempts++;
          }
          targetW = w;
        }
      }
    }
    const targetH = clone.offsetHeight;
    document.body.removeChild(clone);

    bubble.style.width = `${targetW}px`;

    const wrapRect = wrapRef.current.getBoundingClientRect();
    const wrapCenter = wrapRect.left + wrapRect.width / 2;
    const bubbleW = targetW;
    const bubbleH = targetH;
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let placement = position;
    if (placement === "top" && wrapRect.top - bubbleH - 8 < 0)
      placement = "bottom";
    if (placement === "bottom" && wrapRect.bottom + bubbleH + 8 > winH)
      placement = "top";

    let left = wrapCenter - bubbleW / 2;
    if (left + bubbleW > winW - PAD) left = winW - PAD - bubbleW;
    if (left < PAD) left = PAD;

    const top =
      placement === "top"
        ? wrapRect.top - bubbleH - TAIL_GAP - 5
        : wrapRect.bottom + TAIL_GAP + 5;

    const tailLeft = wrapCenter - left;

    setPos({ placement, left, top, tailLeft });
  }, [show, position, label, maxWidth]);

  const onEnter = () => {
    if (pendingHideFn === hideRef) {
      pendingHideFn = null;
      pendingHideGroup = null;
      clearTimeout(pendingHideTimer);
      pendingHideTimer = null;
      return;
    }

    const recentRef = pendingHideFn || activeHide;
    const recentGroup = pendingHideFn ? pendingHideGroup : activeGroup;
    const isSameGroup =
      recentRef && recentRef !== hideRef && group != null && recentGroup === group;

    if (recentRef && recentRef !== hideRef) {
      recentRef.current();
    }

    if (show) return;

    if (isSameGroup) {
      setShow(true);
      activeHide = hideRef;
      activeGroup = group;
      return;
    }

    clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => {
      setShow(true);
      activeHide = hideRef;
      activeGroup = group;
    }, 500);
  };

  const onLeave = () => {
    clearTimeout(showTimer.current);
    if (show) {
      pendingHideFn = hideRef;
      pendingHideGroup = group;
      pendingHideTimer = setTimeout(() => {
        hideRef.current();
      }, 300);
    }
  };

  const isTop = pos.placement === "top";

  const bubble = (
    <span
      ref={bubbleRef}
      className={`fixed px-[6px] py-[2px] rounded-sm text-[12px] text-[#CCCCCC] pointer-events-none z-[1000] ${
        maxWidth ? "whitespace-normal break-words" : "whitespace-nowrap"
      }`}
      style={{
        top: pos.top,
        left: pos.left,
        background: "#252526",
        border: "1px solid #4A4A4A",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.35)",
        ...(maxWidth ? { maxWidth } : {}),
      }}
    >
      {label}
      <span
        className="absolute w-0 h-0"
        style={{
          left: `${pos.tailLeft}px`,
          transform: "translateX(-50%)",
          ...(isTop
            ? {
                top: "100%",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #454545",
              }
            : {
                bottom: "100%",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "6px solid #454545",
              }),
        }}
      />
      <span
        className="absolute w-0 h-0"
        style={{
          left: `${pos.tailLeft}px`,
          transform: "translateX(-50%)",
          ...(isTop
            ? {
                top: "100%",
                marginTop: "-1px",
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid #252526",
              }
            : {
                bottom: "100%",
                marginBottom: "-1px",
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "5px solid #252526",
              }),
        }}
      />
    </span>
  );

  return (
    <span
      ref={wrapRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {show && createPortal(bubble, document.body)}
    </span>
  );
};

export default Tooltip;
