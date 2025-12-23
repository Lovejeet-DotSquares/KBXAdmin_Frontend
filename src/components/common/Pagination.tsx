import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";

interface Props {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
    page,
    pageSize,
    total,
    onChange,
}) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    return (
        <BSPagination size="sm" className="justify-content-center mt-2">
            <BSPagination.Prev
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
            />

            {Array.from({ length: totalPages }).map((_, i) => (
                <BSPagination.Item
                    key={i}
                    active={page === i + 1}
                    onClick={() => onChange(i + 1)}
                >
                    {i + 1}
                </BSPagination.Item>
            ))}

            <BSPagination.Next
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
            />
        </BSPagination>
    );
};

export default Pagination;
