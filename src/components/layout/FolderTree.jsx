import React, { useEffect, useState } from "react";
import treeData from "../../data/treeData";
import TreeNode from "./TreeNode";
import { useHistory } from "../../store/history";

const FolderTree = ({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen, grow = 1 }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const setIsOpen = controlledSetIsOpen !== undefined ? controlledSetIsOpen : setInternalOpen;
  const startLink = useHistory((s) => s.startLink);

  useEffect(() => {
    setActiveNode({ path: startLink.join("/"), name: startLink.at(-1) });
  }, [startLink]);

  useEffect(() => {
    if (startLink.length < 1) return;
    setIsOpen(true);
  }, [startLink]);

  return (
    <div
      className="text-[13px] flex flex-col overflow-hidden"
      style={{
        flexGrow: isOpen ? grow : 0,
        flexBasis: 0,
        flexShrink: 0,
        minHeight: 22,
        transition: "flex-grow 0.16s linear",
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
