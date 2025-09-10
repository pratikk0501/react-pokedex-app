import { useState, useEffect } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

function PokeCard(props) {
  const { selectedPokemon } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [skill, setSkill] = useState(null);
  const [loadingMove, setLoadingMove] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imageList = Object.keys(sprites || {}).filter((key) => {
    if (["versions", "other"].includes(key)) {
      return false;
    }
    if (!sprites[key]) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingMove || !moveUrl || !localStorage) {
      return;
    }

    // define the cache

    let moveCache = {};
    if (localStorage.getItem("poké-moves")) {
      moveCache = JSON.parse(localStorage.getItem("poké-moves"));
    }

    // check if the move is in the cache

    if (moveCache[move]) {
      setSkill(moveCache[move]);
      return;
    }

    // if not in the cache, fetch from the API

    try {
      setLoadingMove(true);
      const response = await fetch(moveUrl);
      const moveData = await response.json();
      const description = moveData?.flavor_text_entries?.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      moveCache[move] = skillData;
      localStorage.setItem("poké-moves", JSON.stringify(moveCache));
    } catch (error) {
      console.error("Error fetching move data:", error.message);
    } finally {
      setLoadingMove(false);
    }
  }

  useEffect(() => {
    // if loading, return

    if (loading || !localStorage) {
      return;
    }

    // check if the selected pokemon is in the cache
    //  1. define the cache

    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    //  2. check if the selected pokemon is in the cache

    if (cache[selectedPokemon]) {
      setData(cache[selectedPokemon]);
      return;
    }

    //  3. if not in the cache, fetch from the API

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(
            selectedPokemon
          )}`
        );
        const pokemonData = await response.json();
        setData(pokemonData);

        // if fetched from the API, add to the cache for future use

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (error) {
        console.error("Error fetching pokemon data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);

  if (loading) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}

      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types?.map((typeObj, typeindex) => {
          return <TypeCard key={typeindex} type={typeObj?.type?.name} />;
        })}
      </div>

      <img
        className="default-img"
        src={"/pokemon_main/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-image`}
      />

      <div className="img-container">
        {imageList?.map((imgKey, index) => {
          return (
            <img
              key={index}
              className="sprite-img"
              src={sprites[imgKey]}
              alt={`${name}-${imgKey}`}
            />
          );
        })}
      </div>

      <h3>Stats</h3>
      <div>
        {stats?.map((statObj, index) => {
          const { stat, base_stat } = statObj;
          return (
            <div className="stat-item" key={index}>
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>

      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves?.map((moveObj, index) => {
          return (
            <button
              className="button-card pokemon-move"
              key={index}
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              {moveObj?.move?.name.replaceAll("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PokeCard;
