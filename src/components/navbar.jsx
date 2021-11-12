// Stateless Functional Component
// sfc shortcut for creating stateless functional component

const NavBar = (props) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#'">
          Navbar
          <span className="badge rounded-pill bg-secondary m-2">
            {props.totalCounters}
          </span>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
