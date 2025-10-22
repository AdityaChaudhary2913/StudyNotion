import React from "react";
import Chatbot from "../components/core/Chatbot/Chatbot";

const ChatbotPage = () => {
	return (
		// Use h-screen and flex-col to make a full-height page
		<div className="flex flex-col h-screen bg-richblack-900 text-white p-4 md:p-8">
			<div className="flex-1 min-h-0">
				<Chatbot />
			</div>
		</div>
	);
};

export default ChatbotPage;
