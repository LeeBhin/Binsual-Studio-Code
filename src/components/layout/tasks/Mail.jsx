import { useState, useEffect, useRef } from "react";
import SearchInput from "../../SearchInput";
import CommitButton from "../../CommitButton";

const Mail = ({ isActive = true }) => {
  const [activate, setActivate] = useState(false);
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  useEffect(() => {
    setActivate(fromName.trim() !== "" && message.trim() !== "");
  }, [fromName, message]);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const sendEmail = async (e) => {
    e.preventDefault();
    setActivate(false);

    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${import.meta.env.VITE_FORMSUBMIT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: fromName,
            message,
            _subject: "포트폴리오 메일",
            _captcha: "false",
          }),
        }
      );

      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setFromName("");
        setMessage("");
        alert("성공적으로 전송되었습니다.");
      } else {
        alert(`전송에 실패하였습니다: ${data.message ?? "unknown"}`);
      }
    } catch (error) {
      alert(`전송에 실패하였습니다: ${error.message}`);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={sendEmail}
        className="pt-1.5 pl-[20px] pr-[11px] flex flex-col gap-2.5"
      >
        <SearchInput
          ref={inputRef}
          placeholder="발신자 메일 입력"
          value={fromName}
          onChange={handleChange(setFromName)}
        />

        <SearchInput
          placeholder="메시지 내용 입력"
          value={message}
          onChange={handleChange(setMessage)}
        />

        <CommitButton
          label="전송"
          disabled={!activate}
          onClick={sendEmail}
          className="w-full rounded-sm"
        />
      </form>
    </div>
  );
};

export default Mail;
