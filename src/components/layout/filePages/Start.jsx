import css from "../../../styles/Start.module.css";

const Start = () => {
  return (
    <div className={css.Start}>
      <div className={css.wrap}>
        <div className={css.titleWrap}>
          <h1 className={css.title}>Visual Studio Code</h1>
          <h1 className={css.subTitle}>편집 향상됨</h1>
        </div>

        <div className={css.contentWrap}>
          <div className={css.leftWrap}>
            <div className={css.startWrap}>
              <h3 className={css.startTitle}>시작</h3>
              <div className={css.links}>
                <div className={css.link}>
                  <span className={css.linkTxt}>정보 열기...</span>
                </div>
                <div className={css.link}>
                  <span className={css.linkTxt}>스킬 열기...</span>
                </div>
                <div className={css.link}>
                  <span className={css.linkTxt}>자격증 열기...</span>
                </div>
                <div className={css.link}>
                  <span className={css.linkTxt}>프로젝트 열기...</span>
                </div>
                <div className={css.link}>
                  <span className={css.linkTxt}>연락처...</span>
                </div>
              </div>
            </div>
            <div className={css.startWrap}>
              <h3 className={css.startTitle}>최근 항목</h3>
              <div className={css.links}>
                <div className={css.link}>
                  <span className={css.fileName}>file name</span>
                  <span className={css.filePath}>file path</span>
                </div>
                <div className={css.link}>
                  <span className={css.fileName}>file name</span>
                  <span className={css.filePath}>file path</span>
                </div>
                <div className={css.link}>
                  <span className={css.fileName}>file name</span>
                  <span className={css.filePath}>file path</span>
                </div>
                <div className={css.link}>
                  <span className={css.fileName}>file name</span>
                  <span className={css.filePath}>file path</span>
                </div>
                <div className={css.link}>
                  <span className={css.fileName}>file name</span>
                  <span className={css.filePath}>file path</span>
                </div>
                <div className={css.link}>
                  <span className={css.fileName}>자세히...</span>
                </div>
              </div>
            </div>
          </div>

          <div className={css.rightWrap}>
            <div className={css.leebhin}>
              <h3 className={css.startTitle}>이빈</h3>
              <div className={css.vsStart}>
                <span>
                  <b>배움을 즐기는 개발자</b>
                </span>
                <span>새로운 기술을 배우는 것을 즐기는 개발자 이빈입니다.</span>
              </div>
              <div className={css.vsStart}>
                <span>
                  <b>다양한 방법으로 문제를 해결</b>
                </span>
              </div>
              <div className={css.vsStart}>
                <span>
                  <b>포기하지 않고 끝까지 노력</b>
                </span>
              </div>
              <div className={css.vsStart}>
                <span>
                  <b>거부감 없이 새로운 기술을 학습</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
