import "./assets/App.css";
import circuit from "./assets/img/circuit.png";
import line from "./assets/img/line.png";
import red from "./assets/img/flagred.png";
import green from "./assets/img/flaggreen.png";
import innovation from "./assets/img/innovation.png";
import applicability from "./assets/img/applicability.png";
import finance from "./assets/img/finance.png";
import potential from "./assets/img/potential.png";
import security from "./assets/img/security.png";
import solution from "./assets/img/solution.png";
import target from "./assets/img/target.png";
import { useEffect, useRef, useState } from "react";
import Modal from "./modal/modal1";
import ChatBubble from "./modal/bubble";
import { useDispatch, useSelector } from "react-redux";
import { getAnalyseData } from "./redux/features/analysedata/analyseSlice";
import loadingAnimation from "./assets/loader.json";
import {
  addUserMessage,
  getChatData,
} from "./redux/features/chatdata/chatSlice";
import { marked } from "marked";
import Lottie from "react-lottie";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({ prop: "", flag: "" });
  const [value] = useState("");
  const textareaRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const chatWrapperRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const { analyse } = useSelector((state) => state.analyse);

  const accordionData = [
    {
      id: 1,
      title: "Technology & Innovation",
      img: innovation,
      content: [
        "Assessment of the project's technological infrastructure.",
        "Degree of innovative solutions and uniqueness.",
      ],
    },
    {
      id: 2,
      title: "Financial Model & Tokenomics",
      img: finance,
      content: [
        "Financial structure and revenue model of the project.",
        "Token distribution and economics.",
      ],
    },
    {
      id: 3,
      title: "Applicability & Use Cases",
      img: applicability,
      content: [
        "Real-world use cases of the project.",
        "User base and adoption potential.",
      ],
    },
    {
      id: 4,
      title: "Problem & Solution",
      img: solution,
      content: [
        "Clarity and significance of the problem.",
        "Feasibility and practicality of implementation.",
      ],
    },
    {
      id: 5,
      title: "Market Potential",
      img: potential,
      content: [
        "Size and accessibility of the target market.",
        "Competitive analysis and market trends.",
      ],
    },
    {
      id: 6,
      title: "Security & Compliance",
      img: security,
      content: [
        "Security measures and compliance standards of the project..",
        "Adherence to legal regulations.",
      ],
    },
    {
      id: 7,
      title: "Market & Audience Strategy",
      img: target,
      content: [
        "Market entry plan and positioning.",
        "Identifying and engaging the target demographic.",
      ],
    },
  ];

  const openModal = (prop, flag, color) => {
    setModalData({ prop, flag, color });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendChat(event);
    }
  };

  const handleUploadPdf = async (event) => {
    const file = event.target.files[0];
    const maxFileSize = 500 * 1024 * 1024;
    if (!file) {
      console.log("Please select a file to upload.");
      return;
    } else if (file.type !== "application/pdf") {
      console.log("Only PDF files are allowed.");
      return;
    } else if (file.size > maxFileSize) {
      console.log("File size exceeds 500MB. Please upload a smaller file.");
      return;
    } else {
      try {
        setIsLoading(true);
        const resultAction = await dispatch(getAnalyseData(file));

        if (getAnalyseData.fulfilled.match(resultAction)) {
          setIsLoading(false);
          setUploaded(true); // Set upload to true after successful dispatch
        } else {
          console.log(
            "Upload failed:",
            resultAction.payload || resultAction.error.message
          );
        }
      } catch (error) {
        console.error("An error occurred during file upload:", error);
      }
    }
  };

  const [input, setInput] = useState("");
  const chat = useSelector((state) => state.chat.chat);

  const handleSendChat = async (event) => {
    event.preventDefault();
    if (input.trim()) {
      dispatch(addUserMessage(input));
      dispatch(getChatData(input));
      setInput("");
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const renderMessage = (message) => {
    const markdownMessage = message.replace(/\n/g, "  \n");
    const htmlContent = marked(markdownMessage);
    return { __html: htmlContent };
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

 
  return (
    <>
      <div className="background"></div>
      <>
        {!uploaded ? (
          <>
            <div className={`blur ${isLoading?"":"d-none"}`}></div>
            <div className={`loadingAnimation ${isLoading?"":"d-none"}`}>
              <Lottie options={defaultOptions} height={100} width={100} />
            </div>

            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="headerWrapper">
                    <h1 className="header">WHITEPAPER IQ</h1>
                    <img src={circuit} className="headerImg noDrag" alt="" />
                  </div>
                </div>
                <div className="col-12">
                  <div>
                    <div className="uploadWrapper mb-3 mb-lg-0">
                      <form>
                        <label
                          htmlFor="agreement-file-upload"
                          className="uploadButton"
                        >
                          Upload Whitepaper{" "}
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                        </label>
                        <input
                          id="agreement-file-upload"
                          className="d-none"
                          type="file"
                          onChange={(e) => handleUploadPdf(e)}
                        />
                        <button
                          type="submit"
                          style={{ display: "none" }}
                          className="agreement"
                        ></button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="accordion" id="mainAccordion">
                    <div className="row d-flex justify-content-center">
                      {accordionData.map((item) => (
                        <div className="col-12 col-xl-4" key={item.id}>
                          <div className="accordion-item mx-3 my-2 my-lg-3">
                            <h2
                              className="accordion-header"
                              id={`heading${item.id}`}
                            >
                              <button
                                className="accordion-button collapsed w-100 p-2"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${item.id}`}
                                aria-expanded="false"
                                aria-controls={`collapse${item.id}`}
                              >
                                <div
                                  className="row w-100 m-0"
                                  style={{ width: "100%" }}
                                >
                                  <div className="col-4 p-0 m-auto d-flex justify-content-center">
                                    <img
                                      src={item.img}
                                      className="image"
                                      alt=""
                                    />
                                  </div>
                                  <div className="col-8 px-3 p-0 m-auto">
                                    {item.title}
                                    <div
                                      id={`collapse${item.id}`}
                                      className="accordion-collapse collapse"
                                      aria-labelledby={`heading${item.id}`}
                                    >
                                      <div
                                        className="accordion-body ps-0 p-3"
                                        style={{
                                          borderRadius: "0px 0px 8px 8px",
                                        }}
                                      >
                                        <div className="">
                                          <div className="">
                                            <ul className="text-start m-0">
                                              {item.content.map(
                                                (contentItem, index) => (
                                                  <li key={index}>
                                                    {contentItem}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Modal show={isModalOpen} onClose={closeModal} data={modalData} />
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="headerWrapper">
                    <h1 className="header">WHITEPAPER IQ</h1>
                    <img src={line} className="headerImg noDrag" alt="" />
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-center">
                  <div className="accordion" id="resultAccordion">
                    <div className="row d-flex justify-content-center">
                      <h5 className="m-0 mb-2 text-start ps-4">Results:</h5>
                      {accordionData.map((item) => {
                        const additionalData = analyse[item.title] || {};
                        console.log();
                        return (
                          <>
                            <div className="col-12 col-xl-6" key={item.id}>
                              <div className="accordion-item mx-3 my-1">
                                <h2
                                  className="accordion-header"
                                  id={`heading${item.id}`}
                                >
                                  <button
                                    className="accordion-button collapsed w-100 p-2"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${item.id}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${item.id}`}
                                  >
                                    <div
                                      className="row w-100 m-0"
                                      style={{ width: "100%" }}
                                    >
                                      <div className="col-2 p-0 m-auto d-flex justify-content-center">
                                        <img
                                          src={item.img}
                                          className="image"
                                          alt=""
                                        />
                                      </div>
                                      <div className="col-10 ps-3 p-0 m-auto">
                                        <span className="pe-4">
                                          {item.title} {additionalData.point}%
                                        </span>
                                        <div
                                          id={`collapse${item.id}`}
                                          className="accordion-collapse collapse"
                                          aria-labelledby={`heading${item.id}`}
                                        >
                                          <div
                                            className="accordion-body pt-3 pb-1 px-0"
                                            style={{
                                              borderRadius: "0px 0px 8px 8px",
                                              width: "100%",
                                            }}
                                          >
                                            <div className="row m-0">
                                              <div className="col-10 p-0">
                                                <ul className="text-start m-0">
                                                  {item.content.map(
                                                    (contentItem, index) => (
                                                      <li key={index}>
                                                        {contentItem}
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>

                                              <div
                                                className="col-2 p-0"
                                                style={{ marginTop: "-10px" }}
                                              >
                                                <div className="col-12 text-end mb-2">
                                                  <img
                                                    onClick={() =>
                                                      openModal(
                                                        item.title,
                                                        additionalData[
                                                          "Red Flag"
                                                        ],
                                                        "red"
                                                      )
                                                    }
                                                    className="flag"
                                                    src={red}
                                                    alt=""
                                                  />
                                                </div>
                                                <div className="col-12 text-end">
                                                  <img
                                                    onClick={() =>
                                                      openModal(
                                                        item.title,
                                                        additionalData[
                                                          "Green Flag"
                                                        ],
                                                        "green"
                                                      )
                                                    }
                                                    className="flag"
                                                    src={green}
                                                    alt=""
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </h2>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                      <div className="chatWrapper" ref={chatWrapperRef}>
                        {chat.map((message, index) => (
                          <ChatBubble
                            key={index}
                            side={message.from === "user" ? "right" : "left"}
                          >
                            <div
                              className="m-0"
                              dangerouslySetInnerHTML={renderMessage(
                                message.message
                              )}
                            />
                          </ChatBubble>
                        ))}
                        <div ref={bottomRef}></div>
                      </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                      <form onSubmit={handleSendChat}>
                        <div className="inputWrapper mt-1">
                          <textarea
                            ref={textareaRef}
                            onKeyDown={handleKeyDown}
                            rows="1"
                            className="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                          />
                          <button type="submit" className="inputButton">
                            Ask
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="uploadWrapper">
                    {/* <form>
                    <label
                      htmlFor="agreement-file-upload"
                      className="uploadButton"
                    >
                      Upload Whitepaper{" "}
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </label>
                    <input
                      id="agreement-file-upload"
                      className="d-none"
                      type="file"
                      onChange={(e) => handleUploadPdf(e)}
                    />
                    <button
                      type="submit"
                      style={{ display: "none" }}
                      className="agreement"
                    ></button>
                  </form> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </>
  );
}

export default App;
