import emailjs from "emailjs-com";
import { useState, useEffect, useRef } from "react";

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
        import.meta.env.VITE_MAILJS_SERVICE_ID,
        import.meta.env.VITE_MAILJS_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_MAILJS_PUBLIC_KEY
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

  const inputCls =
    "w-[calc(100%-15px)] rounded-sm bg-[var(--input)] border border-[var(--border-2)] text-[var(--text)] text-[13px] px-[5px] py-[5px] outline-none truncate focus:border-[var(--accent)]";
  const submitCls =
    "w-[calc(100%-15px)] py-1 rounded-md border-none bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="w-full">
      <form
        onSubmit={sendEmail}
        className="mt-1.5 w-full flex flex-col items-center gap-2.5"
      >
        <input
          type="text"
          name="from_name"
          className={inputCls}
          autoComplete="off"
          placeholder="발신자 메일 입력"
          ref={inputRef}
          onChange={handleInputChange}
        />

        <input
          name="message"
          className={inputCls}
          autoComplete="off"
          placeholder="메시지 내용 입력"
          ref={msgRef}
          onChange={handleInputChange}
        />

        <button type="submit" className={submitCls} disabled={!activate}>
          전송
        </button>
      </form>
    </div>
  );
};

export default Mail;
