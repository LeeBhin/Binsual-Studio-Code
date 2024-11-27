import { useDispatch } from "react-redux";
import { setFocusedTask, setStartLink } from "../../../features/historySlice";
import css from "../../../styles/Start.module.css";
import {
  VscAccount,
  VscTools,
  VscVerified,
  VscRepo,
  VscCallOutgoing,
  VscStarFull,
  VscDebugRerun,
  VscCommentDiscussion,
  VscFlame,
} from "react-icons/vsc";

const Start = () => {
  const dispatch = useDispatch();

  const handleStartClick = (target) => {
    switch (target) {
      case "profile":
        dispatch(setStartLink(["LEE BHIN", "about", "introduction.json"]));
        break;
      case "skill":
        dispatch(setStartLink(["LEE BHIN", "skills", "detail"]));
        break;
      case "certification":
        dispatch(setStartLink(["LEE BHIN", "certifications"]));
        break;
      case "project":
        dispatch(setStartLink(["LEE BHIN", "projects"]));
        break;
      case "contact":
        dispatch(setStartLink(["LEE BHIN", "contact"]));
        break;

      default:
        break;
    }

    dispatch(setFocusedTask("files"));
  };
  return (
    <div className={css.Start}>
      <div className={css.wrap}>
        <div className={css.blank} />
        <div className={css.header}>
          <h1 className={css.title}>Binsual Studio Code</h1>
          <h1 className={css.subTitle}>실력 향상 중</h1>
        </div>

        <div className={css.leftWrap}>
          <div className={css.startWrap}>
            <h3 className={css.sTitle}>시작</h3>
            <ul className={css.links}>
              <li className={css.link}>
                <div
                  className={css.btn}
                  onClick={() => handleStartClick("profile")}
                >
                  <VscAccount className={css.linkIcon} />
                  <span className={css.linkTxt}>프로필...</span>
                </div>
              </li>
              <li className={css.link}>
                <div
                  className={css.btn}
                  onClick={() => handleStartClick("skill")}
                >
                  <VscTools className={css.linkIcon} />
                  <span className={css.linkTxt}>스킬...</span>
                </div>
              </li>
              <li className={css.link}>
                <div
                  className={css.btn}
                  onClick={() => handleStartClick("certification")}
                >
                  <VscVerified className={css.linkIcon} />
                  <span className={css.linkTxt}>자격증...</span>
                </div>
              </li>
              <li className={css.link}>
                <div
                  className={css.btn}
                  onClick={() => handleStartClick("project")}
                >
                  <VscRepo className={css.linkIcon} />
                  <span className={css.linkTxt}>프로젝트...</span>
                </div>
              </li>
              <li className={css.link}>
                <div
                  className={css.btn}
                  onClick={() => handleStartClick("contact")}
                >
                  <VscCallOutgoing className={css.linkIcon} />
                  <span className={css.linkTxt}>연락...</span>
                </div>
              </li>
            </ul>

            <h3 className={css.sTitle}>최근 항목</h3>
            <ul className={css.links}>
              {JSON.parse(localStorage.getItem("recent"))?.map(
                (file, index) => {
                  const parts = file.split("/");
                  const fileName = parts.pop();
                  const filePath =
                    "C:\\Users\\" + parts.join("/").replace(/\//g, "\\");
                  return (
                    <li key={index} className={css.link}>
                      <div className={css.recentBtn}>
                        <span
                          className={css.linkTxt}
                          onClick={() => {
                            dispatch(setStartLink(file.split("/")));
                            dispatch(setFocusedTask("files"));
                          }}
                        >
                          {fileName}
                        </span>
                        <span className={css.linkPath}>{filePath}</span>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </div>
        <div className={css.blank} />
        <div className={css.rightWrap}>
          <h3 className={css.sTitle}>이빈</h3>
          <div className={css.bannerWrap}>
            <div className={css.banner}>
              <div className={css.edge}>
                <VscStarFull />
              </div>
              <div className={css.edgeWrap}>
                <span className={css.edgeTitle}>
                  <b>배움을 즐기는</b> 개발자
                </span>
                <span>새로운 기술을 배우는 것을 즐기는 개발자</span>
              </div>
              <div className={css.bar} />
            </div>
            <div className={css.banner}>
              <span className={css.bannerTxt}>
                <VscDebugRerun className={css.bannerIcon} />
                실패하더라도 몇 번이든 도전
              </span>
              <div className={css.bar} />
            </div>
            <div className={css.banner}>
              <span className={css.bannerTxt}>
                <VscCommentDiscussion className={css.bannerIcon} />
                소통하고 공유하며 함께 성장
              </span>
              <div className={css.bar} />
            </div>
            <div className={css.banner}>
              <span className={css.bannerTxt}>
                <VscFlame className={css.bannerIcon} />한 번 시작한 일은 끝낼
                때까지
              </span>
              <div className={css.bar} />
            </div>
          </div>
        </div>
        <div className={css.blank} />
      </div>
    </div>
  );
};

export default Start;
