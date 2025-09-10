import { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PokeCard from "./components/PokeCard";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideNav, setShowSideNav] = useState(true);

  function toggleSideNav() {
    setShowSideNav(!showSideNav);
  }

  return (
    <>
      <Header toggleSideNav={toggleSideNav} />
      <SideNav
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;
