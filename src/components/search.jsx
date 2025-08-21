import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  // helper function
  const updateSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search">
      <div className="search__wrapper">
        <input
          type="number"
          value={searchTerm}
          onChange={updateSearch}
          placeholder="Search posts by ID (e.g., 1, 2, 3...)"
          className="search__input"
          min="1"
        />
      </div>
      {searchTerm && (
        <div className="search__status">
          Searching for post ID: {searchTerm}
        </div>
      )}
    </div>
  );
};

export default Search;
