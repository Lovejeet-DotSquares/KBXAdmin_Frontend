import { ListGroup, Badge } from "react-bootstrap";
import { useQuestionBank } from "../hooks/useQuestionBank";

const QuestionBankPanel = () => {
    const { items } = useQuestionBank();

    return (
        <div className="p-3 border-bottom">
            <strong>Question Bank</strong>

            <ListGroup className="mt-2">
                {items.map((q) => (
                    <ListGroup.Item key={q.id}>
                        <div className="fw-medium">{q.label}</div>
                        <small className="text-muted">
                            {q.type} • {q.difficulty}
                        </small>
                        <Badge bg="secondary" className="ms-2">
                            {q.category || "General"}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default QuestionBankPanel;
