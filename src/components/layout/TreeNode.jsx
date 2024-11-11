import React, { useState, memo, useRef, useEffect } from "react";
import {
  VscChevronDown,
  VscChevronRight,
  VscBlank,
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll,
} from "react-icons/vsc";
import Icons from "../../assets/icons";
import css from "../../styles/Layout.module.css";
import treeData from "../../data/treeData";

const FileIcon = ({ extension }) => {
  let iconKey = extension.replace(".", "");

  if (iconKey === "sql" || iconKey === "accdb") {
    iconKey = "sql";
  }

  const IconComponent =
    Icons[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];

  if (IconComponent) {
    return <IconComponent className={css.icon} />;
  }
};

const TreeNode = memo(
  ({ name, children, isFile, extension, depth, scrollref }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      if (!isFile) {
        setIsOpen((prev) => !prev);
      }
    };

    return (
      <div className={css.treeNodeWrap}>
        <div className={css.treeNode} onClick={handleClick}>
          {isFile ? (
            <div className={css.fileWrap}>
              <div
                className={css.file}
                style={{ paddingLeft: `${depth * 8}px` }}
              >
                <div>
                  <VscBlank style={{ marginRight: "-1px" }} />
                </div>
                <div>
                  <FileIcon extension={extension} />
                </div>
                <span className={css.name}>{name}</span>
              </div>
            </div>
          ) : (
            <div
              className={css.folderWrap}
              style={name === "LEE BHIN" ? { background: "none" } : {}}
            >
              <div
                className={css.folder}
                style={{ paddingLeft: `${depth * 8}px` }}
              >
                {name === "LEE BHIN" ? (
                  <>
                    {isOpen ? (
                      <div>
                        <VscChevronDown
                          className={css.treeIcon}
                          style={{ paddingLeft: "1px" }}
                        />
                      </div>
                    ) : (
                      <div>
                        <VscChevronRight
                          className={css.treeIcon}
                          style={{ paddingLeft: "1px" }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isOpen ? (
                      <>
                        <div>
                          <VscChevronDown className={css.treeIcon} />
                        </div>
                        <div>
                          <Icons.FolderOpen className={css.folderIcon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <VscChevronRight className={css.treeIcon} />
                        </div>
                        <div>
                          <Icons.Folder className={css.folderIcon} />
                        </div>
                      </>
                    )}
                  </>
                )}
                <span
                  style={
                    name === "LEE BHIN"
                      ? { fontWeight: "bold", fontSize: "12px" }
                      : {}
                  }
                >
                  <div
                    className={css.name}
                    style={
                      name === "LEE BHIN"
                        ? {
                            width: "180px",
                            display: "flex",
                            justifyContent: "space-between",
                          }
                        : {}
                    }
                  >
                    <div className={css.nameTxt}>{name}</div>
                    {name === "LEE BHIN" && (
                      <div className={css.rootFolderTool}>
                        <div className={css["side-icon-bg"]}>
                          <VscNewFile />
                        </div>
                        <div className={css["side-icon-bg"]}>
                          <VscNewFolder />
                        </div>
                        <div className={css["side-icon-bg"]}>
                          <VscRefresh />
                        </div>
                        <div className={css["side-icon-bg"]}>
                          <VscCollapseAll />
                        </div>
                      </div>
                    )}
                  </div>
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className={css.treeChildren}
          ref={name === "LEE BHIN" ? scrollref : null}
          style={
            name === "LEE BHIN"
              ? {
                  display: isOpen ? "block" : "none",
                  overflowY: "auto",
                  height: "calc(100vh - 93px)",
                  position: "relative",
                }
              : {
                  display: isOpen ? "block" : "none",
                }
          }
        >
          {!isFile &&
            Object.keys(children).map((key) => (
              <TreeNode
                key={key}
                name={key}
                children={children[key]}
                isFile={children[key] === null}
                extension={children[key] === null ? getExtension(key) : null}
                depth={depth + 1}
              />
            ))}
        </div>
      </div>
    );
  }
);

const getExtension = (fileName) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? "." + parts[parts.length - 1] : "";
};

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
