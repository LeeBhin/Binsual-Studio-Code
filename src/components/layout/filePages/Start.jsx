import {
  useHistory,
  setFocusedTask,
  setIsLayoutActive,
  setStartLink,
} from "../../../store/history";
import Codicon from "../../Codicon";

const sTitleCls = "text-[#CDCDCD] font-normal text-[19.5px] pb-[5px]";
const linkCls = "mt-[5px] text-[#3795FF] text-[13px]";
const btnCls = "py-[3px] flex items-center gap-1.5 cursor-pointer w-fit";
const linkTxtCls = "whitespace-nowrap cursor-pointer text-[#3795FF]";
const bannerCls =
  "rounded-md bg-[var(--border)] hover:bg-[var(--hover-banner)] text-[13px] pt-[7px] px-[7px] pb-3 cursor-pointer relative text-[#CDCDCD]";
const bannerTxtCls = "flex items-center";
const barCls =
  "absolute bottom-0 left-0 w-full bg-[var(--accent)] h-1 rounded-b-md";

const StartLink = ({ icon, label, onClick }) => (
  <li className={linkCls}>
    <div className={btnCls} onClick={onClick}>
      <Codicon name={icon} size={20} className="text-[#3795FF]" />
      <span className={linkTxtCls}>{label}</span>
    </div>
  </li>
);

const Start = () => {
  const isLayoutActive = useHistory((s) => s.isLayoutActive);

  const handleStartClick = (target) => {
    switch (target) {
      case "profile":
        setStartLink(["LEE-BHIN", "about", "introduction.json"]);
        break;
      case "skill":
        setStartLink(["LEE-BHIN", "skills", "detail"]);
        break;
      case "certification":
        setStartLink(["LEE-BHIN", "certifications"]);
        break;
      case "project":
        setStartLink(["LEE-BHIN", "projects"]);
        break;
      case "contact":
        setStartLink(["LEE-BHIN", "contact"]);
        break;

      default:
        break;
    }

    setFocusedTask("files");
    setIsLayoutActive({
      width: isLayoutActive.width,
      isActive: true,
      from: "layout",
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-full px-[25px]">
      <div className="grid max-w-[1200px] w-full h-[98%] [grid-template-columns:minmax(20px,1.6fr)_minmax(0,10fr)_minmax(20px,1.6fr)_minmax(0,10fr)_minmax(20px,1.6fr)] [grid-template-rows:1fr_3fr_0.1fr] max-[699px]:[grid-template-columns:1fr] max-[699px]:[grid-template-rows:0fr_auto_1fr] max-[699px]:h-[93%]">
        <div className="[grid-column:1] [grid-row:2] max-[699px]:hidden" />
        <div className="[grid-column:2/span_3] [grid-row:1] flex flex-col justify-end mb-[25px] max-[699px]:hidden">
          <h1 className="text-[#CDCDCD] text-[35px] font-normal leading-none">
            Binsual Studio Code
          </h1>
          <h1 className="text-[#989898] text-[22px] font-normal leading-none mt-[3px]">
            실력 향상 중
          </h1>
        </div>

        <div className="[grid-column:2] [grid-row:2] max-[699px]:[grid-column:1] max-[699px]:[grid-row:2]">
          <div>
            <h3 className={sTitleCls}>시작</h3>
            <ul className="mb-5">
              <StartLink
                icon="account"
                label="프로필..."
                onClick={() => handleStartClick("profile")}
              />
              <StartLink
                icon="tools"
                label="스킬..."
                onClick={() => handleStartClick("skill")}
              />
              <StartLink
                icon="verified"
                label="자격증..."
                onClick={() => handleStartClick("certification")}
              />
              <StartLink
                icon="repo"
                label="프로젝트..."
                onClick={() => handleStartClick("project")}
              />
              <StartLink
                icon="call-outgoing"
                label="연락..."
                onClick={() => handleStartClick("contact")}
              />
            </ul>

            <h3 className={sTitleCls}>최근 항목</h3>
            <ul className="mb-5">
              {JSON.parse(localStorage.getItem("recent"))?.map(
                (file, index) => {
                  const parts = file.split("/");
                  const fileName = parts.pop();
                  const filePath =
                    "C:\\Users\\" + parts.join("/").replace(/\//g, "\\");
                  return (
                    <li
                      key={index}
                      className={`${linkCls} max-[699px]:[&:nth-child(4)]:hidden max-[699px]:[&:nth-child(5)]:hidden`}
                    >
                      <div>
                        <span
                          className={linkTxtCls}
                          onClick={() => {
                            setIsLayoutActive({
                              width: isLayoutActive.width,
                              isActive: true,
                              from: "layout",
                            });
                            setStartLink(file.split("/"));
                            setFocusedTask("files");
                          }}
                        >
                          {fileName}
                        </span>
                        <span className="text-[#CDCDCD] cursor-auto ml-[14px] font-normal">
                          {filePath}
                        </span>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
        <div className="[grid-column:3] [grid-row:3] max-[699px]:hidden" />
        <div className="[grid-column:4] [grid-row:2] max-[699px]:[grid-column:1] max-[699px]:[grid-row:3/span_1]">
          <h3 className={sTitleCls}>이빈</h3>
          <div className="flex flex-col gap-4 mt-[5px]">
            <div className={bannerCls}>
              <div className="absolute top-0 left-0 rounded-tl-md w-10 h-[30px] bg-[var(--accent)] [clip-path:polygon(0_0,100%_0,0_100%)]">
                <Codicon
                  name="star-full"
                  size={16}
                  className="text-white m-0.5"
                />
              </div>
              <div className="flex flex-col gap-[5px] ml-[30px]">
                <span className="text-[14px]">
                  <b>배움을 즐기는</b> 개발자
                </span>
                <span>새로운 기술을 배우는 것을 즐기는 개발자</span>
              </div>
              <div className={barCls} />
            </div>
            <div className={bannerCls}>
              <span className={bannerTxtCls}>
                <Codicon name="debug-rerun" size={20} className="mr-2 text-[var(--accent-soft)]" />
                실패하더라도 몇 번이든 도전
              </span>
              <div className={barCls} />
            </div>
            <div className={bannerCls}>
              <span className={bannerTxtCls}>
                <Codicon name="flame" size={20} className="mr-2 text-[var(--accent-soft)]" />
                한 번 시작한 일은 끝낼 때까지
              </span>
              <div className={barCls} />
            </div>
            <div className={bannerCls}>
              <span className={bannerTxtCls}>
                <Codicon name="comment-discussion" size={20} className="mr-2 text-[var(--accent-soft)]" />
                소통하고 공유하며 함께 성장
              </span>
              <div className={barCls} />
            </div>
          </div>
        </div>
        <div className="[grid-column:5] [grid-row:2] max-[699px]:hidden" />
      </div>
    </div>
  );
};

export default Start;
