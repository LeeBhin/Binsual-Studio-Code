import css from "../styles/Home.module.css";
import { ReactComponent as BackgroundSVG } from "../assets/svgs/background-icon.svg";

const EmptyScreen = () => {
  return (
    <div className={css["empty-screen"]}>
      <BackgroundSVG />
      <div className={css.shortkey}>
        <div>
          <div className={css["short-txt"]}>GitHub 열기</div>
          <div className={css.keys}>
            <span>Ctrl</span>+<span>Alt</span>+<span>G</span>
          </div>
        </div>
        <div>
          <div className={css["short-txt"]}>파일에서 찾기</div>
          <div className={css.keys}>
            <span>Ctrl</span>+<span>Shift</span>+<span>F</span>
          </div>
        </div>
        <div>
          <div className={css["short-txt"]}>페이지 닫기</div>
          <div className={css.keys}>
            <span>Alt</span>+<span>F4</span>
          </div>
        </div>
        <div>
          <div className={css["short-txt"]}>전체 화면 설정/해제</div>
          <div className={css.keys}>
            <span>F11</span>
          </div>
        </div>
        <div>
          <div className={css["short-txt"]}>응원하기</div>
          <div className={css.keys}>
            <span>Ctrl</span>+<span>Shift</span>+<span>Alt</span>+<span>Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyScreen;
