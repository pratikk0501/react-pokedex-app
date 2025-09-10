import { first151Pokemon, getFullPokedexNumber } from "../utils";
import { useState } from "react";

function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, showSideNav, setShowSideNav } =
    props;

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPokemon = first151Pokemon.filter((pokemon, index) => {
    if (pokemon.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    if (getFullPokedexNumber(index).includes(searchTerm)) {
      return true;
    }
    return false;
  });

  return (
    <nav className={" " + (showSideNav ? "open" : " ")}>
      <div className={"header " + (showSideNav ? "open" : " ")}>
        <button
          className="close-nav-button"
          onClick={() => setShowSideNav(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h1 className="text-gradient">Pokédex</h1>
      </div>
      <input
        value={searchTerm}
        placeholder="Search by name or #"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      {filteredPokemon.map((pokemon, pokeIndex) => {
        const actualIndex = first151Pokemon.indexOf(pokemon);
        return (
          <button
            key={pokeIndex}
            className={
              "nav-card " +
              (selectedPokemon === actualIndex ? "nav-card-selected" : " ")
            }
            onClick={() => {
              setSelectedPokemon(actualIndex);
              setShowSideNav(false);
            }}
          >
            <p>{getFullPokedexNumber(actualIndex)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}

export default SideNav;
