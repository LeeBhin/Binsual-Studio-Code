import React, { useEffect, useRef, useState } from "react";
import treeData from "../../data/treeData";
import TreeNode from "./TreeNode";
import { useHistory } from "../../store/history";

const FolderTree = ({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen, grow = 1, basis, innerRef, isResizing = false }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const setIsOpen = controlledSetIsOpen !== undefined ? controlledSetIsOpen : setInternalOpen;
  const startLink = useHistory((s) => s.startLink);
  const containerRef = useRef(null);

  useEffect(() => {
    setActiveNode({ path: startLink.join("/"), name: startLink.at(-1) });
  }, [startLink]);

  useEffect(() => {
    if (startLink.length < 1) return;
    setIsOpen(true);
  }, [startLink]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveNode(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const flexStyle = !isOpen
    ? { flexGrow: 0, flexBasis: 0 }
    : basis != null
    ? { flexGrow: 0, flexBasis: `${basis}px` }
    : { flexGrow: grow, flexBasis: 0 };

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (typeof innerRef === "function") innerRef(el);
        else if (innerRef) innerRef.current = el;
      }}
      className="text-[13px] flex flex-col overflow-hidden group/tree"
      style={{
        ...flexStyle,
        flexShrink: 0,
        minHeight: 22,
        transition: isResizing
          ? "none"
          : "flex-grow 0.16s linear, flex-basis 0.16s linear",
      }}
    >
      {Object.keys(treeData).map((key) => (
        <TreeNode
          key={key}
          name={key}
          children={treeData[key]}
          isFile={false}
          depth={0}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
          isOpenProp={isOpen}
          setIsOpenProp={setIsOpen}
        />
      ))}
    </div>
  );
};

export default FolderTree;
