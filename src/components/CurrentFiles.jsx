import FileTab from "./FileTab";
import { useEffect, useRef } from "react";
import {
  useHistory,
  addWindow,
  setActiveFile,
  setFileSplit,
  setFocusedFile,
} from "../store/history";
import { VscEllipsis, VscSplitHorizontal } from "react-icons/vsc";

const CurrentFiles = ({ isActive, fileIndex }) => {
  const trackRef = useRef();
  const sliderRef = useRef();
  const scrollAreaRef = useRef();

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

  const iconBg =
    "w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

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
        <div className="flex-1 pl-[3px] flex items-center justify-end text-[var(--text)] text-base">
          <div className="flex items-center justify-end gap-[5px] mr-2.5">
            {isActive && (
              <div
                className={iconBg}
                onClick={(e) => {
                  e.stopPropagation();
                  setFileSplit([...fileSplit, fileSplit.length]);
                  addWindow(fileSplit.length);
                  setActiveFile(fileIndex + 1);
                }}
              >
                <VscSplitHorizontal />
              </div>
            )}
            <div className={iconBg}>
              <VscEllipsis />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-[3px]" ref={trackRef}>
        <div
          className="h-full absolute z-[1] max-w-[calc(100%-30px)] transition-[background-color] duration-[1.3s] group-hover/scrollarea:bg-[var(--scrollbar)] group-hover/scrollarea:duration-300 hover:!bg-[var(--scrollbar-hover)] hover:!transition-none active:!bg-[var(--scrollbar-active)] active:!transition-none"
          ref={sliderRef}
        />
      </div>
    </div>
  );
};

export default CurrentFiles;
