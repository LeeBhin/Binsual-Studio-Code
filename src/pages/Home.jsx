import { useSelector } from "react-redux";
import CurrentFiles from "../components/CurrentFiles";
import EmptyScreen from "../components/EmptyScreen";
import FileScreen from "../components/FileScreen";
import css from "../styles/Home.module.css";

const Home = () => {
  const { currentFiles } = useSelector((state) => state.history);

  return (
    <div className={css.Home}>
      {currentFiles.length === 0 ? (
        <EmptyScreen />
      ) : (
        <>
          <div className={css.fileArea}>
            <div className={css.filesTop}>
              <CurrentFiles />
            </div>

            <div className={css.file}>
              <FileScreen />
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export default Home;
