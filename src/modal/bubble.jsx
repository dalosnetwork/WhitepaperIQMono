import { useRef, useEffect, useState } from 'react';


const ChatBubble = ({ children, side }) => {
    const contentRef = useRef(null);


    return (
        <>
            <div className={`text-start ps-3 fade-slide-up ${side === 'left' ? 'chat-bubble-left' : 'chat-bubble-right'}`}>
                <div className="chat-content" ref={contentRef}>
                    {children}
                </div>
                <div className="chat-bubble-pointer"></div>
            </div>
        </>
    );
};

export default ChatBubble;

