import React from "react";
import { ListGroup } from "react-bootstrap";

const questions = [
    "What is your full name?",
    "What is your date of birth?",
    "What is your address?",
];

const QuestionBankPanel = () => {
    return (
        <div className="p-3 border-bottom">
            <strong>Question Bank</strong>
            <ListGroup className="mt-2">
                {questions.map((q, i) => (
                    <ListGroup.Item key={i}>{q}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default QuestionBankPanel;
