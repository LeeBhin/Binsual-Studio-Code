import css from "../styles/Home.module.css";
import { ReactComponent as BackgroundSVG } from "../assets/svgs/background-icon.svg";

function Home() {
  return (
    <div className={css.Home}>
      <BackgroundSVG />
    </div>
  );
}

export default Home;
