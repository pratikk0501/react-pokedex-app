function Header(props) {
  const { toggleSideNav } = props;

  return (
    <header>
      <button className="open-nav-button" onClick={toggleSideNav}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokédex</h1>
    </header>
  );
}

export default Header;
