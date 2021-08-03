import { link, NavLink } from 'react-router-dom'

const Nav = () => {
    return (
      <ul className="Navbar">
          <li><NavLink exact to="/" activeStyle={{fontWeight: "bold", color: "white", textDecoration: "none"}}></NavLink></li>
          <li><NavLink exact to="/" activeStyle={{fontWeight: "bold", color:"white", textDecoration: "none"}}></NavLink></li>
          <li><NavLink exact to="/" activeStyle={{fontWeight: "bold", color:"white", textDecoration: "none"}}></NavLink></li>
          <li><NavLink exact to="/" activeStyle={{fontWeight: "bold", color:"white", textDecoration: "none"}}></NavLink></li>
      </ul>     
    )
  }
  
  export default Nav;