import { ListGroup } from "react-bootstrap";

const clauses = [
    "This agreement is governed by Indian law.",
    "The parties agree to confidentiality.",
    "Termination clause applies after 30 days.",
];

const ClauseLibraryPanel = () => {
    return (
        <div className="p-3 border-bottom">
            <strong>Clause Library</strong>
            <ListGroup className="mt-2">
                {clauses.map((c, i) => (
                    <ListGroup.Item key={i}>{c}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default ClauseLibraryPanel;
