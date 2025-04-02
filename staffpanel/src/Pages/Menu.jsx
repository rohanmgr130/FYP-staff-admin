import React from 'react'
import Nav from '../components/Nav'
import MenuManage from '../components/Menu/menumanage'
import Category from '../components/Menu/addmenuform'

function Menu() {
  return (
    <div className='flex w-full'>
    <Nav/>
    <MenuManage/>
    
    </div>
  )
}

export default Menu