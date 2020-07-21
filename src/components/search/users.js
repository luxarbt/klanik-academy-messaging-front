import React, { useContext } from "react"
import UserContext from "../../context/UserContext"

export const Users = ({users}) => {
  const { userData } = useContext(UserContext)
  return (
    <div>
      <h3>Users : </h3>
      {users.map((user, i) => (
        <div key={i}>
          <li>
            {user.name} {user.surname}
          </li>
        </div>
      ))}
    </div>
  )
}
