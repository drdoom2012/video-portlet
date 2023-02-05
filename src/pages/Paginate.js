import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ postsPerPage, totalPosts, paginate, previousPage, nextPage, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="prague-pagination">
            <nav aria-label="pagination" className="p-pagination">
                <ul className="p-pagination__list">
                    <li onClick={previousPage}>
                        <Link to="" className="p-pagination__control" aria-label="Předchozí stránka">
                            <img src="images/chevron-left.svg" className="p-pagination__arrow" alt="Předchozí stránka" />
                        </Link>
                    </li>
                    {pageNumbers.map((number) => (
                        <li
                            key={number}
                            onClick={() => paginate(number)}
                        >
                            {
                                currentPage != number ? 
                                <Link to="" className="p-pagination__item">{number}</Link> : 
                                <Link to="" className="p-pagination__item p-pagination__item--active" aria-current="page">{number}</Link>
                            }
                        </li>
                    ))}
                    <li onClick={nextPage}>
                        <Link to="" className="p-pagination__control" aria-label="Další stránka">
                            <img src="images/chevron-right.svg" className="p-pagination__arrow" alt="Další stránka" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Paginate;