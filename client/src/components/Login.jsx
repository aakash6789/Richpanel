import React from 'react'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/api/v1/users/login', formData);
        console.log(response.data); 
      } catch (error) {
        console.error('Error registering user:', error);
      }
    };
     
  return (
    <div className='bg-white h-[58dvh] xsm:h-[58dvh] w-[30%] ml-[37%] mt-[10%] rounded-md'>
         <h2 className='pt-[10%] font-bold font-sans'>Login to your account</h2>
    <form onSubmit={handleSubmit} className='relative'>
        <div className='flex-col relative justify-between'>
    <div className="mt-[5dvh] ml-[10%]">
      <p className='text-left pl-[5%]'>Email</p>
      <input type="email" name="email" value={formData.email} onChange={handleChange}  className='pl-[2%] absolute left-[15%]  mt-1 rounded-md border-[2px] h-[5dvh] w-[70%]' />
    </div>
    <div className="mt-[8dvh] ml-[10%]">
      <p className='text-left pl-[5%]'>Password</p>
      <input type="password" name="password" value={formData.password} onChange={handleChange} className='pl-[2%] absolute left-[15%]  mt-1 rounded-md border-[2px] h-[5dvh] w-[70%]' />
    </div>

      <button type="submit" className='bg-[#0c1594] mt-[10dvh] text-white w-[70%] p-[1%] rounded-sm '>Sign in</button>
      <p className='ml-[13%] mt-[3dvh] w-[70%] text-[0.7em]'>New to MyApp? <NavLink to='/' className=' text-blue-300'>Sign Up</NavLink></p>
    </div>
  </form>
  
</div>
  )
}

export default Login
