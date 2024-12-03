import emailjs from "emailjs-com";
import { useState, useEffect, useRef } from "react";
import css from "../../../styles/tasks/Mail.module.css";

const Mail = () => {
  const [activate, setActivate] = useState(false);
  const inputRef = useRef(null);
  const msgRef = useRef(null);

  const handleInputChange = (e) => {
    const { from_name, message } = e.target.form;
    const isFormValid =
      from_name.value.trim() !== "" && message.value.trim() !== "";
    setActivate(isFormValid);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    setActivate(false);

    emailjs
      .sendForm(
        process.env.REACT_APP_MAILJS_SERVICE_ID,
        process.env.REACT_APP_MAILJS_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_MAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          inputRef.current.value = "";
          msgRef.current.value = "";

          alert("성공적으로 전송되었습니다.");
        },
        (error) => {
          alert(`전송에 실패하였습니다: ${error.text}`);
        }
      );
  };

  return (
    <div className={css.Mail}>
      <form onSubmit={sendEmail} className={css.form}>
        <input
          type="text"
          name="from_name"
          className={css.input}
          autoComplete="off"
          placeholder="발신자 메일 입력"
          ref={inputRef}
          onChange={handleInputChange}
        />

        <input
          name="message"
          className={css.input}
          autoComplete="off"
          placeholder="메시지 내용 입력"
          ref={msgRef}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className={css.submit}
          style={!activate ? { opacity: "0.6", cursor: "not-allowed" } : {}}
          disabled={!activate}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default Mail;
