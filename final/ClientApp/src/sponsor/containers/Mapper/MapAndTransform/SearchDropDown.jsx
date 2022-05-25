import React from "react";

function SearchDropDown({ searchTerm, pageIndexes }) {
  return (
    <div>
      {(() => {
        if (searchTerm && searchTerm != "") {
          return (
            <div>
              {/* pageIndexes? pageIndexes.map( _name => <p>_name</p>):<></> */}
            </div>
          );
        }
      })()}
    </div>
  );
}

export default SearchDropDown;
