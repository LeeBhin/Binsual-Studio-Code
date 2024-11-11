import React, { useRef, useEffect } from "react";
import treeData from "../../data/treeData";
import TreeNode from "./TreeNode";
import css from "../../styles/Layout.module.css";

const FolderTree = () => {
  const trackRef = useRef();
  const sliderRef = useRef();
  const scrollAreaRef = useRef();

  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    const scrollArea = scrollAreaRef.current;

    if (!track || !slider || !scrollArea) return;

    const updateScrollbar = () => {
      if (scrollArea.scrollHeight <= scrollArea.clientHeight) {
        track.style.display = "none";
        return;
      }

      console.log(scrollArea.scrollHeight, scrollArea.clientHeight);

      track.style.display = "block";

      const scrollRatio = scrollArea.clientHeight / scrollArea.scrollHeight;
      const sliderHeight = Math.max(track.clientHeight * scrollRatio, 30);
      slider.style.height = `${sliderHeight}px`;

      const scrollTop = scrollArea.scrollTop;
      const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
      const scrollProgress = scrollTop / maxScroll;
      const maxSliderTop = track.clientHeight - sliderHeight;
      const sliderTop = scrollProgress * maxSliderTop;

      slider.style.top = `${sliderTop}px`;
    };

    const handleScroll = () => {
      updateScrollbar();
    };

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = scrollArea.scrollTop;
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const delta = e.clientY - startY;
      const scrollRatio =
        (scrollArea.scrollHeight - scrollArea.clientHeight) /
        (track.clientHeight - slider.clientHeight);
      scrollArea.scrollTop = startScrollTop + delta * scrollRatio;
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = "";
    };

    const handleTrackClick = (e) => {
      if (e.target === slider) return;

      const trackRect = track.getBoundingClientRect();
      const clickPosition = e.clientY - trackRect.top;
      const sliderHeight = slider.offsetHeight;

      const newSliderTop = clickPosition - sliderHeight / 2;

      const maxSliderTop = track.clientHeight - sliderHeight;
      const boundedSliderTop = Math.max(
        0,
        Math.min(newSliderTop, maxSliderTop)
      );

      const scrollRatio = boundedSliderTop / maxSliderTop;
      const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;

      scrollArea.scrollTop = scrollRatio * maxScroll;
    };

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scrollArea);

    scrollArea.addEventListener("click", updateScrollbar);
    scrollArea.addEventListener("scroll", handleScroll);
    slider.addEventListener("mousedown", handleMouseDown);
    track.addEventListener("mousedown", handleTrackClick);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    updateScrollbar();

    return () => {
      resizeObserver.disconnect();
      scrollArea.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("mousedown", handleMouseDown);
      track.removeEventListener("click", handleTrackClick);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className={css.folderTree}>
      {Object.keys(treeData).map((key) => (
        <TreeNode
          key={key}
          name={key}
          children={treeData[key]}
          isFile={false}
          depth={0}
          scrollref={scrollAreaRef}
        />
      ))}
      <div className={css.track} ref={trackRef}>
        <div className={css.slider} ref={sliderRef} />
      </div>
    </div>
  );
};

export default FolderTree;
