import css from "../../styles/Layout.module.css";
import {
  VscRemote,
  VscError,
  VscWarning,
  VscBell,
  VscJson,
} from "react-icons/vsc";

const Footer = () => {
  return (
    <div className={css.footerWrap}>
      <div className={css["footer-left"]}>
        <div className={css.remote}>
          <VscRemote />
        </div>

        <div className={css.problem}>
          <div className={css.err}>
            <span>
              <VscError />
            </span>
            <span className={css["problem-txt"]}>0</span>
          </div>
          <div className={css.warning}>
            <span>
              <VscWarning />
            </span>
            <span className={css["problem-txt"]}>0</span>
          </div>
        </div>
      </div>

      <div className={css["footer-right"]}>
        <div className={css["right-content"]}>
          {
            // 파일 포커싱일때만
            <>
              <div className={css["row-colmun"]}>줄 0, 열 0</div>
              <div className={css["blank"]}>공백: 4</div>
              <div className={css["utf"]}>UTF-8</div>
              <div className={css["CRLF"]}>CRLF</div>
              <div className={css["json"]}>
                <VscJson />
                <span className={css["json-txt"]}>JavaScript</span>
              </div>
              <div className={css["general-txt"]}>일반 텍스트</div>
            </>
          }

          <div className={css["key-array"]}>배열: US</div>
          <div className={css["bell"]}>
            <VscBell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
