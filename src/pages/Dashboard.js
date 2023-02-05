import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Paginate from './Paginate';

function Dashboard() {
    const initialStateFilter = {
        filterSearchText: "",
        filterElectionPeriod: "",
    };

    const [items, setItems] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState("12");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState(initialStateFilter);

    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentItems = items.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== Math.ceil(items.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        console.log('mounted');
        const items = [];
        items.push({ id: "1", title: "39. zasedání Zastupitelstva hlavního města Prahy z 8.9.2022", start: "8.9.2022" });
        items.push({ id: "2", title: "3. mimořádné zasedání Zastupitelstva hlavního města Prahy ze dne 27.6.2022", start: "27.6.2022" });
        items.push({ id: "3", title: "38. zasedání Zastupitelstva hlavního města Prahy z 16.6.2022", start: "16.6.2022" });
        items.push({ id: "4", title: "37. zasedání Zastupitelstva hlavního města Prahy z 26.5.2022", start: "26.5.2022" });
        items.push({ id: "5", title: "36. zasedání Zastupitelstva hlavního města Prahy z 28.4.2022", start: "28.4.2022" });
        items.push({ id: "6", title: "35. zasedání Zastupitelstva hlavního města Prahy z 24.3.2022", start: "24.3.2022" });
        items.push({ id: "7", title: "34. zasedání Zastupitelstva hlavního města Prahy z 24.2.2022", start: "24.2.2022" });
        items.push({ id: "8", title: "33. zasedání Zastupitelstva hlavního města Prahy z 27.1.2022", start: "27.1.2022" });
        items.push({ id: "9", title: "32. zasedání Zastupitelstva hlavního města Prahy z 16.12.2021", start: "16.12.2021" });
        items.push({ id: "10", title: "31. zasedání Zastupitelstva hlavního města Prahy z 11.11.2021 a z pokračování 12.11.2021", start: "11.11.2021" });
        items.push({ id: "11", title: "30. zasedání Zastupitelstva hlavního města Prahy ze dne 14.10.2021", start: "14.10.2021" });
        items.push({ id: "12", title: "29. zasedání Zastupitelstva hlavního města Prahy ze dne 9.9.2021", start: "9.9.2021" });

        items.push({ id: "13", title: "x39. zasedání Zastupitelstva hlavního města Prahy z 8.9.2022", start: "8.9.2022" });
        items.push({ id: "14", title: "x3. mimořádné zasedání Zastupitelstva hlavního města Prahy ze dne 27.6.2022", start: "27.6.2022" });
        items.push({ id: "15", title: "x38. zasedání Zastupitelstva hlavního města Prahy z 16.6.2022", start: "16.6.2022" });
        items.push({ id: "16", title: "x37. zasedání Zastupitelstva hlavního města Prahy z 26.5.2022", start: "26.5.2022" });
        items.push({ id: "17", title: "x36. zasedání Zastupitelstva hlavního města Prahy z 28.4.2022", start: "28.4.2022" });
        items.push({ id: "18", title: "x35. zasedání Zastupitelstva hlavního města Prahy z 24.3.2022", start: "24.3.2022" });
        items.push({ id: "19", title: "x34. zasedání Zastupitelstva hlavního města Prahy z 24.2.2022", start: "24.2.2022" });
        items.push({ id: "20", title: "x33. zasedání Zastupitelstva hlavního města Prahy z 27.1.2022", start: "27.1.2022" });
        items.push({ id: "21", title: "x32. zasedání Zastupitelstva hlavního města Prahy z 16.12.2021", start: "16.12.2021" });
        items.push({ id: "22", title: "x31. zasedání Zastupitelstva hlavního města Prahy z 11.11.2021 a z pokračování 12.11.2021", start: "11.11.2021" });
        items.push({ id: "23", title: "x30. zasedání Zastupitelstva hlavního města Prahy ze dne 14.10.2021", start: "14.10.2021" });
        items.push({ id: "24", title: "x29. zasedání Zastupitelstva hlavního města Prahy ze dne 9.9.2021", start: "9.9.2021" });

        setItems(items);
    }, []);

    function handleFilter(value, key) {
        setFilter(ev => ({
            ...ev,
            [key]: value,
        }))
    }
    function handleItemsPerPage(e) {
        setItemsPerPage(e);
        setCurrentPage(1);
    }

    function resetFilter() {
        setFilter(initialStateFilter);
    }

    return (
        <div className="section">
            <div className="container-offset">

                <div className="filter-box">

                    <div className="filter-grid-row">
                        <div className="filter-grid-col filter-grid-col--md-6 filter-grid-col--lg-4">
                            <div className="p-form-group">
                                <label htmlFor="filter-form-text" className="p-form-label">Text</label>
                                <input type="text" name="filter-form-text" className="p-form-input p-form-input--search" id="filter-form-text" placeholder="Napiště, co hledáte"
                                    value={filter.filterSearchText} onChange={e => handleFilter(e.target.value, "filterSearchText")} />
                            </div>
                        </div>
                        <div className="filter-grid-col filter-grid-col--md-6 filter-grid-col--lg-4">
                            <div className="p-form-group">
                                <label htmlFor="filter-form-type-select" className="p-form-label">Vyberte období</label>
                                <select name="filter-form-type-select" className="p-form-select" id="filter-form-type-select"
                                    value={filter.filterElectionPeriod} onChange={e => handleFilter(e.target.value, "filterElectionPeriod")}>
                                    <option data-placeholder="true">Období</option>
                                    <option value="1">2022 - 2026</option>
                                    <option value="2">2018 - 2022</option>
                                </select>
                            </div>
                        </div>
                        <div className="filter-grid-col filter-grid-col--md-6 filter-grid-col--lg-4">
                            <div className="p-cancel-filters">
                                <button type="submit" className="btn-prg btn-prg-outline-primary">Vyhledat <img src="images/icon-search-red.svg" alt="Ikona Vyhledávání" className="btn-prg-icon-right" /></button>
                                <Link to="" className="p-cancel-filters__link" onClick={e => resetFilter()}>Zrušit filtry</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prg-search--results-header">
                    <p>Celkem <strong>2 415</strong> záznamů</p>

                    <div className="prg-search--results-orderby">
                        <div className="prg-search--results-orderby-item">
                            <label htmlFor="prg-search-form-type-select" className="prg-search--label">Na stránce</label>
                            <select name="prg-search-form-type-select" className="p-form-select prg-search--select" id="prg-search-form-type-select"
                                value={itemsPerPage} onChange={e => handleItemsPerPage(e.target.value)}>
                                <option value="8">8</option>
                                <option value="12">12</option>
                                <option value="16">16</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="w-layout-grid grid-default grid-info-boxes u-mb--unset">
                    {currentItems.map(item => (
                        <a href="" className="box-basic custom-box-shadow bs-hover prg-info-box" key={item.id}>
                            <h5>{item.title}</h5>
                            <div className="prg-info-box-content">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Datum zahájení</th>
                                            <td className="text-blue">{item.start}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </a>
                    ))
                    }
                </div>
                <Paginate
                    postsPerPage={itemsPerPage}
                    totalPosts={items.length}
                    paginate={paginate}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}

export default Dashboard;