import FileTab from "./FileTab";
import { useEffect, useRef, useState } from "react";
import {
  useHistory,
  addWindow,
  setActiveFile,
  setFileSplit,
  setFocusedFile,
} from "../store/history";
import { VscSplitHorizontal, VscSplitVertical } from "react-icons/vsc";
import Tooltip from "./Tooltip";
import EllipsisDots from "./EllipsisDots";

const ICON_COLOR = "#CCCCCC";
const SPLIT_COLOR = "rgb(196, 196, 196)";

const CurrentFiles = ({ isActive, fileIndex }) => {
  const trackRef = useRef();
  const sliderRef = useRef();
  const scrollAreaRef = useRef();
  const [splitHover, setSplitHover] = useState(false);
  const [shiftDown, setShiftDown] = useState(false);

  const fileSplit = useHistory((s) => s.fileSplit);
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[fileIndex]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";

  const getFileName = (filePath) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  const scrollToFile = (fileIndex) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const fileElements = scrollArea.querySelectorAll("[data-filetab]");
    if (!fileElements[fileIndex]) return;

    const fileElement = fileElements[fileIndex];
    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const fileRect = fileElement.getBoundingClientRect();

    if (fileRect.left < scrollAreaRect.left) {
      scrollArea.scrollBy({
        left: fileRect.left - scrollAreaRect.left,
      });
    } else if (fileRect.right > scrollAreaRect.right) {
      scrollArea.scrollBy({
        left: fileRect.right - scrollAreaRect.right,
      });
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    const scrollArea = scrollAreaRef.current;

    if (!track || !slider || !scrollArea) return;

    const handleShiftScroll = (deltaY) => {
      const currentIndex = currentFiles.findIndex(
        (file) => file.path === focusedFile
      );
      if (currentIndex === -1) return;

      let nextIndex;
      if (deltaY > 0) {
        nextIndex = currentIndex + 1;
        if (nextIndex >= currentFiles.length) return;
      } else {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) return;
      }

      setFocusedFile({
        id: activeFile,
        focusedFile: currentFiles[nextIndex].path,
      });
      scrollToFile(nextIndex);
    };

    const updateScrollbar = () => {
      const { scrollWidth, clientWidth } = scrollArea;

      if (scrollWidth <= clientWidth) {
        track.style.display = "none";
        return;
      }

      track.style.display = "block";

      const scrollRatio = clientWidth / scrollWidth;
      const sliderWidth = Math.max(track.clientWidth * scrollRatio, 30);
      slider.style.width = `${sliderWidth}px`;

      const scrollLeft = scrollArea.scrollLeft;
      const maxScrollLeft = scrollWidth - clientWidth;
      const maxSliderLeft = track.clientWidth - sliderWidth;
      const sliderLeft = (scrollLeft / maxScrollLeft) * maxSliderLeft;
      slider.style.left = `${sliderLeft}px`;
    };

    const handleScroll = (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        handleShiftScroll(e.deltaY);
        return;
      }

      e.preventDefault();
      const scrollAmount = e.type === "wheel" ? e.deltaY : e.movementX * 2;
      scrollArea.scrollLeft += scrollAmount;
      updateScrollbar();
    };

    const handleMouseDown = () => {
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleScroll);
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", handleScroll);
      requestAnimationFrame(updateScrollbar);
    };

    const handleTrackClick = (e) => {
      if (e.target === slider) return;

      const trackRect = track.getBoundingClientRect();
      const clickPosition = e.clientX - trackRect.left;
      const sliderWidth = slider.offsetWidth;
      const maxSliderLeft = track.clientWidth - sliderWidth;
      const boundedSliderLeft = Math.max(
        0,
        Math.min(clickPosition - sliderWidth / 2, maxSliderLeft)
      );

      const scrollRatio = boundedSliderLeft / maxSliderLeft;
      const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;

      scrollArea.scrollLeft = scrollRatio * maxScrollLeft;
      updateScrollbar();
    };

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scrollArea);

    scrollArea.addEventListener("wheel", handleScroll, { passive: false });
    slider.addEventListener("mousedown", handleMouseDown);
    track.addEventListener("mousedown", handleTrackClick);
    document.addEventListener("mouseup", handleMouseUp);

    updateScrollbar();

    return () => {
      resizeObserver.disconnect();
      scrollArea.removeEventListener("wheel", handleScroll);
      slider.removeEventListener("mousedown", handleMouseDown);
      track.removeEventListener("mousedown", handleTrackClick);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleScroll);
    };
  }, [currentFiles, focusedFile, activeFile]);

  useEffect(() => {
    if (!splitHover) return;
    const onKeyDown = (e) => {
      if (e.key === "Shift") setShiftDown(true);
    };
    const onKeyUp = (e) => {
      if (e.key === "Shift") setShiftDown(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      setShiftDown(false);
    };
  }, [splitHover]);

  const iconBg =
    "w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

  const splitDown = splitHover && shiftDown;
  const splitTooltip = splitDown
    ? "편집기를 아래로 분할"
    : "편집기를 오른쪽으로 분할(Ctrl+\\) [<Alt>] 편집기를 아래로 분할";

  return (
    <div className="relative group/scrollarea">
      <div
        className="h-[35px] w-full flex overflow-x-scroll [&::-webkit-scrollbar]:hidden"
        ref={scrollAreaRef}
      >
        {currentFiles.map((file) => (
          <FileTab
            key={file.path}
            fileName={getFileName(file.path)}
            filePath={file.path}
            fileIndex={fileIndex}
          />
        ))}
        <div
          className="flex-1 pl-[3px] flex items-center justify-end text-base"
          style={{ color: ICON_COLOR }}
        >
          <div className="flex items-center justify-end gap-[5px] mr-2.5">
            {isActive && (
              <Tooltip
                label={splitTooltip}
                position="bottom"
                group="tabs-right"
                maxWidth={splitDown ? null : 220}
              >
                <div
                  className={iconBg}
                  style={{ color: SPLIT_COLOR }}
                  onMouseEnter={(e) => {
                    setSplitHover(true);
                    if (e.shiftKey) setShiftDown(true);
                  }}
                  onMouseLeave={() => setSplitHover(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileSplit([...fileSplit, fileSplit.length]);
                    addWindow(fileSplit.length);
                    setActiveFile(fileIndex + 1);
                  }}
                >
                  {splitDown ? <VscSplitVertical /> : <VscSplitHorizontal />}
                </div>
              </Tooltip>
            )}
            <Tooltip label="기타 작업..." position="bottom" group="tabs-right">
              <div className={iconBg} style={{ color: SPLIT_COLOR }}>
                <EllipsisDots />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-[3px]" ref={trackRef}>
        <div
          className="h-full absolute z-[1] max-w-[calc(100%-30px)] group-hover/scrollarea:bg-[var(--scrollbar)] hover:!bg-[var(--scrollbar-hover)] active:!bg-[var(--scrollbar-active)]"
          ref={sliderRef}
        />
      </div>
    </div>
  );
};

export default CurrentFiles;
